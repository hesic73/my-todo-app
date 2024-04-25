import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(undefined);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [authLoading, setAuthLoading] = useState(true);  // Track loading state

    useEffect(() => {
        if (token) {
            verifyToken(token).then(userData => {
                if (userData) {
                    setUserData({ username: userData.username });
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
        .then(data => {
            if (data.valid) {
                return data;  // Return the response data if the token is valid
            }
            throw new Error('Invalid token');  // Optionally handle specific error based on API response
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            return null;  // Return null or appropriate error handling
        });
}
