import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminPanelSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-orange-600 text-white p-6 space-y-4 shadow-lg flex flex-col">
      <div className="text-2xl font-bold text-center mb-8">Admin Panel</div>
      <nav className="flex-grow">
        <ul>
        <li className="mb-2">
            <Link
              to="/sim/swap/users/list"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/sim/swap/users/list' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
              List Users
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/sim/swap/checker/add/user"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/sim/swap/checker/add/user' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
              Add User
            </Link>
          </li>
          {/* Add a link back to the main SIM Checker form, if desired */}
          <li className="mb-2">
            <Link
              to="/admin/panel/portal/activity/logs"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/admin/panel/portal/activity/logs' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
             Activity Logs
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminPanelSidebar;
