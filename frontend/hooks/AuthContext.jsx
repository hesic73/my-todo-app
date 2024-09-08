'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(undefined);
    const [token, setToken] = useState(null); // Start with null, and update later in useEffect

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []); // Runs only once after the component mounts

    useEffect(() => {
        const fetchUserData = async (token) => {
            try {
                const userData = await verifyToken(token);
                if (userData) {
                    setUserData(userData);
                } else {
                    logout();
                }
            } catch (error) {
                logout();
            }
        };

        if (token) {
            fetchUserData(token);
        } else {
            setUserData(null);  // No token, no user data
        }
    }, [token]);

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
        <AuthContext.Provider value={{ userData, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

async function verifyToken(token) {
    try {
        const response = await fetch('/auth/login/access-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token validation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}
