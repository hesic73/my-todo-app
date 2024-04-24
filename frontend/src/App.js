import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from 'components/LoginForm';


import Main from 'components/Main';


/**
 * @typedef {import('./types/types').Task} Task
 */


const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    // Redirects to login if no token is found
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    const [tasks, setTasks] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTasks(token);
        }
    }, []);

    const fetchTasks = async (token) => {
        try {
            const response = await fetch('api/tasks/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            // Optionally, handle errors more visibly for the user, e.g., with a notification or alert
        }
    };



    /**
     * 
     * @param {Task} newTask new task to add
     */
    const addTask = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    /**
     * 
     * @param {number} id Id of the task to remove
     */
    const removeTask = (id) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    /**
     * 
     * @param {Task} updatedTask new task to update
     */
    const updateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    };




    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={
                <PrivateRoute>
                    <Main tasks={tasks} addTask={addTask} removeTask={removeTask} updateTask={updateTask} />
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default App;
