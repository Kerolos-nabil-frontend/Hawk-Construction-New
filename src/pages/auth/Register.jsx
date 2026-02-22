import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';

export default function Register() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'Admin', securityKey: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(`Field ${e.target.name} changed to:`, e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Check for Master Security Key (Change this to your preferred secret)
        const MASTER_KEY = "Hawk2026Admin";

        if (formData.securityKey !== MASTER_KEY) {
            setError("Invalid Security Key. Only authorized personnel can register.");
            setLoading(false);
            return;
        }

        try {
            // Send role in multiple formats to ensure backend catches it
            const payload = {
                FullName: formData.fullName,
                Email: formData.email,
                Password: formData.password,
                Role: formData.role,
                role: formData.role,
                UserRole: formData.role
            };
            console.log("Sending Register Payload:", payload); // Debugging
            const response = await api.post('/Auth/register', payload);
            console.log("Register Response:", response);
            navigate('/login'); // Redirect to login after successful registration
        } catch (err) {
            console.error(err);
            if (err.response?.data) {
                if (Array.isArray(err.response.data)) {
                    // Start of Identity errors array
                    setError(err.response.data.map(e => e.description).join(', '));
                } else if (typeof err.response.data === 'string') {
                    // Simple string error (e.g. "Email already exists")
                    setError(err.response.data);
                } else if (err.response.data.errors) {
                    // Validation errors object
                    const messages = Object.values(err.response.data.errors).flat();
                    setError(messages.join(', '));
                } else {
                    if (err.response.status === 400) {
                        setError('Invalid registration details. Please check your input.');
                    } else {
                        setError('Registration failed. Please try again.');
                    }
                }
            } else if (err.request) {
                setError('Network error: Unable to reach the server. Please ensure the backend is running.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Fill in the details below to add a new administrator
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 border-t-0 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 border-t-0 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm border-t-0"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Main Admin">Main Admin</option>
                            </select>
                        </div>
                        <div>
                            <input
                                id="securityKey"
                                name="securityKey"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm border-t-0"
                                placeholder="Master Security Key"
                                value={formData.securityKey}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div >
    );
}
