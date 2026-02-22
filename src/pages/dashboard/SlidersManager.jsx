import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Edit, Plus, X, Video, Image, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { defaultSlides, aboutSlides, projectSlides } from '../../data/sliders';

const LOCATIONS = [
    { id: 1, name: 'Home Page' },
    { id: 2, name: 'About Page' },
    { id: 3, name: 'Projects Page' },
    { id: 4, name: 'Certificates Page' },
    { id: 5, name: 'Careers Page' },
    { id: 6, name: 'Services Page' },
    { id: 7, name: 'Sitemap Page' },
    { id: 8, name: 'Contact Page' }
];

// Base URL for images
const API_HOST = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5026';

export default function SlidersManager() {
    const { user } = useAuth();
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hiddenStaticIds, setHiddenStaticIds] = useState(() => {
        const saved = localStorage.getItem('hiddenSliders');
        return saved ? JSON.parse(saved) : [];
    });
    const [legacyId, setLegacyId] = useState(null);

    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        heading: '',
        text: '',
        image: null,
        video: null,
        SliderLocationID: 1
    });
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        fetchSliders();
    }, []);

    useEffect(() => {
        localStorage.setItem('hiddenSliders', JSON.stringify(hiddenStaticIds));
    }, [hiddenStaticIds]);

    const fetchSliders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/Slider/GetAll');
            const combinedStatic = [...defaultSlides, ...aboutSlides, ...projectSlides];
            console.log("Static Sliders Loaded:", combinedStatic);
            const staticSliders = combinedStatic.map(s => ({ ...s, isStatic: true, id: `static-slider-${s.id}` }));
            setSliders([...staticSliders, ...response.data]);
            setError(null);
        } catch (error) {
            console.error("Error fetching sliders", error);
            const combinedStatic = [...defaultSlides, ...aboutSlides, ...projectSlides];
            const staticSliders = combinedStatic.map(s => ({ ...s, isStatic: true, id: `static-slider-${s.id}` }));
            setSliders(staticSliders);
            setError("Failed to load sliders from API (showing static only).");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({
            heading: '',
            text: '',
            image: null,
            video: null,
            SliderLocationID: activeTab === 0 ? 1 : activeTab
        });
        setGalleryImages([]);
        setShowForm(false);
        setIsSubmitting(false);
        setLegacyId(null);
    };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else if (e.target.name === 'video') {
            setFormData({ ...formData, video: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleGalleryChange = (e) => {
        if (e.target.files) {
            setGalleryImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        data.append('heading', formData.heading);
        data.append('text', formData.text);
        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.video) {
            data.append('video', formData.video);
        }
        data.append('SliderLocationID', formData.SliderLocationID || 1);

        if (galleryImages.length > 0) {
            galleryImages.forEach((file) => {
                data.append('images', file);
            });
        }

        try {
            if (editingItem) {
                await api.put(`/Slider/Update/${editingItem.id}`, data);
            } else {
                await api.post('/Slider/Create', data);

                if (legacyId) {
                    setHiddenStaticIds(prev => [...prev, legacyId]);
                }
            }
            await fetchSliders();
            resetForm();
        } catch (error) {
            console.error("Error saving slider", error);
            const status = error.response?.status;
            const data = error.response?.data;
            let msg = "Failed to save slider.";

            if (status === 400) {
                // Validation error
                msg = `Validation Error: ${JSON.stringify(data.errors || data)}`;
            } else if (status === 401) {
                msg = "Unauthorized: Please log in again.";
            } else if (status === 403) {
                // Explicitly show the role to help user debug
                const currentRole = user?.role ? (Array.isArray(user.role) ? user.role.join(', ') : user.role) : 'Unknown';
                msg = `Permission Denied: Your current role is '${currentRole}'. This action likely requires 'Main Admin'.`;
            } else if (data?.message) {
                msg = `Error: ${data.message}`;
            } else if (typeof data === 'string') {
                msg = `Error: ${data}`;
            }

            alert(msg);
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const item = sliders.find(s => s.id === id);
        if (item?.isStatic) {
            if (window.confirm("This is a hardcoded slider. It cannot be permanently deleted from the database, but it can be hidden from this list. Hide it?")) {
                setHiddenStaticIds(prev => [...prev, id]);
                setSliders(prev => prev.filter(s => s.id !== id));
            }
            return;
        }

        if (!window.confirm("Are you sure you want to delete this slider?")) return;
        try {
            await api.delete(`/Slider/Delete/${id}`);
            setSliders(sliders.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting slider", error);
            alert("Failed to delete slider.");
        }
    };

    const openEdit = async (item) => {
        setFormData({
            heading: item.heading || "",
            text: item.text || "",
            image: null,
            video: null,
            SliderLocationID: item.SliderLocationID || item.sliderLocationID || 1
        });
        setGalleryImages([]);

        if (item.isStatic) {
            setEditingItem(null); // Clone
            setLegacyId(item.id);

            // Try to fetch image
            if (item.image) {
                try {
                    const res = await fetch(item.image);
                    const blob = await res.blob();
                    const file = new File([blob], "migrated-slide.jpg", { type: blob.type });
                    setFormData(prev => ({ ...prev, image: file }));
                } catch (e) {
                    console.error("Failed to fetch static image", e);
                    alert("Warning: Could not automatically load the static image for cloning. Please upload the image manually.");
                }
            }
            // Try to fetch video
            if (item.video) {
                try {
                    const res = await fetch(item.video);
                    const blob = await res.blob();
                    const file = new File([blob], "migrated-video.mp4", { type: blob.type });
                    setFormData(prev => ({ ...prev, video: file }));
                } catch (e) {
                    console.error("Failed to fetch static video", e);
                    alert("Warning: Could not automatically load the static video for cloning. Please upload the video manually.");
                }
            }
        } else {
            setEditingItem(item);
        }
        setShowForm(true);
    };

    const getAssetUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Image className="text-primary" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Sliders Manager</h2>
                </div>
                {!showForm && (
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition"
                    >
                        <Plus size={18} /> Add Slider
                    </button>
                )}
            </div>

            {/* Location Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                {[{ id: 0, name: 'All' }, ...LOCATIONS].map(loc => {
                    const count = sliders.filter(s => {
                        if (hiddenStaticIds.includes(s.id)) return false;
                        if (loc.id === 0) return true;
                        const sLoc = s.SliderLocationID || s.sliderLocationID || 1;
                        return sLoc == loc.id;
                    }).length;

                    return (
                        <button
                            key={loc.id}
                            onClick={() => setActiveTab(loc.id)}
                            className={`pb-2 px-4 font-medium transition-colors relative flex items-center gap-2 ${activeTab === loc.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {loc.name}
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{count}</span>
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-4 rounded flex items-center gap-2">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            {editingItem ? 'Edit Slider' : 'New Slider'}
                            {user?.role && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-normal">Role: {Array.isArray(user.role) ? user.role.join(', ') : user.role}</span>}
                        </h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <select
                                name="SliderLocationID"
                                value={formData.SliderLocationID || (activeTab === 0 ? 1 : activeTab)}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                {LOCATIONS.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Heading</label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                    placeholder="e.g. Welcome to HAWK"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    accept="image/*"
                                    required={!editingItem && !formData.image} // Required only if not editing OR if we pre-filled it (formData.image might be file)
                                />
                                {(editingItem || formData.image) && <p className="text-xs text-gray-500 mt-1">{formData.image ? "Image selected/cloned" : "Leave empty to keep current image"}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Text</label>
                            <textarea
                                name="text"
                                value={formData.text}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                rows="3"
                                required
                                placeholder="Short description for the slider..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gallery Images (Multiple)</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleGalleryChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                accept="image/*"
                            />
                            <p className="text-xs text-gray-500 mt-1">Add additional images to the slider gallery</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Video (Optional)</label>
                            <input
                                type="file"
                                name="video"
                                onChange={handleChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                accept="video/*"
                            />
                            {formData.video && <p className="text-xs text-gray-500 mt-1">Video selected/cloned</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 flex items-center gap-2 disabled:opacity-70"
                            >
                                <Save size={18} />
                                {isSubmitting ? 'Saving...' : (editingItem ? 'Update Slider' : 'Create Slider')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading sliders...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heading</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sliders.filter(s => {
                                if (hiddenStaticIds.includes(s.id)) return false;
                                const loc = s.SliderLocationID || s.sliderLocationID || 1;
                                return activeTab === 0 || loc == activeTab;
                            }).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                                        No sliders found for this section. Create your first one above!
                                    </td>
                                </tr>
                            ) : (
                                sliders.filter(s => {
                                    if (hiddenStaticIds.includes(s.id)) return false;
                                    const loc = s.SliderLocationID || s.sliderLocationID || 1;
                                    return activeTab === 0 || loc == activeTab;
                                }).map((slider) => (
                                    <tr key={slider.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={slider.isStatic ? slider.image : getAssetUrl(slider.image)}
                                                    alt={slider.heading}
                                                    className="h-16 w-24 object-cover rounded border border-gray-200"
                                                    onError={(e) => { e.target.src = "https://placehold.co/100x60?text=No+Image"; }}
                                                />
                                                {slider.video && <Video size={20} className="text-gray-500" title="Has Video" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slider.heading}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={slider.text}>{slider.text}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openEdit(slider)} className="text-primary hover:opacity-80 mr-4">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(slider.id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
