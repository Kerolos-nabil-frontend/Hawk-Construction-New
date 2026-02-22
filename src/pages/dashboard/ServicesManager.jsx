import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { staticServices } from '../../data/servicesData';
import { allProjects as staticProjects } from '../../data/projects';
import { certificates as staticCertificates, references as staticReferences } from '../../data/certificates';

// Base URL for images
const API_HOST = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5026';

export default function ServicesManager() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [hiddenStaticIds, setHiddenStaticIds] = useState(() => {
        const saved = localStorage.getItem('hiddenServices');
        return saved ? JSON.parse(saved) : [];
    });
    const [legacyId, setLegacyId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        linkedProjectIds: [],
        linkedCertificate: ""
    });
    const [allProjects, setAllProjects] = useState([]);
    const [allCertificates, setAllCertificates] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const [servicesRes, projectsRes, certsRes, refsRes] = await Promise.all([
                api.get('/Service/GetAll'),
                api.get('/Project/GetAll'),
                api.get('/Certificate/GetAll?type=certificate'),
                api.get('/Certificate/GetAll?type=reference')
            ]);

            const combinedProjects = [
                ...(projectsRes.data || []),
                ...staticProjects.map((p, i) => ({ ...p, id: `static-${i}`, isStatic: true }))
            ];
            setAllProjects(combinedProjects);

            // Combine Certificates
            const sCerts = staticCertificates.map(c => ({ id: c.id, title: c.title, type: 'Static Certificate' }));
            const sRefs = staticReferences.map(r => ({ id: r.id, title: r.title, type: 'Static Reference' }));
            const dCerts = (certsRes.data || []).map(c => ({ id: `api-${c.id || c.Id}`, title: c.title || c.Title, type: 'Dynamic Certificate' }));
            setAllCertificates([...sCerts, ...sRefs, ...dCerts]);

            // Map and normalize dynamic services to ensure 'id' property exists
            const normalizedDynamic = (servicesRes.data || []).map(s => ({
                ...s,
                id: s.id || s.Id,
                title: s.title || s.Title,
                description: s.description || s.Description,
                image: s.image || s.Image || s.iconPath || s.IconPath
            }));

            const mappedStatic = staticServices.map(s => ({
                ...s,
                isStatic: true,
            }));

            console.log("Fetched Services Raw:", servicesRes.data);
            setServices([...mappedStatic, ...normalizedDynamic]);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            const mappedStatic = staticServices.map(s => ({ ...s, isStatic: true }));
            setServices(mappedStatic);
            setError("Failed to load dynamic services.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        localStorage.setItem('hiddenServices', JSON.stringify(hiddenStaticIds));
    }, [hiddenStaticIds]);

    const handleDelete = async (itemId) => {
        // Normalize and trim the ID
        const id = String(itemId).trim();
        if (!id || id === 'undefined' || id === 'null') {
            alert("Error: Invalid Service ID. Please refresh the page and try again.");
            return;
        }

        // Check if static
        const isStatic = id.startsWith('static-');
        if (isStatic) {
            if (window.confirm("This is a hardcoded service. It cannot be permanently deleted, but it can be hidden. Hide it?")) {
                setHiddenStaticIds(prev => [...prev, id]);
                setServices(prev => prev.filter(item => (item.id || item.Id) !== id));
            }
            return;
        }

        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            await api.delete(`/Service/Delete/${id}`);
            setServices(prev => prev.filter(item => (item.id || item.Id) !== id));
        } catch (err) {
            console.error("Delete failed:", err);

            if (err.response?.status === 401) {
                alert("Session Expired or Unauthorized (401). Please logout and login again to refresh your session.");
                return;
            }

            const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
            const status = err.response?.status ? ` (Status: ${err.response.status})` : "";

            alert(`Failed to delete service${status}: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    };

    const handleEdit = async (item) => {
        const rawLinked = item.linkedProjectIds || item.LinkedProjectIds || item.projectIds || item.ProjectIds || item.projects || item.Projects;
        let linkedIds = [];
        if (rawLinked) {
            if (Array.isArray(rawLinked)) {
                linkedIds = rawLinked.map(val => (val && typeof val === 'object') ? String(val.id || val.Id) : String(val));
            } else {
                linkedIds = String(rawLinked).split(',').filter(Boolean);
            }
        }

        setFormData({
            title: item.title || "",
            description: item.description || "",
            linkedProjectIds: linkedIds,
            linkedCertificate: item.linkedCertificate || item.LinkedCertificate || "",
        });
        setSelectedImage(null);

        if (item.isStatic) {
            if (window.confirm("This is a hardcoded service. To edit it, a copy will be created in the database. Continue?")) {
                setEditingItem(null); // Treat as new for API but pre-fill
                setLegacyId(item.id);
                // We cannot easily convert the static Icon component to an image file.
                // So user must upload a new image if they edit a static service.
            } else {
                return;
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
            linkedProjectIds: [],
            linkedCertificate: "",
        });
        setSelectedImage(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        if (formData.description) {
            data.append('description', formData.description);
        }
        data.append('linkedProjectIds', formData.linkedProjectIds.join(','));
        data.append('LinkedProjectIds', formData.linkedProjectIds.join(','));
        data.append('ProjectIds', formData.linkedProjectIds.join(','));

        if (formData.linkedCertificate) {
            data.append('linkedCertificate', formData.linkedCertificate);
            data.append('LinkedCertificate', formData.linkedCertificate);
        }

        if (selectedImage) {
            data.append('image', selectedImage);
        }

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingItem) {
                await api.put(`/Service/Update/${editingItem.id}`, data, config);
            } else {
                await api.post('/Service/Create', data, config);
            }

            if (legacyId) {
                setHiddenStaticIds(prev => [...prev, legacyId]);
            }
            await fetchServices();
            resetForm();
        } catch (err) {
            console.error("Submission failed:", err);
            console.error("Submission failed:", err);

            if (err.response?.status === 401) {
                alert("Session expired or unauthorized. Please log out and log in again.");
                return;
            }

            const msg = err.response?.data?.message
                || (typeof err.response?.data === 'string' ? err.response.data : "")
                || err.message
                || "Failed to save service.";

            const status = err.response?.status ? ` (Status: ${err.response.status})` : "";

            alert(`Error${status}: ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const allItems = services.filter(item => !hiddenStaticIds.includes(item.id));

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Services Manager</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition"
                >
                    <Plus size={18} /> Add New Service
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
                        <h3 className="text-lg font-semibold">{editingItem ? 'Edit Service' : 'New Service'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image/Icon</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {editingItem && !selectedImage && (
                                <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image</p>
                            )}
                            {(legacyId || !editingItem) && !selectedImage && (
                                <p className="text-xs text-orange-500 mt-1">Ideally provide an image for new/cloned services.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Related Certificate</label>
                            <select
                                name="linkedCertificate"
                                value={formData.linkedCertificate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border rounded p-2 bg-white"
                            >
                                <option value="">Select Certificate (Optional)</option>
                                {allCertificates.map((cert, idx) => (
                                    <option key={`${cert.id}-${idx}`} value={cert.id}>
                                        {cert.title} ({cert.type})
                                    </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-500 mt-1">Select a certificate or reference to associate with this service</p>
                        </div>

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
                            <p className="text-[10px] text-gray-500 mt-1">Select projects associated with this service</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 flex items-center gap-2 disabled:opacity-70"
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related Cert</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Projects</th>
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
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No services found.</td>
                            </tr>
                        ) : (
                            allItems.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.isStatic ? (
                                            <div className="h-10 w-10 text-primary bg-primary/10 rounded flex items-center justify-center">
                                                {/* If icon is component, render it. If not, fallback */}
                                                {item.icon ? React.cloneElement(item.icon, { size: 20 }) : <span className="text-xs">Icon</span>}
                                            </div>
                                        ) : (
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.title}
                                                className="h-10 w-10 object-cover rounded"
                                                onError={(e) => { e.target.src = "https://placehold.co/100?text=No+Img"; }}
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                        {(() => {
                                            const certId = item.linkedCertificate || item.LinkedCertificate;
                                            if (!certId) return "-";
                                            const cert = allCertificates.find(c => String(c.id) === String(certId));
                                            return cert ? cert.title : "-";
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {(() => {
                                            // 1. Explicitly Linked Projects
                                            const rawData = item.linkedProjectIds || item.LinkedProjectIds || item.projectIds || item.ProjectIds || item.projects || item.Projects;
                                            let explicitProjects = [];
                                            if (rawData) {
                                                let idArray = [];
                                                if (Array.isArray(rawData)) {
                                                    idArray = rawData.map(val => (val && typeof val === 'object') ? String(val.id || val.Id) : String(val));
                                                } else {
                                                    idArray = String(rawData).split(',').filter(Boolean);
                                                }
                                                explicitProjects = idArray.map(id => allProjects.find(ap => String(ap.id) === String(id))).filter(Boolean);
                                            }

                                            // 2. Scope-based Matching (Dynamic "Related" Projects)
                                            const matchedProjects = allProjects.filter(p =>
                                                p.scope && item.title && p.scope.toLowerCase().includes(item.title.toLowerCase())
                                            );

                                            // 3. Combine and Unique
                                            const uniqueProjects = Array.from(new Set([...explicitProjects, ...matchedProjects]));

                                            if (uniqueProjects.length === 0) return "-";

                                            const projectString = uniqueProjects.map(p => p.title).join(', ');

                                            return (
                                                <div className="max-w-xs truncate" title={projectString}>
                                                    {projectString}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                        <button onClick={() => handleEdit(item)} className="text-primary hover:opacity-80">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
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
