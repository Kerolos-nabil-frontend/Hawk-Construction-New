import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

// Base URL for images (host without /api)
const API_HOST = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5026';

import { certificates as staticCerts, references as staticRefs } from '../../data/certificates';
import { allProjects as staticProjects } from '../../data/projects';
import { staticServices } from '../../data/servicesData';

export default function CertificatesManager() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [hiddenStaticIds, setHiddenStaticIds] = useState(() => {
        const saved = localStorage.getItem('hiddenCertificates');
        return saved ? JSON.parse(saved) : [];
    });
    const [legacyId, setLegacyId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "certificate", // 'certificate', 'approval', or 'reference'
        linkedProjectIds: [],
        linkedServiceIds: []
    });
    const [allProjects, setAllProjects] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [certsRes, appsRes, offRes, refsRes, projectsRes, servicesRes] = await Promise.all([
                api.get('Certificate/GetAll?type=certificate'),
                api.get('Certificate/GetAll?type=approval'),
                api.get('Certificate/GetAll?type=official_approval'),
                api.get('Certificate/GetAll?type=reference'),
                api.get('Project/GetAll'),
                api.get('Service/GetAll')
            ]);

            const combinedProjects = [
                ...(projectsRes.data || []),
                ...staticProjects.map((p, i) => ({ ...p, id: `static-${i}`, isStatic: true }))
            ];

            const combinedServices = [
                ...(servicesRes.data || []),
                ...staticServices.map((s, i) => ({ ...s, id: s.id || `static-${i}`, isStatic: true }))
            ];

            setAllProjects(combinedProjects);
            setAllServices(combinedServices);

            const sCerts = staticCerts.map(c => ({ ...c, category: c.category || 'certificate', isStatic: true, id: `static-cert-${c.id}` }));
            const sRefs = staticRefs.map(r => ({ ...r, category: r.category || 'reference', isStatic: true, id: `static-ref-${r.id}` }));

            setCertificates([...sCerts, ...certsRes.data, ...appsRes.data, ...offRes.data]);
            setReferences([...sRefs, ...refsRes.data]);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            const sCerts = staticCerts.map(c => ({ ...c, category: 'certificate', isStatic: true, id: `static-cert-${c.id}` }));
            const sRefs = staticRefs.map(r => ({ ...r, category: 'reference', isStatic: true, id: `static-ref-${r.id}` }));
            setCertificates(sCerts);
            setReferences(sRefs);
            setError(`Failed to load certificates from API (showing static only).`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem('hiddenCertificates', JSON.stringify(hiddenStaticIds));
    }, [hiddenStaticIds]);

    const handleDelete = async (id, category) => {
        // Check if static
        const isStatic = String(id).startsWith('static-');
        if (isStatic) {
            if (window.confirm("This is a hardcoded item. It cannot be permanently deleted, but it can be hidden. Hide it?")) {
                setHiddenStaticIds(prev => [...prev, id]);
                if (category === 'reference') {
                    setReferences(prev => prev.filter(item => item.id !== id));
                } else {
                    setCertificates(prev => prev.filter(item => item.id !== id));
                }
            }
            return;
        }

        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await api.delete(`Certificate/Delete/${id}`);
            if (category === 'reference') {
                setReferences(prev => prev.filter(item => item.id !== id));
            } else {
                setCertificates(prev => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete item.");
        }
    };

    const handleEdit = async (item) => {
        const rawProj = item.linkedProjectIds || item.LinkedProjectIds || item.projectIds || item.ProjectIds || item.projects || item.Projects;
        const rawServ = item.linkedServiceIds || item.LinkedServiceIds || item.serviceIds || item.ServiceIds || item.services || item.Services;

        let pIds = [];
        if (rawProj) {
            if (Array.isArray(rawProj)) {
                pIds = rawProj.map(val => (val && typeof val === 'object') ? String(val.id || val.Id) : String(val));
            } else {
                pIds = String(rawProj).split(',').filter(Boolean);
            }
        }

        let sIds = [];
        if (rawServ) {
            if (Array.isArray(rawServ)) {
                sIds = rawServ.map(val => (val && typeof val === 'object') ? String(val.id || val.Id) : String(val));
            } else {
                sIds = String(rawServ).split(',').filter(Boolean);
            }
        }

        setFormData({
            title: item.title || "",
            description: item.description || "",
            category: item.category ? item.category.toLowerCase() : "certificate",
            linkedProjectIds: pIds,
            linkedServiceIds: sIds,
        });
        setSelectedImage(null);
        setExtraImages([]);

        if (item.isStatic) {
            setEditingItem(null); // Clone
            setLegacyId(item.id);
            // Fetch image for clone
            if (item.image) {
                try {
                    const response = await fetch(item.image);
                    const blob = await response.blob();
                    const file = new File([blob], "migrated-image.jpg", { type: blob.type });
                    setSelectedImage(file);
                } catch (e) { console.error("Failed to fetch static image", e); }
            }
        } else {
            setEditingItem(item);
        }
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            description: "",
            category: "certificate",
            linkedProjectIds: [],
            linkedServiceIds: []
        });
        setSelectedImage(null);
        setExtraImages([]);
        setShowForm(false);
        setIsSubmitting(false);
        setLegacyId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleExtraImagesChange = (e) => {
        if (e.target.files) {
            setExtraImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('linkedProjectIds', formData.linkedProjectIds.join(','));
        data.append('LinkedProjectIds', formData.linkedProjectIds.join(','));
        data.append('ProjectIds', formData.linkedProjectIds.join(','));

        data.append('linkedServiceIds', formData.linkedServiceIds.join(','));
        data.append('LinkedServiceIds', formData.linkedServiceIds.join(','));
        data.append('ServiceIds', formData.linkedServiceIds.join(','));

        if (selectedImage) {
            data.append('image', selectedImage);
        }

        if (extraImages.length > 0) {
            extraImages.forEach(img => {
                data.append('images', img);
            });
        }

        try {
            if (editingItem) {
                await api.put(`Certificate/Update/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('Certificate/Create', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (legacyId) {
                    setHiddenStaticIds(prev => [...prev, legacyId]);
                }
            }
            // Refresh data to ensure custom sorts/IDs are synced
            await fetchData();
            resetForm();
        } catch (err) {
            console.error("Submission failed:", err);
            const status = err.response?.status;
            const data = err.response?.data;
            let msg = "Failed to save certificate.";

            if (status === 403) msg = "Permission Denied (403): You do not have the required role.";
            else if (status === 401) msg = "Unauthorized (401): Please log in again.";
            else if (data && data.message) msg = `Error (${status}): ${data.message}`;
            else if (typeof data === 'string') msg = `Error (${status}): ${data}`;
            else if (data) msg = `Error (${status}): ${JSON.stringify(data)}`;

            alert(msg);
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return "https://placehold.co/400x300?text=No+Image";
        if (path.startsWith('http')) return path;
        // If path starts with /server, prepend host
        return `${API_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const allItems = [...certificates, ...references].filter(item => !hiddenStaticIds.includes(item.id));

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Certificates & References Manager</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 btn-primary-dynamic"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-4 rounded flex items-center gap-2">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {showForm && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingItem ? 'Edit Item' : 'New Item'}</h3>
                        <button onClick={resetForm} className="close-btn-dynamic">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border rounded p-2"
                            >
                                <option value="certificate">Certificates Tab</option>
                                <option value="approval">Clients and Partners Tab</option>
                                <option value="official_approval">Approvals Tab</option>
                                <option value="reference">Reference Document</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Main Display Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                required={!editingItem}
                            />
                            {selectedImage && (
                                <div className="mt-2 relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        className="w-full h-full object-cover"
                                        alt="Main Preview"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                            {editingItem && !selectedImage && editingItem.image && (
                                <div className="mt-2 w-32 h-32 border rounded-lg overflow-hidden bg-gray-50 opacity-60">
                                    <img
                                        src={editingItem.isStatic ? editingItem.image : getImageUrl(editingItem.image)}
                                        className="w-full h-full object-cover"
                                        alt="Current"
                                    />
                                    <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">Current Image</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Additional Images (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleExtraImagesChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
                            />
                            {extraImages.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {extraImages.map((file, idx) => (
                                        <div key={idx} className="relative w-16 h-16 border rounded bg-gray-50">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover rounded"
                                                alt={`Extra ${idx}`}
                                            />
                                            <span className="absolute -top-2 -right-2 bg-secondary text-white text-[8px] rounded-full px-1">
                                                {idx + 1}
                                            </span>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setExtraImages([])}
                                        className="text-[10px] text-red-500 font-bold hover:underline"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}
                            <p className="text-[10px] text-gray-500 mt-1">Select multiple images if this certificate has pages or related documents.</p>
                        </div>

                        {/* Linking Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Projects</label>
                                <div className="border rounded-lg p-2 bg-white max-h-40 overflow-y-auto">
                                    {allProjects.map(proj => (
                                        <label key={proj.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.linkedProjectIds.includes(String(proj.id))}
                                                onChange={(e) => {
                                                    const id = String(proj.id);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        linkedProjectIds: e.target.checked
                                                            ? [...prev.linkedProjectIds, id]
                                                            : prev.linkedProjectIds.filter(x => x !== id)
                                                    }));
                                                }}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">{proj.title}</span>
                                        </label>
                                    ))}
                                    {allProjects.length === 0 && <p className="text-xs text-gray-400">No projects available</p>}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Select projects associated with this cert</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Services</label>
                                <div className="border rounded-lg p-2 bg-white max-h-40 overflow-y-auto">
                                    {allServices.map(service => (
                                        <label key={service.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.linkedServiceIds.includes(String(service.id))}
                                                onChange={(e) => {
                                                    const id = String(service.id);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        linkedServiceIds: e.target.checked
                                                            ? [...prev.linkedServiceIds, id]
                                                            : prev.linkedServiceIds.filter(x => x !== id)
                                                    }));
                                                }}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">{service.title}</span>
                                        </label>
                                    ))}
                                    {allServices.length === 0 && <p className="text-xs text-gray-400">No services available</p>}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Select services associated with this cert</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white btn-primary-dynamic flex items-center gap-2 disabled:opacity-70"
                            >
                                <Save size={18} />
                                {isSubmitting ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                            </tr>
                        ) : allItems.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No items found.</td>
                            </tr>
                        ) : (
                            allItems.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative inline-block">
                                            <img
                                                src={item.isStatic ? item.image : getImageUrl(item.image)}
                                                alt={item.title}
                                                className="h-12 w-12 object-cover rounded shadow-sm"
                                                onError={(e) => { e.target.src = "https://placehold.co/100?text=Error"; }}
                                            />
                                            {(item.images?.length > 0 || item.Images?.length > 0) && (
                                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border-2 border-white">
                                                    +{item.images?.length || item.Images?.length}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${item.category === 'approval' ? 'bg-blue-50 text-blue-600' :
                                            item.category === 'official_approval' ? 'bg-orange-50 text-orange-600' :
                                                item.category === 'certificate' ? 'bg-green-50 text-green-600' :
                                                    'bg-gray-50 text-gray-600'
                                            }`}>
                                            {item.category === 'approval' ? 'Clients/Partners' :
                                                item.category === 'official_approval' ? 'Approvals' :
                                                    item.category === 'certificate' ? 'Certificates' :
                                                        item.category || 'Other'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {(() => {
                                            // 1. Explicitly Linked Projects
                                            const rawP = item.linkedProjectIds || item.LinkedProjectIds || item.projectIds || item.ProjectIds || item.projects || item.Projects;
                                            let explicitP = [];
                                            if (rawP) {
                                                let idArray = [];
                                                if (Array.isArray(rawP)) {
                                                    idArray = rawP.map(val => (val && typeof val === 'object') ? String(val.id || val.Id) : String(val));
                                                } else {
                                                    idArray = String(rawP).split(',').filter(Boolean);
                                                }
                                                explicitP = idArray.map(id => allProjects.find(ap => String(ap.id) === String(id))).filter(Boolean);
                                            }

                                            // 2. Text-based matching (Dynamic Related)
                                            // Matching logic similar to Certificates Page
                                            const searchTerms = (item.title || "").toLowerCase().split(' ')
                                                .filter(word => word.length > 3 && !['from', 'certificate', 'company', 'ministry'].includes(word));

                                            const matchedP = allProjects.filter(p => {
                                                const pTitle = (p.title || "").toLowerCase();
                                                if (item.title && pTitle.includes(item.title.toLowerCase())) return true;
                                                const matches = searchTerms.filter(term => pTitle.includes(term));
                                                return matches.length >= 2;
                                            });

                                            const uniqueP = Array.from(new Set([...explicitP, ...matchedP]));

                                            // Explicitly Linked Services
                                            const rawS = item.linkedServiceIds || item.LinkedServiceIds || item.serviceIds || item.ServiceIds || item.services || item.Services;
                                            let explicitS = [];
                                            if (rawS) {
                                                let idArray = [];
                                                if (Array.isArray(rawS)) {
                                                    idArray = rawS.map(val => (val && typeof val === 'object') ? String(val.id || val.Id) : String(val));
                                                } else {
                                                    idArray = String(rawS).split(',').filter(Boolean);
                                                }
                                                explicitS = idArray.map(id => allServices.find(as => String(as.id) === String(id))).filter(Boolean);
                                            }

                                            if (uniqueP.length === 0 && explicitS.length === 0) return "-";

                                            return (
                                                <div className="space-y-1">
                                                    {uniqueP.length > 0 && (
                                                        <div>
                                                            <span className="font-bold text-primary">Projects: </span>
                                                            <span className="break-words">{uniqueP.map(p => p.title).join(', ')}</span>
                                                        </div>
                                                    )}
                                                    {explicitS.length > 0 && (
                                                        <div>
                                                            <span className="font-bold text-secondary">Services: </span>
                                                            <span className="break-words">{explicitS.map(s => s.title).join(', ')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                        <>
                                            <button onClick={() => handleEdit(item)} className="text-primary hover:opacity-80">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id, item.category)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
