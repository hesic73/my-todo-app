import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import Sidebar from './Sidebar';

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

    const addTask = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const removeTask = (id) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    const updateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    };

    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

    const handleNewTaskClick = () => {
        setShowTaskInput(true); // Show TaskInput when the button is clicked
    };

    return (
        <div className="App bg-gray-100 min-h-screen flex">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-margin duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                <header className="text-center py-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">To-Do List</h1>
                    <div className="max-w-4xl mx-auto px-4">
                        <TaskList tasks={tasks} removeTask={removeTask} updateTask={updateTask} />
                        <button onClick={handleNewTaskClick} className="flex items-center justify-center m-4">
                            <svg className="w-6 h-6 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add task</span>
                        </button>
                        {/* Conditional rendering of TaskInput */}
                        {showTaskInput && <TaskInput onAddTask={addTask} onClose={() => setShowTaskInput(false)} />}
                    </div>
                </header>
            </div>
        </div>
    );
}

export default App;
