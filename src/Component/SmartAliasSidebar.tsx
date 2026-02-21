import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SmartAliasSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-orange-600 text-white p-6 space-y-4 shadow-lg flex flex-col">
      <div className="text-2xl font-bold text-center mb-8">Smart Alias Portal</div>
      <nav className="flex-grow">
        <ul>
        <li className="mb-2">
            <Link
              to="/alias/home/portal"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/alias/home/portal' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
             Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/smart/alias/list/users"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/smart/alias/list/users' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
             Alias List
            </Link>
          </li>
          {/* Add a link back to the main SIM Checker form, if desired */}
          <li className="mb-2">
            <Link
              to="/smart/alias/add/users"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/smart/alias/add/users' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
            Add Alias
            </Link>
          </li>

                    <li className="mb-2">
            <Link
              to="/smart/alias/audit/logs"
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 block
                ${location.pathname === '/smart/alias/audit/logs' ? 'bg-indigo-700' : 'hover:bg-gray-700'}`}
            >
            Audit Logs
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SmartAliasSidebar;
