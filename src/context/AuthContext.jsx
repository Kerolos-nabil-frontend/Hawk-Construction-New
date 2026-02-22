import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Decode the token or fetch user info if an endpoint exists.
            // For now, we'll just assume the user is logged in if a token exists.
            // You can add logic here to parse the JWT payload to get the user's name/role.
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("Decoded Token Payload:", payload); // Debugging

                // Role can be a string or an array of strings in the JWT
                // Check for standard claim names first, then the long microsoft schemas
                let userRole = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                // If userRole is an array, we might want to store it as such, or handle it in the ProtectedRoute.
                // For simplicity, let's just make sure we capture it correctly.
                console.log("Extracted Role (Raw):", userRole); // Debugging

                setUser({
                    id: payload.id || payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                    name: payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.sub,
                    email: payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                    role: userRole
                });
            } catch (e) {
                console.error("Failed to decode token", e);
                logout();
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
