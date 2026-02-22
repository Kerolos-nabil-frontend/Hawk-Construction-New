import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useAuth();

    // If not authenticated (no token), redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If we have a token but user data isn't loaded yet, wait.
    if (token && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Check roles if user is loaded
    console.log(`ProtectedRoute Check: User Role:`, user.role, `Allowed Roles:`, allowedRoles); // Debugging

    // Normalize user roles to an array
    let userRoles = [];
    if (user.role) {
        userRoles = Array.isArray(user.role) ? user.role : [user.role];
    }

    // Check if any of the user's roles are in the allowedRoles list
    const hasAccess = userRoles.some(role => allowedRoles.includes(role));

    if (allowedRoles && !hasAccess) {
        console.warn("Access Denied: Role mismatch.");
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-700 mb-2">You do not have permission to view this page.</p>
                    <div className="bg-gray-100 p-3 rounded text-left text-sm font-mono mb-4 overflow-auto">
                        <p><strong>Required Roles:</strong> {allowedRoles.join(', ')}</p>
                        <p><strong>Your Role:</strong> {JSON.stringify(user?.role || 'None')}</p>
                    </div>
                    <a href="/" className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
