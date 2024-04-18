import React, { useState } from 'react';

function TaskItem({ task, removeTask, updateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedContent, setEditedContent] = useState(task.content);

  const handleDelete = async () => {
    await fetch(`/tasks/${task.id}`, { method: 'DELETE' });
    removeTask(task.id);
  };

  const handleEdit = async () => {
    if (isEditing && (editedTitle !== task.title || editedContent !== task.content)) {
      const updatedTask = {
        ...task,
        title: editedTitle,
        content: editedContent,
        last_modified: new Date().toISOString()
      };
      await fetch(`/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      updateTask(updatedTask);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="card bg-white shadow-lg m-2 p-4 rounded-lg max-w-lg mx-auto transition duration-300 ease-in-out">
      {isEditing ? (
        <>
          <input
            className="input input-bordered w-full mb-2 text-lg font-semibold bg-gray-100"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task Title"
          />
          <textarea
            className="textarea textarea-bordered w-full mb-2 bg-gray-100"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Task Details"
          />
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
          <p className="mb-2">{task.content}</p>
        </>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`} onClick={handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button className="btn btn-error" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;
