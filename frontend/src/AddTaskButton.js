import React, { useState } from 'react';

import LIST_WIDTH from './consts';

/**
 * 
 * @param {Object} param0 
 * @param {()=>void} param0.handleNewTaskClick
 * @returns 
 */
function AddTaskButton({ handleNewTaskClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={`mx-auto my-4 ${LIST_WIDTH}`}> {/* Add this div */}
        <button
            onClick={handleNewTaskClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center justify-center p-2 rounded-full transition duration-200 ${isHovered ? 'text-red-500' : 'text-gray-700'
                }`}
        >
            <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${isHovered ? 'bg-red-500' : 'bg-white'
                    }`}
            >
                <svg
                    className="w-6 h-6"
                    fill={`${isHovered ? 'white' : 'red'}`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {/* 十字星 SVG Path */}
                    <path d="M12 6v12m6-6H6" />
                </svg>
            </div>
            <span className={`ml-2 transition-colors duration-200`}>
                Add Task
            </span>
        </button>
        </div>
    );
}

export default AddTaskButton;
