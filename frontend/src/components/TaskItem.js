import React, { useState } from 'react';
import LIST_WIDTH from '../consts';

import ConfirmModal from 'components/ConfirmModal';
import { useAuth } from 'hooks/AuthContext';


/**
 * @typedef {import('../types/types').Task} Task
 */



/**
 * @param {Object} props
 * @param {Task} props.task
 * @param {(number) => void} props.removeTask
 * @param {(Task) => void} props.updateTask
 * @returns 
 */
function TaskItem({ task, removeTask, updateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { token } = useAuth();

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You need to login to delete a task.");
      return;
    }
    await fetch(`api/tasks/${task.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    removeTask(task.id);
    setShowConfirmModal(false);
  };

  const handleEdit = async () => {
    if (isEditing && (editedTaskName !== task.name || editedDescription !== task.description)) {
      const updatedTask = {
        ...task,
        name: editedTaskName,
        description: editedDescription,
        last_modified: new Date().toISOString()
      };

      if (!token) {
        alert("You need to login to edit a task.");
        return;
      }
      await fetch(`api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask),
      });
      updateTask(updatedTask);
    }
    setIsEditing(!isEditing);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset edited state if canceling
    if (isEditing) {
      setEditedTaskName(task.name);
      setEditedDescription(task.description);
    }
  };




  const inputClass = "w-full p-2 mb-4 border-gray-300 rounded focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50";
  const buttonClass = "px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200";


  return (
    <>
      {showConfirmModal && <ConfirmModal onConfirm={confirmDelete} onCancel={() => setShowConfirmModal(false)} taskName={task.name} />}
      <div className={`bg-white p-4 shadow rounded ${LIST_WIDTH} mx-auto my-6`}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTaskName}
              onChange={(e) => setEditedTaskName(e.target.value)}
              placeholder="Task Name"
              className={`${inputClass}`}
              required
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description"
              className={`${inputClass}`}
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleEditToggle}
                className={`${buttonClass}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">{task.name}</h2>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleEditToggle} className="focus:outline-none">
                  <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15.232 4.353l4.415 4.415-10.58 10.58H4.353V14.933z"></path>
                    <path d="M18.647 2.939a2.121 2.121 0 013 3L12 15.576 7.424 11H2v-5.424l9.576-9.576a2.121 2.121 0 013 0z"></path>
                  </svg>
                </button>
                <button onClick={handleDelete} className="focus:outline-none">
                  <svg className="w-4 h-4 text-red-500 hover:text-red-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>

  );
}

export default TaskItem;


