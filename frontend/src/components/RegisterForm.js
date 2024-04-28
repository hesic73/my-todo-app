import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /**
     * 
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    const register = async (username, email, password) => {
        setError(''); // Reset error on new register attempt
        if (!username || !email || !password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login'); // Redirect to login page on successful registration
            } else {
                throw new Error(data.detail || 'Unexpected error');
            }
        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.message);
            alert("Failed to register");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(username, email, password);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Register</h1>
                </header>

                {error && (
                    <div className="text-red-500 text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Login here</Link>
                </p>

            </div>
        </div>
    );
}

export default RegisterForm;
