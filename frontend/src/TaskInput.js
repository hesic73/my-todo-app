import React, { useState } from 'react';

function TaskInput({ onFetchTasks }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isContentEmpty = content.trim().length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isContentEmpty) {
      // Optionally, provide user feedback here (e.g., an alert or a message on the form)
      console.log("Content cannot be empty.");
      return;
    }

    await fetch('/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, last_modified: new Date().toISOString() }),
    });
    setTitle('');
    setContent('');
    onFetchTasks();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered input-primary w-full mb-2"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea textarea-bordered textarea-primary w-full mb-2"
        required
      ></textarea>
      <button type="submit" className="btn btn-primary w-full" disabled={isContentEmpty}>Add Task</button>
    </form>
  );
}

export default TaskInput;
