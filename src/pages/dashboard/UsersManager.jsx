import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, X, Save, Shield, User, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';

export default function UsersManager() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        role: "Admin"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('AdminManagement/GetAllUsers');
            setUsers(res.data || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
            const status = err.response?.status;
            const detail = err.response?.data?.message || err.response?.data || "";
            setError(`Failed to fetch users list (${status || 'Network Error'}). ${detail ? detail : 'Please ensure you have sufficient permissions.'}`);

            if (status === 403) {
                api.get('AdminManagement/Ping')
                    .then(r => console.log("Ping success (authenticated but maybe wrong role):", r.data))
                    .catch(e => console.error("Ping failed (maybe not authenticated at all):", e));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await api.delete(`AdminManagement/DeleteUser/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            setSuccess("User deleted successfully");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Delete failed", err);
            const msg = typeof err.response?.data === 'string' ? err.response.data : "Failed to delete user";
            alert(msg);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await api.post('AdminManagement/CreateAdmin', formData);
            setSuccess("Admin created successfully");
            setFormData({ email: "", password: "", fullName: "", role: "Admin" });
            setShowForm(false);
            fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Create failed", err);
            const status = err.response?.status;
            const detail = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : "");

            if (err.response?.data && Array.isArray(err.response.data)) {
                setError(err.response.data.map(e => e.description).join(", "));
            } else {
                setError(`Failed to create admin (${status || 'Network Error'}). ${detail ? detail : 'Please check your input and try again.'}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                        <UsersIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 text-sm">Create and manage administrators</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 btn-primary-dynamic shadow-lg shadow-primary/20 font-semibold"
                >
                    {showForm ? <X size={20} /> : <UserPlus size={20} />}
                    {showForm ? 'Cancel' : 'Add New Admin'}
                </button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-xl"
                >
                    <Shield size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-xl font-medium"
                >
                    {success}
                </motion.div>
            )}

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                required
                                type="text"
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition bg-gray-50/50"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition bg-gray-50/50"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                required
                                type="password"
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition bg-gray-50/50"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">System Role</label>
                            <select
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition bg-gray-50/50 appearance-none"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Admin">Standard Admin</option>
                                <option value="Main Admin">Main Admin</option>
                                <option value="User">Regular User</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 items-center">
                            <p className="text-xs text-gray-400 italic">Administrators have full access to website content.</p>
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 btn-primary-dynamic disabled:opacity-50 shadow-lg shadow-primary/20"
                            >
                                <Save size={20} />
                                {isSubmitting ? 'Processing...' : 'Save Administrator'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Identified User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Account Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Security Roles</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-lg w-40"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-50 rounded-lg w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-50 rounded-md w-20"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-9 bg-gray-50 rounded-lg w-9 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <UsersIcon size={40} className="mb-2 opacity-20" />
                                            <p className="font-medium text-lg">No administrators found</p>
                                            <p className="text-sm">Start by adding a new admin above.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl border ${u.roles.includes('Main Admin') ? 'bg-purple-50 border-purple-100 text-purple-600' :
                                                    'bg-blue-50 border-blue-100 text-blue-600'
                                                    }`}>
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{u.fullName}</span>
                                                    {currentUser.id === u.id && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-black">You</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-gray-600 font-medium">{u.email}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-2">
                                                {u.roles.map(r => (
                                                    <span key={r} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${r === 'Main Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        r === 'Admin' ? 'bg-primary/10 text-primary border-primary/20' :
                                                            'bg-gray-50 text-gray-600 border-gray-200'
                                                        }`}>
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {currentUser.id !== u.id && (
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                    title="Permanently Remove User"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
