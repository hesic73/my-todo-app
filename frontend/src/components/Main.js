import React, { useState, } from 'react';
import TaskInput from 'components/TaskInput';
import TaskItem from 'components/TaskItem';
import Sidebar from 'components/Sidebar';
import AddTaskButton from 'components/AddTaskButton';


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
function Main({ tasks, addTask, removeTask, updateTask }) {


    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);


    const [showTaskInput, setShowTaskInput] = useState(false);
    const handleNewTaskClick = () => {
        setShowTaskInput(true);
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