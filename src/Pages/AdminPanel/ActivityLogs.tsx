// Filename: ActivityLogs.jsx
import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import AdminPanelSidebar from '../../Component/AdminPortalSideBar';

// Define the interface for a single log entry to ensure type safety.
// Note: The 'ID' from your Sequelize model maps to 'id' in the frontend.
interface LogEntry {
  ID: string;
  Timestamp: string;
  Action: string;
  Details: string;
}

/**
 * A component that displays a list of recent activity logs in a table format.
 * It now fetches its data from the backend API directly.
 */
export function ActivityLogs() {
  // State to hold the logs fetched from the API
  const [logs, setLogs] = useState<LogEntry[]>([]);
  // State to handle loading and error states for a better user experience
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect hook to perform the API call.
   * The empty dependency array [] ensures this effect runs only once
   * when the component mounts.
   */
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Your GET endpoint from the backend
        const response = await fetch('http://localhost:3001/creditbank/api/v1/get/logs');

        // Check for a successful response (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the API response returns an object with a 'data' array
        if (data && data.data) {
          setLogs(data.data);
        } else {
          // Handle cases where the data structure is not what's expected
          setLogs([]);
        }
      } catch (e: any) {
        // Handle any network or parsing errors
        console.error('Failed to fetch activity logs:', e);
        setError('Failed to load activity logs.');
      } finally {
        // Set loading to false once the fetch is complete, regardless of success or failure
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []); // The empty array ensures this effect runs only once on mount

  // Conditional rendering based on the component's state
  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-40 bg-white rounded-xl shadow-lg p-6 mt-8">
        <p className="text-gray-500 font-medium">Loading activity logs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-40 bg-white rounded-xl shadow-lg p-6 mt-8">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </section>
    );
  }

  // Render the table once data is loaded
  return (

    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
      {/* Sim Swap Sidebar component */}
      <AdminPanelSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        {/* Header section with title and breadcrumb */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Home / <span className="font-semibold text-gray-700">Activity Logs</span></p>
        </header>

    <section className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Activity className="h-6 w-6 text-indigo-500 mr-2" />
        Recent Activity Logs
      </h2>
      <div className="overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity logs to display.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.ID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(log.Timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.Action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {log.Details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  
    </section>
        </div>
      </div>
  );
};


