import React, { useState } from 'react';

function TaskInput({ onAddTask, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isContentEmpty = content.trim().length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isContentEmpty) {
      alert("Content cannot be empty.");
      return;
    }

    const response = await fetch('/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, last_modified: new Date().toISOString() }),
    });
    const newTask = await response.json();
    onAddTask(newTask);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full mb-4"
        style={{ borderColor: '#CCCCCC', backgroundColor: '#F8F8F8' }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea textarea-bordered w-full mb-4"
        required
        style={{ borderColor: '#CCCCCC', backgroundColor: '#F8F8F8' }}
      ></textarea>
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="btn rounded-full px-8 ...">
          Add Task
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn rounded-full px-8 ...">
          Close
        </button>
      </div>
    </form>
  );
}

export default TaskInput;
