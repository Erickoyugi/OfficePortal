import React, { useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  userCount: number | null;
  fetchUserCount: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userCount, fetchUserCount }) => {
  const location = useLocation(); // Hook to get current URL path

  // Fetch user count on component mount and when a user is added (via onUserAdded prop)
  // This useEffect will run when the component mounts or fetchUserCount changes
  useEffect(() => {
    fetchUserCount();
  }, [fetchUserCount]);

  return (
    <aside className="w-64 bg-orange-600 text-white p-6 space-y-4 shadow-lg flex flex-col">
      <div className="text-2xl font-bold text-center mb-8">Portal Dashboard</div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link
              to="/sim/swap/checker/add/user" // Nested route for Add Users
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/sim/swap/checker/add/user' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
          
            </Link>
          </li>
          {/* Assuming /users is a top-level route from your App.tsx */}
          <li className="mb-2">
            <Link
              to="/users/list"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/users' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
           
            </Link>
          </li>
        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;
