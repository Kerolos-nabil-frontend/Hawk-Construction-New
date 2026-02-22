import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Video, X, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/imageHelper';


import { allProjects as staticProjects } from '../../data/projects';
import { servicesList } from '../../data/servicesList';
import { staticServices } from '../../data/servicesData';
import { certificates as staticCertificates, references as staticReferences } from '../../data/certificates';

export default function ProjectsManager() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [allCertificates, setAllCertificates] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [allServiceOptions, setAllServiceOptions] = useState(servicesList);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProject, setEditingProject] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hiddenStaticIds, setHiddenStaticIds] = useState(() => {
        const saved = localStorage.getItem('hiddenProjects');
        return saved ? JSON.parse(saved) : [];
    });
    const [legacyId, setLegacyId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Commercial",
        scope: "",
        area: "",
        contractor: "",
        owner: "",
        linkedCertificate: "",
        description: "", // Note: Not currently used in backend model but kept for future
        isMultiPhase: false, // Note: Not currently used in backend model
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        localStorage.setItem('hiddenProjects', JSON.stringify(hiddenStaticIds));
    }, [hiddenStaticIds]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get('/Project/GetAll');
            // Sort by ID descending (newest first)
            const dynamicProjects = (response.data && Array.isArray(response.data)) ? response.data.sort((a, b) => b.id - a.id) : [];

            // Map static projects
            const mappedStaticProjects = staticProjects.map((p, i) => ({
                ...p,
                id: `static-${i}`,
                isStatic: true,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.images
            }));

            // Fetch Dynamic Certificates and References
            const [certsRes, refsRes] = await Promise.all([
                api.get('/Certificate/GetAll?type=certificate'),
                api.get('/Certificate/GetAll?type=reference')
            ]).catch(err => {
                console.warn("Failed to fetch dynamic certs", err);
                return [{ data: [] }, { data: [] }];
            });

            // Combine all cert options for dropdown
            // Static Certs
            const sCerts = staticCertificates.map(c => ({
                id: c.id,
                title: c.title,
                type: 'Static Certificate'
            }));

            // Static Refs
            const sRefs = staticReferences.map(r => ({
                id: r.id, // Note: Static Refs might share IDs with Static Certs, but we use them as is.
                // If they share IDs, linking to "1" links to both. This is acceptable legacy behavior.
                title: r.title,
                type: 'Static Reference'
            }));

            // Dynamic Certs
            const dCerts = (certsRes.data || []).map(c => ({
                id: `api-${c.id}`, // specific prefix for dynamic to distinguish/match public page logic if needed?
                // Actually public page maps them to `api-${id}`.
                // So if we save `api-${id}`, public page logic `certIdStr === projCertIdStr` works.
                title: c.title,
                type: 'Dynamic Certificate'
            }));

            // Dynamic Refs
            const dRefs = (refsRes.data || []).map(r => ({
                id: `api-ref-${r.id}`, // We might need to handle this in public page too if we want perfect matching?
                // Public page maps references: `apiCertificates` are mapped with `api-`.
                // But references are NOT fetched from API in public page explicitly?
                // CertificatesPage uses `references` import (static).
                // It does NOT seem to fetch dynamic references.
                // So for now, we only care about Dynamic Certificates.
                // But let's include them just in case user wants to link them for future.
                title: r.title,
                type: 'Dynamic Reference'
            }));

            setAllCertificates([...sCerts, ...sRefs, ...dCerts]);

            // Fetch Dynamic Services
            const servicesRes = await api.get('/Service/GetAll').catch(err => ({ data: [] }));
            const dynamicServices = servicesRes.data || [];

            // Combine all services for selection list (just titles)
            const allServiceTitles = Array.from(new Set([
                ...servicesList,
                ...staticServices.map(s => s.title),
                ...dynamicServices.map(s => s.title)
            ])).sort();

            setAllServices(dynamicServices); // Keep dynamic objects for linking logic
            // We'll use allServiceTitles for the dropdown
            // To make it accessible in the component, we can store it in a new state or just use a local ref.
            // Let's store it in a state or just use the combined list in render.
            // Actually, let's create a state for it.
            setAllServiceOptions(allServiceTitles);

            const normalizedDynamic = dynamicProjects.map(p => {
                // Helper to extract string from potential object or primitive
                const extract = (val) => {
                    if (!val) return null;
                    if (typeof val === 'object') {
                        return val.name || val.Title || val.title || val.Label || val.label || val.text || JSON.stringify(val);
                    }
                    return String(val);
                };

                // Find category using multiple possible keys
                const rawCat = p.category || p.Category || p.projectCategory || p.ProjectCategory ||
                    p.project_category || p.categoryName || p.CategoryName || p.type || p.Type ||
                    p.projectType || p.ProjectType || p.kind || p.Kind;
                const cat = extract(rawCat) || "Commercial";

                // Find owner using multiple possible keys
                const rawOwn = p.owner || p.Owner || p.projectOwner || p.ProjectOwner || p.client || p.Client || p.customer || p.Customer;
                const own = extract(rawOwn) || "";

                return {
                    ...p,
                    category: cat,
                    owner: own,
                    scope: extract(p.scope || p.Scope) || "",
                    area: extract(p.area || p.Area) || "",
                    contractor: extract(p.contractor || p.Contractor) || "",
                    linkedCertificate: p.linkedCertificate || p.LinkedCertificate || "",
                    description: extract(p.description || p.Description) || ""
                };
            });

            console.log("Normalized Projects:", normalizedDynamic);
            setProjects([...normalizedDynamic, ...mappedStaticProjects]);
            setError(null);
        } catch (error) {
            console.error("Error fetching projects", error);
            setError(`Failed to load projects: ${error.message || 'Unknown error'}`);
            const mappedStaticProjects = staticProjects.map((p, i) => ({
                ...p,
                id: `static-${i}`,
                isStatic: true,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.images
            }));
            setProjects(mappedStaticProjects);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const project = projects.find(p => p.id === id);
        if (project?.isStatic) {
            if (window.confirm("This is a hardcoded project. It cannot be permanently deleted from the database, but it can be hidden from this list. Hide it?")) {
                setHiddenStaticIds(prev => [...prev, id]);
                setProjects(prev => prev.filter(p => p.id !== id));
            }
            return;
        }

        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/Project/Delete/${id}`);
            setProjects(projects.filter(project => project.id !== id));
        } catch (error) {
            console.error("Error deleting project", error);
            alert("Failed to delete project");
        }
    };

    const handleEdit = (project) => {
        if (project.isStatic) {
            if (window.confirm("This is a hardcoded project. To edit it, we must create a copy in the database. Continue?")) {
                setLegacyId(project.id);
                setEditingProject(null);
                setFormData({
                    title: project.title,
                    category: project.category || "",
                    scope: project.scope || "",
                    area: project.area || "",
                    contractor: project.contractor || "",
                    owner: project.owner || "",
                    linkedCertificate: project.linkedCertificate || "",
                    description: project.description || "",
                    isMultiPhase: project.isMultiPhase || false,
                });
            }
        } else {
            setEditingProject(project);
            setFormData({
                title: project.title,
                category: project.category || "General",
                scope: project.scope || "",
                area: project.area || "",
                contractor: project.contractor || "",
                owner: project.owner || "",
                linkedCertificate: project.linkedCertificate || "",
                description: project.description || "",
                isMultiPhase: project.isMultiPhase || false,
            });
        }
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingProject(null);
        setFormData({
            title: "",
            category: "Commercial",
            scope: "",
            area: "",
            contractor: "",
            owner: "",
            linkedCertificate: "",
            description: "",
            isMultiPhase: false,
        });
        setSelectedImages([]);
        setGalleryImages([]);
        setSelectedVideo(null);
        setShowForm(false);
        setIsSubmitting(false);
        setLegacyId(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const handleGalleryChange = (e) => {
        if (e.target.files) {
            setGalleryImages(Array.from(e.target.files));
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('Title', formData.title);

        data.append('area', formData.area);
        data.append('Area', formData.area);

        data.append('scope', formData.scope);
        data.append('Scope', formData.scope);

        data.append('contractor', formData.contractor);
        data.append('Contractor', formData.contractor);

        data.append('owner', formData.owner);
        data.append('Owner', formData.owner);
        data.append('ProjectOwner', formData.owner);
        data.append('Client', formData.owner);
        data.append('Customer', formData.owner);

        data.append('linkedCertificate', formData.linkedCertificate);
        data.append('LinkedCertificate', formData.linkedCertificate);

        data.append('category', formData.category);
        data.append('Category', formData.category);
        data.append('ProjectCategory', formData.category);
        data.append('projectCategory', formData.category);
        data.append('CategoryName', formData.category);
        data.append('Type', formData.category);

        data.append('description', formData.description);
        data.append('Description', formData.description);

        if (selectedImages.length > 0) {
            data.append('image', selectedImages[0]);
        }

        if (galleryImages.length > 0) {
            galleryImages.forEach((file) => {
                data.append('images', file);
            });
        }

        if (selectedVideo) {
            data.append('video', selectedVideo);
        }

        try {
            if (editingProject) {
                await api.put(`/Project/Update/${editingProject.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/Project/Create', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // If we successfully cloned a static project, hide the original
                if (legacyId) {
                    setHiddenStaticIds(prev => [...prev, legacyId]);
                }
            }
            await fetchProjects();
            resetForm();
        } catch (error) {
            console.error("Error saving project", error);
            const status = error.response?.status;
            const data = error.response?.data;
            let msg = "Failed to save project.";

            if (status === 403) msg = "Permission Denied (403): You do not have the required role to perform this action.";
            else if (status === 401) msg = "Unauthorized (401): Session expired. Please log in again.";
            else if (data && data.errors) {
                // Handle validation errors from ASP.NET
                const messages = Object.values(data.errors).flat();
                msg = `Validation Error: ${messages.join(', ')}`;
            }
            else if (data && data.message) msg = `Error (${status}): ${data.message}`;
            else if (typeof data === 'string') msg = `Error (${status}): ${data}`;
            else if (data) msg = `Error (${status}): ${JSON.stringify(data)}`;

            alert(msg);
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProjects = projects
        .filter(p => !hiddenStaticIds.includes(p.id))
        .filter((proj) =>
            proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (proj.area && proj.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (proj.scope && proj.scope.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (proj.contractor && proj.contractor.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Projects Manager</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search title, scope, contractor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                    />
                    {/* Removed Role Check for Add Project */}
                    {!showForm && (
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition"
                        >
                            <Plus size={18} /> Add Project
                        </button>
                    )}
                </div>
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
                        <h3 className="text-lg font-semibold">
                            {editingProject ? 'Edit Project' : 'New Project'}
                            {(!editingProject && formData.title) && <span className="text-sm font-normal text-gray-500 ml-2">(Creating Copy)</span>}
                        </h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
                            <X size={24} />
                        </button>
                    </div>
                    {/* ... form ... */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border rounded p-2 bg-white"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Educational">Educational</option>
                                    <option value="Governmental">Governmental</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Residential Buildings">Residential Buildings</option>
                                    <option value="Villas">Villas</option>
                                    <option value="Hotels">Hotels</option>
                                    <option value="Maintenance and Repair">Maintenance and Repair</option>

                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Scopes</label>
                                <div className="border rounded-md p-3 bg-white">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.scope ? formData.scope.split(', ').map(s => (
                                            <span key={s} className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                                                {s}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = formData.scope.split(', ');
                                                        const newScopes = current.filter(item => item !== s);
                                                        setFormData(prev => ({ ...prev, scope: newScopes.join(', ') }));
                                                    }}
                                                    className="hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        )) : <span className="text-gray-400 text-sm">No services selected</span>}
                                    </div>

                                    <div className="relative">
                                        <select
                                            onChange={(e) => {
                                                if (!e.target.value) return;
                                                const currentOptions = formData.scope ? formData.scope.split(', ') : [];
                                                if (!currentOptions.includes(e.target.value)) {
                                                    const newScopes = [...currentOptions, e.target.value];
                                                    setFormData(prev => ({ ...prev, scope: newScopes.join(', ') }));
                                                }
                                                e.target.value = ""; // Reset select
                                            }}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                                        >
                                            <option value="">+ Add Service Scope</option>
                                            {allServiceOptions.filter(s => !formData.scope?.includes(s)).map((service) => (
                                                <option key={service} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Area</label>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contractor</label>
                                <input type="text" name="contractor" value={formData.contractor} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Owner</label>
                                <input type="text" name="owner" value={formData.owner} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" placeholder="Project Owner" />
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
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    accept="image/*"
                                    required={!editingProject}
                                />
                                {editingProject && !selectedImages.length && <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>}
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
                                <p className="text-xs text-gray-500 mt-1">Add additional images to the project gallery</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Video (Optional)</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 flex items-center gap-2 disabled:opacity-70"
                            >
                                <Save size={18} />
                                {isSubmitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related Services</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                        No projects found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((proj) => (
                                    <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            #{proj.id}
                                            {proj.isStatic && <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">Static</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="relative group">
                                                    <img
                                                        src={proj.isStatic ? proj.image : getImageUrl(proj.image)}
                                                        alt={proj.title}
                                                        className="h-12 w-12 object-cover rounded border border-gray-200"
                                                        onError={(e) => { e.target.src = "https://placehold.co/100x60?text=No+Image"; }}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded" />
                                                </div>

                                                {/* Gallery Images Preview */}
                                                {proj.images && proj.images.length > 0 && (
                                                    <div className="flex -space-x-2 overflow-hidden hover:space-x-1 transition-all">
                                                        {proj.images.slice(0, 4).map((img, idx) => {
                                                            // Handle both static (string) and dynamic (object) image formats
                                                            const imgSrc = proj.isStatic
                                                                ? img
                                                                : getImageUrl(typeof img === 'object' ? img.image : img);

                                                            // Skip if it's the same as main image to avoid duplicate (optional, but good for UI)
                                                            if (imgSrc === (proj.isStatic ? proj.image : getImageUrl(proj.image))) return null;

                                                            return (
                                                                <img
                                                                    key={idx}
                                                                    src={imgSrc}
                                                                    alt={`Gallery ${idx}`}
                                                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm bg-gray-100"
                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                />
                                                            );
                                                        })}
                                                        {proj.images.length > 4 && (
                                                            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs font-bold text-gray-500 shadow-sm">
                                                                +{proj.images.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {proj.video && <Video size={16} className="text-gray-500 ml-1" title="Has Video" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proj.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 uppercase tracking-wider italic">
                                            {proj.category || proj.Category || "General"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate">{proj.scope}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {(() => {
                                                const linked = allServices.filter(s => {
                                                    const rawIds = s.linkedProjectIds || s.LinkedProjectIds || "";
                                                    const idArray = String(rawIds).split(',').filter(Boolean);
                                                    return idArray.includes(String(proj.id));
                                                });
                                                if (linked.length === 0) return "-";
                                                return (
                                                    <div className="flex flex-wrap gap-1">
                                                        {linked.map(s => (
                                                            <span key={s.id} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                                                                {s.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 max-w-[100px] truncate">{proj.owner || proj.Owner || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(proj)}
                                                    className="text-primary hover:opacity-80"
                                                    title={proj.isStatic ? "Create editable copy" : "Edit"}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(proj.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title={proj.isStatic ? "Hide from list" : "Delete"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table >
                </div >
            )
            }
        </div >
    );
}
