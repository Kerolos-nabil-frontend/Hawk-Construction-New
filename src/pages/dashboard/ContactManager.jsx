import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function ContactManager() {
    const [formData, setFormData] = useState({
        email: '',
        kuwaitPhone1: '',
        kuwaitPhone2: '',
        kuwaitWhatsapp: '',
        kuwaitAddress: '',
        kuwaitMapLink: '',
        uaePhone: '',
        uaeAddress: '',
        uaeMapLink: '',
        branches: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const res = await api.get('Contact/GetDetails');
            if (res.data) {
                setFormData(prev => ({
                    ...prev,
                    ...res.data
                }));
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load contact details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('Contact/UpdateDetails', formData);
            setMessage({ type: 'success', text: 'Contact details updated successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update details.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manage Contact Info</h2>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-2 mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                    {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">General</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">General Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </section>

                {/* Kuwait Branch */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Kuwait Branch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label>
                            <input
                                type="text"
                                name="kuwaitPhone1"
                                value={formData.kuwaitPhone1}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
                            <input
                                type="text"
                                name="kuwaitPhone2"
                                value={formData.kuwaitPhone2}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                            <input
                                type="text"
                                name="kuwaitWhatsapp"
                                value={formData.kuwaitWhatsapp}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="kuwaitAddress"
                                value={formData.kuwaitAddress}
                                onChange={handleChange}
                                rows={2}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                            <input
                                type="text"
                                name="kuwaitMapLink"
                                value={formData.kuwaitMapLink}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 text-primary font-mono text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* UAE Branch */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">UAE Branch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                name="uaePhone"
                                value={formData.uaePhone}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="uaeAddress"
                                value={formData.uaeAddress}
                                onChange={handleChange}
                                rows={2}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                            <input
                                type="text"
                                name="uaeMapLink"
                                value={formData.uaeMapLink}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 text-primary font-mono text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* Additional Branches */}
                <section>
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Additional Branches</h3>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                branches: [...prev.branches, { title: '', phone1: '', phone2: '', whatsapp: '', address: '', mapLink: '' }]
                            }))}
                            className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
                        >
                            + Add Branch
                        </button>
                    </div>

                    <div className="space-y-8">
                        {formData.branches.map((branch, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-xl border relative">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        branches: prev.branches.filter((_, i) => i !== index)
                                    }))}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Title</label>
                                        <input
                                            type="text"
                                            value={branch.title}
                                            onChange={(e) => {
                                                const newBranches = [...formData.branches];
                                                newBranches[index].title = e.target.value;
                                                setFormData(prev => ({ ...prev, branches: newBranches }));
                                            }}
                                            placeholder="e.g. Saudi Branch"
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label>
                                        <input
                                            type="text"
                                            value={branch.phone1}
                                            onChange={(e) => {
                                                const newBranches = [...formData.branches];
                                                newBranches[index].phone1 = e.target.value;
                                                setFormData(prev => ({ ...prev, branches: newBranches }));
                                            }}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2 (Optional)</label>
                                        <input
                                            type="text"
                                            value={branch.phone2}
                                            onChange={(e) => {
                                                const newBranches = [...formData.branches];
                                                newBranches[index].phone2 = e.target.value;
                                                setFormData(prev => ({ ...prev, branches: newBranches }));
                                            }}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Optional)</label>
                                        <input
                                            type="text"
                                            value={branch.whatsapp}
                                            onChange={(e) => {
                                                const newBranches = [...formData.branches];
                                                newBranches[index].whatsapp = e.target.value;
                                                setFormData(prev => ({ ...prev, branches: newBranches }));
                                            }}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            value={branch.address}
                                            onChange={(e) => {
                                                const newBranches = [...formData.branches];
                                                newBranches[index].address = e.target.value;
                                                setFormData(prev => ({ ...prev, branches: newBranches }));
                                            }}
                                            rows={2}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                                        <input
                                            type="text"
                                            value={branch.mapLink}
                                            onChange={(e) => {
                                                const newBranches = [...formData.branches];
                                                newBranches[index].mapLink = e.target.value;
                                                setFormData(prev => ({ ...prev, branches: newBranches }));
                                            }}
                                            className="w-full border rounded-lg px-4 py-2 text-primary font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {formData.branches.length === 0 && (
                        <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-xl border-dashed border-2">
                            No additional branches added yet.
                        </p>
                    )}
                </section>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-6 py-2 rounded-lg btn-primary-dynamic flex items-center gap-2"
                    >
                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
