// App.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Only need Menu and X for sidebar toggle
import DashboardContent from '../../Pages/Dashboard';
import ApiDetailsContent from '../../Pages/APIs';
import SwitchesContent from '../../Pages/Switches';
import ServersContent from '../../Pages/Server';


// Import the modularized components


// Define interface for Sidebar props
interface SidebarProps {
  selectedItem: string;
  onSelect: (item: string) => void;
}

// Sidebar component: Provides navigation links
const Sidebar: React.FC<SidebarProps> = ({ selectedItem, onSelect }) => {
  const menuItems = ['Dashboard', 'APIs', 'Switches', 'Servers'];

  return (
    <nav className="flex flex-col p-4 space-y-2">
      {menuItems.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`
            flex items-center px-4 py-2 rounded-lg text-left transition-all duration-200
            ${selectedItem === item
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-gray-200 hover:bg-purple-700 hover:text-white'
            }
          `}
        >
          <span className="ml-2 text-lg">{item}</span>
        </button>
      ))}
    </nav>
  );
};

// Main App component: Handles overall layout and navigation
const ICTApp = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to render content based on the selected menu item
  const renderContent = () => {
    // Each content component now manages its own data fetching and states
    switch (selectedMenuItem) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'APIs':
        return <ApiDetailsContent />;
      case 'Servers':
        return <ServersContent />;

      default:
        return (
          <div className="text-center text-gray-700">
            <p className="text-lg">Select a menu item to view content.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-500 via-white-500 to-white-500 flex flex-col md:flex-row font-sans">
      {/* Mobile Menu Button - visible only on small screens */}
      <div className="md:hidden p-4 flex justify-end">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Menu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Sidebar - fixed on mobile, relative on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 bg-orange-800 text-white w-64 p-4 z-50
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex-shrink-0
        transition-transform duration-300 ease-in-out
        flex flex-col rounded-r-xl md:rounded-none shadow-lg
      `}>
        <h2 className="text-2xl font-bold text-center mb-6 mt-4">ICT Monitoring</h2>
        <Sidebar selectedItem={selectedMenuItem} onSelect={(item) => {
          setSelectedMenuItem(item);
          setIsSidebarOpen(false);
        }} />
      </aside>

      {/* Main Content Area - takes remaining space */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 flex justify-center items-center overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default ICTApp;
