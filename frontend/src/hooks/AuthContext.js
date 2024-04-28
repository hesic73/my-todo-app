import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(undefined);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [authLoading, setAuthLoading] = useState(true);  // Track loading state

    useEffect(() => {
        if (token) {
            setAuthLoading(true);
            verifyToken(token).then(userData => {
                if (userData) {
                    setUserData(userData);
                } else {
                    logout();
                }
                setAuthLoading(false);  // Set loading false on verification completion
            }).catch(() => {
                logout();
                setAuthLoading(false);  // Ensure to set loading false on error
            });
        } else {
            setUserData(null);
            setAuthLoading(false);  // Set loading false if no token present
        }
    }, [token]);

    /**
     * 
     * @param {string} newToken 
     */
    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ userData, token, login, logout, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

/**
 * 
 * @param {string} token 
 * @returns 
 */
function verifyToken(token) {
    return fetch('/api/verify-token', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token validation failed');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            return null;  // Return null or appropriate error handling
        });
}
