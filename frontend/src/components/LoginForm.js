import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuth } from 'AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const { login } = useAuth();

  /**
   * 
   * @param {string} username 
   * @param {string} password 
   * @returns 
   */
  const sendLoginRequest = async (username, password) => {
    setError(''); // Reset error on new login attempt
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password
        })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access_token);
        navigate('/'); // Redirect to home page on successful login
      } else {
        throw new Error(data.detail || 'Unexpected error');
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
      alert("Failed to login"); // Optionally replace alert with more sophisticated error display
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLoginRequest(username, password);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Login</h1>
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
              aria-label="Enter your username"
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
              aria-label="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center">
          Need an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-500">Register here</Link>
        </p>


      </div>
    </div>
  );
}

export default LoginForm;
