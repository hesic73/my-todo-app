import React, { useState } from 'react';
import LIST_WIDTH from './consts';

/**
 * @typedef {import('./types/types').Task} Task
 */


/**
 * 
 * @param {Object} param0 
 * @param {(Task)=>void} param0.onAddTask
 * @param {()=>void} param0.onClose
 * @returns 
 */
function TaskInput({ onAddTask, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    const newTask = { id: Date.now(), title, content }; // Replace with actual API call
    onAddTask(newTask);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-4 shadow rounded ${LIST_WIDTH} mx-auto my-6`}>
      <input
        type="text"
        placeholder="Task name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-0 mb-4 border-gray-300 rounded focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
        required
      />
      <textarea
        placeholder="Description"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 mb-4 border-gray-300 rounded focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
        required
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
          className={`px-4 py-2 text-sm text-white rounded disabled:opacity-50 ${title.trim() ? "bg-red-500 hover:bg-red-600" : "bg-red-300"}`}
          disabled={!title.trim()}
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
export default TaskInput;
