import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Edit, Plus, X, Video, Image } from 'lucide-react';

export default function SlidersManager() {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [formData, setFormData] = useState({
        heading: '',
        text: '',
        image: null,
        video: null
    });

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const response = await api.get('/Slider/GetAll');
            setSliders(response.data);
        } catch (error) {
            console.error("Error fetching sliders", error);
        } finally {
            setLoading(false);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('heading', formData.heading);
        data.append('text', formData.text);
        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.video) {
            data.append('video', formData.video);
        }

        try {
            if (editingItem) {
                await api.put(`/Slider/Update/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/Slider/Create', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchSliders();
            setShowModal(false);
            setEditingItem(null);
            setFormData({ heading: '', text: '', image: null, video: null });
        } catch (error) {
            console.error("Error saving slider", error);
            alert("Failed to save slider.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slider?")) return;
        try {
            await api.delete(`/Slider/Delete/${id}`);
            fetchSliders();
        } catch (error) {
            console.error("Error deleting slider", error);
        }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            heading: item.heading,
            text: item.text,
            image: null,
            video: null
        });
        setShowModal(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manage Sliders</h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ heading: '', text: '', image: null, video: null });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
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
                            {sliders.map((slider) => (
                                <tr key={slider.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {slider.image && <img src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${slider.image}`} alt={slider.heading} className="h-12 w-12 object-cover rounded" />}
                                            {slider.video && <Video size={16} className="text-gray-500" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{slider.heading}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{slider.text}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openEdit(slider)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(slider.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                            {sliders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No sliders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Slider' : 'Add Slider'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Heading</label>
                                <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Text</label>
                                <textarea name="text" value={formData.text} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="3" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input type="file" name="image" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500" accept="image/*" required={!editingItem} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Video (Optional)</label>
                                <input type="file" name="video" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500" accept="video/*" />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingItem ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
