import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Video, X, Save } from 'lucide-react';
import { allProjects } from '../../data/projects';
import { useAuth } from '../../context/AuthContext';

export default function ProjectsManager() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProject, setEditingProject] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        scope: "",
        area: "",
        contractor: "",
        description: "",
        isMultiPhase: false,
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        // Load projects from local data and assign generic IDs since local data lacks them
        const projectsWithIds = allProjects.map((p, index) => ({
            ...p,
            id: p.id || `local-${index}`,
            // Ensure images is an array
            images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : [])
        }));
        setProjects(projectsWithIds);
        setLoading(false);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        setProjects(projects.filter(p => p.id !== id));
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || "",
            category: project.category || "",
            scope: project.scope || "",
            area: project.area || "",
            contractor: project.contractor || "",
            description: project.description || "",
            isMultiPhase: project.isMultiPhase || false,
        });
        setSelectedImages([]);
        setSelectedVideo(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingProject(null);
        setFormData({
            title: "",
            category: "",
            scope: "",
            area: "",
            contractor: "",
            description: "",
            isMultiPhase: false,
        });
        setSelectedImages([]);
        setSelectedVideo(null);
        setShowForm(false);
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

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newProject = {
            ...formData,
            id: editingProject ? editingProject.id : `new-${Date.now()}`,
            images: selectedImages.length > 0 ? selectedImages.map(file => URL.createObjectURL(file)) : (editingProject?.images || []),
            video: selectedVideo ? URL.createObjectURL(selectedVideo) : (editingProject?.video || null)
        };

        if (editingProject) {
            setProjects(projects.map(p => p.id === editingProject.id ? newProject : p));
        } else {
            setProjects([newProject, ...projects]);
        }

        resetForm();
        setLoading(false);
    };

    const filteredProjects = projects.filter((proj) =>
        proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proj.category && proj.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Projects Manager</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {user?.role === 'Admin' && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
                        >
                            <Plus size={18} /> Add Project
                        </button>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input required type="text" name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Scope</label>
                                <input type="text" name="scope" value={formData.scope} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Area</label>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contractor</label>
                                <input type="text" name="contractor" value={formData.contractor} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div className="flex items-center mt-6">
                                <input type="checkbox" name="isMultiPhase" checked={formData.isMultiPhase} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label className="ml-2 block text-sm text-gray-900">Multi-Phase Project</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border rounded p-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Images</label>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Video</label>
                                <input type="file" accept="video/*" onChange={handleVideoChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2">
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Project'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProjects.map((proj) => (
                            <tr key={proj.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {proj.images && proj.images.length > 0 && (
                                            <img
                                                src={proj.images[0]}
                                                alt={proj.title}
                                                className="h-10 w-10 object-cover rounded"
                                            />
                                        )}
                                        {proj.video && <Video size={16} className="text-gray-500" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proj.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{proj.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {user?.role === 'Admin' && (
                                        <>
                                            <button onClick={() => handleEdit(proj)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(proj.id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
