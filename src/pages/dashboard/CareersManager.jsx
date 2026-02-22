import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Save, AlertCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';

import { vacancies as staticCareers } from '../../data/careers';

export default function CareersManager() {
    const { user } = useAuth();
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hiddenStaticIds, setHiddenStaticIds] = useState(() => {
        const saved = localStorage.getItem('hiddenCareers');
        return saved ? JSON.parse(saved) : [];
    });
    const [legacyId, setLegacyId] = useState(null);

    // Form State for Careers
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "Full Time",
        location: "Kuwait",
        isActive: true,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Career/GetAll');
            // Merge static and dynamic. Static first or last? User asked to "show the already coded ones".
            // Let's put static ones at the bottom or top.
            // Map static to have a flag and namespaced ID to avoid collisions with DB IDs
            const staticWithFlag = staticCareers.map(c => ({ ...c, isStatic: true, id: `static-career-${c.id}` }));
            setCareers([...staticWithFlag, ...res.data]);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch careers:", err);
            // Even if API fails, show static? Yes.
            const staticWithFlag = staticCareers.map(c => ({ ...c, isStatic: true, id: `static-career-${c.id}` }));
            setCareers(staticWithFlag);
            setError("Failed to load job listings from server (showing static only).");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem('hiddenCareers', JSON.stringify(hiddenStaticIds));
    }, [hiddenStaticIds]);

    const handleDelete = async (id) => {
        const item = careers.find(c => c.id === id);
        if (item?.isStatic) {
            if (window.confirm("This is a hardcoded item. It cannot be permanently deleted, but it can be hidden. Hide it?")) {
                setHiddenStaticIds(prev => [...prev, id]);
                setCareers(prev => prev.filter(item => item.id !== id));
            }
            return;
        }

        if (!window.confirm("Are you sure you want to delete this job posting?")) return;

        try {
            await api.delete(`/Career/Delete/${id}`);
            setCareers(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete item.");
        }
    };

    const handleEdit = (item) => {
        if (item.isStatic) {
            if (window.confirm("This is a hardcoded job posting. To edit it, we must create a copy in the database. Continue?")) {
                setEditingItem(null);
                setLegacyId(item.id);
            } else {
                return;
            }
        } else {
            setEditingItem(item);
        }

        setFormData({
            title: item.title || "",
            description: item.description || "",
            type: item.type || "Full Time",
            location: item.location || "Kuwait",
            isActive: item.isActive ?? true,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            description: "",
            type: "Full Time",
            location: "Kuwait",
            isActive: true,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingItem) {
                await api.put(`/Career/Update/${editingItem.id}`, formData);
            } else {
                await api.post('/Career/Create', formData);
                if (legacyId) {
                    setHiddenStaticIds(prev => [...prev, legacyId]);
                }
            }
            await fetchData();
            resetForm();
        } catch (err) {
            console.error("Submission failed:", err);
            const status = err.response?.status;
            const data = err.response?.data;
            let msg = "Failed to save job posting.";

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

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Briefcase className="text-primary" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Careers Manager</h2>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition"
                >
                    <Plus size={18} /> Post Job
                </button>
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
                        <h3 className="text-lg font-semibold">{editingItem ? 'Edit Job Posting' : 'New Job Posting'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" placeholder="e.g. Civil Engineer" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2">
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full border rounded p-2" />
                            </div>
                            <div className="flex items-center mt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-5 w-5 text-primary focus:ring-primary" />
                                    <span className="text-sm font-medium text-gray-700">Active Listing</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Description & Requirements</label>
                            <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={5} className="mt-1 block w-full border rounded p-2" placeholder="Detailed job description..." />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 flex items-center gap-2 disabled:opacity-70"
                            >
                                <Save size={18} />
                                {isSubmitting ? 'Saving...' : (editingItem ? 'Update Job' : 'Post Job')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Location</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Loading careers...</td>
                            </tr>
                        ) : careers.filter(item => !hiddenStaticIds.includes(item.id)).length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No job postings found.</td>
                            </tr>
                        ) : (
                            careers.filter(item => !hiddenStaticIds.includes(item.id)).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.isActive ? 'Active' : 'Closed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.title}
                                        {item.isStatic && <span className="ml-2 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded font-normal">Static</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type} • {item.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                        <>
                                            <button onClick={() => handleEdit(item)} className="text-primary hover:opacity-80">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
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
