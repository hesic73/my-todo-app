import React from 'react';


/**
 * 
 * @param {Object} props
 * @param {()=>void} props.onConfirm
 * @param {()=>void} props.onCancel
 * @param {string} props.taskName 
 * @returns 
 */
function ConfirmModal({ onConfirm, onCancel, taskName }) {
  return (
    // The overlay
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-start justify-center pt-10">
      
      {/* The modal container */}
      <div className="bg-white rounded-lg w-full max-w-md mx-auto my-8 overflow-hidden p-6 space-y-4">
        
        {/* The header */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">
            {`Are you sure you want to delete "${taskName}"?`}
          </span>
          <button onClick={onCancel} className="text-black hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* The body */}
        <p>This action cannot be undone.</p>
        
        {/* The footer with actions */}
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
