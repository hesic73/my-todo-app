import React, { useState } from 'react';
import LIST_WIDTH from '../consts';
import { useAuth } from 'hooks/AuthContext';

/**
 * @typedef {import('../types/types').Task} Task
 */


/**
 * 
 * @param {Object} param0 
 * @param {(Task)=>void} param0.onAddTask
 * @param {()=>void} param0.onClose
 * @returns 
 */
function TaskInput({ onAddTask, onClose }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      alert("Task name cannot be empty.");
      return;
    }

    if (!token) {
      alert("You need to login to add a task.");
      return;
    }

    const response = await fetch('api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: taskName, description: description, last_modified: new Date().toISOString() }),
    });
    const newTask = await response.json();
    onAddTask(newTask);
    setTaskName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-4 shadow rounded ${LIST_WIDTH} mx-auto my-6`}>
      <input
        type="text"
        placeholder="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="w-full p-0 mb-4 border-gray-300 rounded focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-4 border-gray-300 rounded focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
      />
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-sm text-white rounded disabled:opacity-50 ${taskName.trim() ? "bg-red-500 hover:bg-red-600" : "bg-red-300"}`}
          disabled={!taskName.trim()}
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
export default TaskInput;
