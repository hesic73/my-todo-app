import React from 'react';
import { useAuth } from 'hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * @param {Object} props The properties passed to the component
 * @param {boolean} props.isCollapsed Indicates if the sidebar is in its collapsed state
 * @param {()=>void} props.toggleSidebar Function to toggle the sidebar between collapsed and expanded states
 * @returns {React.ReactElement} Rendered sidebar component
 */
function Sidebar({ isCollapsed, toggleSidebar }) {
    const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
    const sidebarBackground = isCollapsed ? 'bg-white' : 'bg-gray-100';
    const sidebarShadow = isCollapsed ? '' : 'shadow-md';

    const navigate = useNavigate();

    const { userData, logout } = useAuth();
    const username = userData ? userData.username : '';

    return (
        <div className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${sidebarWidth}`}>
            <div className={`h-full ${sidebarBackground} ${sidebarShadow} flex flex-col justify-start items-end`}>
                <div className="w-full flex justify-between items-center px-2 py-2">  {/* Adjusted padding here */}
                    <div className={`flex-1 text-left pl-4 ${isCollapsed ? 'hidden' : ''}`}>
                        {username}
                    </div>
                    <button onClick={toggleSidebar} className="focus:outline-none">
                        {/* SVG for toggle button, removed additional padding and margin that might offset alignment */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" fillRule="evenodd" d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                {/* Display additional menu items when the sidebar is not collapsed */}
                {!isCollapsed && (
                    <div className="p-5 w-full">
                        <button onClick={()=>{
                            logout();
                            navigate('/login');
                        }} className="w-full py-2 px-4 bg-blue-500 text-white rounded-md">Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
