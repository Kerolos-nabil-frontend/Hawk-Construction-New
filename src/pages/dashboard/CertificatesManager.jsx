import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { certificates as initialCertificates, references as initialReferences } from '../../data/certificates';
import { useAuth } from '../../context/AuthContext';

export default function CertificatesManager() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "certificate", // 'certificate' or 'reference'
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // Load from local data, ensuring category is set for filtering/logic
        setCertificates(initialCertificates.map(c => ({ ...c, category: 'certificate' })));
        setReferences(initialReferences.map(r => ({ ...r, category: 'reference' })));
        setLoading(false);
    }, []);

    const handleDelete = (id, category) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        if (category === 'reference') {
            setReferences(prev => prev.filter(item => item.id !== id));
        } else {
            setCertificates(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            category: item.category || "certificate",
        });
        setSelectedImage(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            description: "",
            category: "certificate",
        });
        setSelectedImage(null);
        setShowForm(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            ...formData,
            id: editingItem ? editingItem.id : Date.now(),
            image: selectedImage ? URL.createObjectURL(selectedImage) : (editingItem?.image || null)
        };

        const updateList = (list, setList) => {
            if (editingItem) {
                setList(list.map(item => item.id === editingItem.id ? newItem : item));
            } else {
                setList([...list, newItem]);
            }
        };

        // If category changed, we need to remove from old list and add to new
        if (editingItem && editingItem.category !== formData.category) {
            if (editingItem.category === 'certificate') {
                setCertificates(prev => prev.filter(i => i.id !== editingItem.id));
                setReferences(prev => [...prev, newItem]);
            } else {
                setReferences(prev => prev.filter(i => i.id !== editingItem.id));
                setCertificates(prev => [...prev, newItem]);
            }
        } else {
            // Normal update or create
            if (formData.category === 'reference') {
                updateList(references, setReferences);
            } else {
                updateList(certificates, setCertificates);
            }
        }

        resetForm();
    };

    const allItems = [...certificates, ...references];

    return (
        <div className="mt-12 bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Certificates & References Manager</h2>
                {user?.role === 'Admin' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> Add New
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingItem ? 'Edit Item' : 'New Item'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-red-500">
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
                                disabled={!!editingItem} // Optional: allow changing type?
                            >
                                <option value="certificate">Certificate</option>
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
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input type={editingItem ? "file" : "file"} required={!editingItem} accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2">
                                <Save size={18} /> {editingItem ? 'Update' : 'Save'} {formData.category === 'certificate' ? 'Certificate' : 'Reference'}
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
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-12 w-12 object-cover rounded"
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                        {user?.role === 'Admin' && (
                                            <>
                                                <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id, item.category)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
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
