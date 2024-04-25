import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Assume verifyToken is a function that verifies the token and returns user data if valid
            verifyToken(token).then(userData => {
                if (userData) {
                    setUserData({ username: userData.username });
                } else {
                    logout(); // if the token verification fails, logout the user
                }
            });
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
        <AuthContext.Provider value={{ user: userData, token, login, logout }}>
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
