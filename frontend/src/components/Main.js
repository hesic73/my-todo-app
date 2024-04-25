import React, { useEffect, useState, } from 'react';
import TaskInput from 'components/TaskInput';
import TaskItem from 'components/TaskItem';
import Sidebar from 'components/Sidebar';
import AddTaskButton from 'components/AddTaskButton';

import { useAuth } from 'AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * @typedef {import('types/types').Task} Task
 */



/**
 * 
 * @param {Object} props
 * @param {Task[]} props.tasks
 * @param {(Task)=>void} props.addTask
 * @param {(number)=>void} props.removeTask
 * @param {(Task)=>void} props.updateTask
 * @returns 
 */
function Main() {


    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);


    const [showTaskInput, setShowTaskInput] = useState(false);
    const handleNewTaskClick = () => {
        setShowTaskInput(true);
    };



    const [tasks, setTasks] = useState([]);
    const { userData, token, authLoading } = useAuth();

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
        }
    };

    useEffect(() => {
        if (token) {
            fetchTasks(token);
        }
    }, [token]);


    if (authLoading) {
        return <div>Loading...</div>;  // Handle loading state
    }

    if (!userData) {
        return <Navigate to="/login" replace />;
    }


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
        <div className="App bg-white min-h-screen flex">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                <header className="text-center py-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">To-Do List</h1>
                </header>

                <main className="max-w-4xl mx-auto px-4">


                    <div>
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} removeTask={removeTask} updateTask={updateTask} />
                        ))}
                    </div>


                    {!showTaskInput && <AddTaskButton handleNewTaskClick={handleNewTaskClick} />}


                    {showTaskInput && <TaskInput onAddTask={addTask} onClose={() => setShowTaskInput(false)} />}


                </main>


            </div>
        </div>
    );
}

export default Main;