import React, { useState } from 'react';

function TaskItem({ task, onFetchTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedContent, setEditedContent] = useState(task.content);

  const handleDelete = async () => {
    await fetch(`/tasks/${task.id}`, {
      method: 'DELETE',
    });
    onFetchTasks();
  };

  const handleEdit = async () => {
    if (isEditing) {
      await fetch(`/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTitle, content: editedContent, last_modified: new Date().toISOString() }),
      });
      onFetchTasks();
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="card bg-white shadow-lg m-2 p-4 rounded-lg max-w-lg mx-auto">
      {isEditing ? (
        <>
          <input
            className="input input-bordered w-full mb-2"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full mb-2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p>{task.content}</p>
        </>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button className="btn btn-primary" onClick={handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button className="btn btn-error" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;
