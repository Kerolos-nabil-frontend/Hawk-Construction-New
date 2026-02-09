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
                setUser({
                    name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                    email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                    role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
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
