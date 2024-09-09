'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(undefined);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            setUserData(null); // No token found, explicitly set userData to null
        }
    }, []); // Runs only once after the component mounts

    useEffect(() => {
        if (!token) {
            setUserData(null); // When no token is available, set userData to null
            return; // Don't fetch user data if no token is present
        }

        const fetchUserData = async () => {
            try {
                const userData = await testToken(token);
                if (userData) {
                    setUserData(userData);
                } else {
                    logout(); // Logout if token verification fails
                }
            } catch (error) {
                logout(); // Logout on error
            }
        };

        fetchUserData();
    }, [token]); // Only runs when the token changes

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

async function testToken(token) {
    try {
        const response = await fetch('/auth/login/test-token', {
            method: 'POST',
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
