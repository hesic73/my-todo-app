import React, {useState, useEffect} from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';

function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/tasks/');
        const data = await response.json();
        setTasks(data);
    };

    return (
        <div className="App bg-gray-100 min-h-screen">
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">To-Do List</h1>
                <div className="max-w-4xl mx-auto px-4">
                    <TaskInput onFetchTasks={fetchTasks}/>
                    <TaskList tasks={tasks} onFetchTasks={fetchTasks}/>
                </div>
            </header>
        </div>

    );
}

export default App;
