import React, { useState, useEffect, useCallback } from 'react';
import SimSwapSidebar from '../../Component/SimSwapSidebar';
import Swal from "sweetalert2"; // 🔹 import Swal
import axios from "axios";
import SmartAliasSidebar from "../../Component/SmartAliasSidebar";
import AdminPanelSidebar from "../../Component/AdminPortalSideBar";



// Mock data for the dashboard summary cards
const dashboardData = [
  { title: "ICT", count: 1, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M5 21H3m2 0h2m0 0h12v2H7v-2zm0 0a2 2 0 01-2-2V7m4 0h12a2 2 0 012 2v12m-14-12h2m-2 0h-2m-2 0h-2M5 21v-2a2 2 0 012-2h12a2 2 0 012 2v2M5 21h14M7 5v2m0 0h10v2H7V5z" />
</svg> },
  { title: "Operations", count: 2, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m13-2a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h10zm-3.414-9.586a2 2 0 112.828 2.828l-4.243 4.243c-1.172 1.172-3.072 1.172-4.243 0l-4.243-4.243a2 2 0 012.828-2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414z" />
</svg>},
  { title: "Digital", count: 1, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg> },
  { title: "Customer Service", amount: "0", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1V7m0 1a4 4 0 00-4 4h8a4 4 0 00-4-4zm-2.828-4.243c.78-.78 2.04-.78 2.828 0l.707.707a2 2 0 010 2.828l-.707.707a2 2 0 01-2.828 0l-.707-.707a2 2 0 010-2.828l.707-.707zm3.536 3.536c.78-.78 2.04-.78 2.828 0l.707.707a2 2 0 010 2.828l-.707.707a2 2 0 01-2.828 0l-.707-.707a2 2 0 010-2.828l.707-.707z" />
</svg>}
];

// Define interface for a single user item from your API response
interface UserData {
  sAMAccountName: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Define interface for the full API response structure
interface UserListApiResponse {
  message: string;
  data: UserData[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}



export function AdminPanelHome() {


  const [userCount, setUserCount] = useState<number | null>(null);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isMinimumLoadingDurationMet, setIsMinimumLoadingDurationMet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  // State for update modal and form data
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<UserData | null>(null);
  const [updateFormData, setUpdateFormData] = useState({
    displayName: '',
    role: '',
  });

  // State for messages (success/error) after an action
  const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


   // State to store activity logs
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([]);


    // Function to add a new log entry
  const logActivity = useCallback((action: string, details: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    // Prepend new logs to the array to show the most recent first
    setActivityLogs(prevLogs => [newLog, ...prevLogs]);
  }, []);
  // Function to fetch the list of users
  const fetchUserList = useCallback(async () => {
    setIsLoadingUsers(true);
    setError(null);
    try {
      // Your API endpoint for user list
      const response = await fetch('https://testapidevops.creditbank.co.ke:3011/creditbank/api/user/list');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      const apiResponse: UserListApiResponse = await response.json();
      setUserList(apiResponse.data);
    } catch (err: any) {
      console.error('Error fetching user list:', err);
      setError(err.message || 'Failed to fetch user list. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Effect for initial data fetching and minimum loader duration
  useEffect(() => {
    fetchUserList();

    // Set a timeout for the minimum loader duration (30 seconds)
    const timer = setTimeout(() => {
      setIsMinimumLoadingDurationMet(true);
    }, 30000); // 30 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [fetchUserList]);

  // Handle delete action click
  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handle actual delete API call (mocked)
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setShowDeleteModal(false);
    setIsLoadingUsers(true);
    setStatusMessage(null);

    try {
      // Replace with your actual DELETE API endpoint
      const response = await fetch(`https://localhost:3001/creditbank/api/user/${userToDelete.sAMAccountName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      setStatusMessage({ message: `User '${userToDelete.sAMAccountName}' deleted successfully.`, type: 'success' });
      fetchUserList(); // Refresh the user list
    } catch (err: any) {
      setStatusMessage({ message: err.message || 'Failed to delete user.', type: 'error' });
    } finally {
      setIsLoadingUsers(false);
      setUserToDelete(null);
    }
  };

  // Handle update action click
  const handleUpdateClick = (user: UserData) => {
    setUserToUpdate(user);
    setUpdateFormData({
      displayName: user.displayName,
      role: user.role,
    });
    setShowUpdateModal(true);
  };

  // Handle form change
  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle actual update API call (not mocked)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToUpdate) return;
    setShowUpdateModal(false);
    setIsLoadingUsers(true);
    setStatusMessage(null);

  const oldRole = userToUpdate.role; // Capture the old role for logging

    try {
      // Your API endpoint for PUT/PATCH request
      const response = await fetch('https://localhost:3001/creditbank/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sAMAccountName: userToUpdate.sAMAccountName,
          displayName: updateFormData.displayName,
          role: updateFormData.role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      setStatusMessage({ message: `User '${userToUpdate.sAMAccountName}' updated successfully.`, type: 'success' });
      logActivity('User Updated', `Updated user '${userToUpdate.sAMAccountName}' from role '${oldRole}' to '${updateFormData.role}'`);
    
      fetchUserList(); // Refresh the user list
    } catch (err: any) {
      setStatusMessage({ message: err.message || 'Failed to update user.', type: 'error' });
         logActivity('Update Failed', `Failed to update user: ${userToUpdate.sAMAccountName}`);
    } finally {
      setIsLoadingUsers(false);
      setUserToUpdate(null);
      setUpdateFormData({ displayName: '', role: '' });
    }
  };

  const showOverallLoader = isLoadingUsers && !isMinimumLoadingDurationMet;
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
      {/* Sim Swap Sidebar component */}
      <AdminPanelSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        {/* Header section with title and breadcrumb */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Home / <span className="font-semibold text-gray-700">Dashboard</span></p>
        </header>

        {/* Dashboard summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-300 hover:scale-105">
              <div>
                <h3 className="text-lg font-medium text-gray-500">{item.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{item.count || item.amount}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Registered Users table section */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Back Office Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Display Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userList.map((user) => (
                    <tr key={user.sAMAccountName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.sAMAccountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleUpdateClick(user)}
                          className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900v"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        </section>

              {/* Update User Modal */}
      {showUpdateModal && userToUpdate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update User</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={updateFormData.displayName}
                  onChange={handleUpdateFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={updateFormData.role}
                  onChange={handleUpdateFormChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Admin">Admin</option>
                  <option value="pesalink">Pesalink</option>
                  <option value="k2b">SmartAlias</option>
                  <option value="ict">ICT</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

            {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user `
              <span className="font-semibold text-red-600">{userToDelete.sAMAccountName}</span>`?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      </div>
    </div>
  );
}
