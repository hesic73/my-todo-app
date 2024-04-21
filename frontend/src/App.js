import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import Sidebar from './Sidebar';
import AddTaskButton from 'AddTaskButton';

/**
 * @typedef {import('./types/types').Task} Task
 */

function App() {
    const [tasks, setTasks] = useState([]);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [showTaskInput, setShowTaskInput] = useState(false); // New state to control TaskInput visibility

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/tasks/');
        const data = await response.json();
        setTasks(data);
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

    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

    const handleNewTaskClick = () => {
        setShowTaskInput(true); // Show TaskInput when the button is clicked
    };

    return (
        <div className="App bg-white min-h-screen flex">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                <header className="text-center py-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">To-Do List</h1>
                </header>

                <main className="max-w-4xl mx-auto px-4">


                    <TaskList tasks={tasks} removeTask={removeTask} updateTask={updateTask} />


                    {!showTaskInput && <AddTaskButton handleNewTaskClick={handleNewTaskClick} />}


                    {showTaskInput && <TaskInput onAddTask={addTask} onClose={() => setShowTaskInput(false)} />}


                </main>


            </div>
        </div>
    );
}

export default App;
