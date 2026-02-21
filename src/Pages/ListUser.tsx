import React, { useState, useEffect, useCallback } from 'react';
import SimSwapSidebar from '../Component/SimSwapSidebar';

// Since the SimSwapSidebar component could not be resolved,
// we'll use a placeholder sidebar to ensure the layout is correct.
// You will need to replace this with your actual SimSwapSidebar component.
const PlaceholderSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-6 min-h-screen">
      <div className="flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="ml-3 text-2xl font-bold">Menu</span>
      </div>
      <nav className="space-y-2">
        <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">
          Dashboard
        </a>
        <a href="#" className="flex items-center py-2 px-4 rounded-md bg-gray-700 font-semibold">
          Authorized Users
        </a>
      </nav>
    </div>
  );
};

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

export function ListUser() {
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
      fetchUserList(); // Refresh the user list
    } catch (err: any) {
      setStatusMessage({ message: err.message || 'Failed to update user.', type: 'error' });
    } finally {
      setIsLoadingUsers(false);
      setUserToUpdate(null);
      setUpdateFormData({ displayName: '', role: '' });
    }
  };

  const showOverallLoader = isLoadingUsers && !isMinimumLoadingDurationMet;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
      {/* Sidebar Component */}
     <SimSwapSidebar/>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 hover:scale-105">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
            Authorized Users
          </h1>
          {statusMessage && (
            <div className={`p-4 mb-4 rounded-lg text-white font-medium ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {statusMessage.message}
            </div>
          )}
          {showOverallLoader ? (
            <div className="flex items-center justify-center py-10">
              <svg className="animate-spin h-8 w-8 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-700">Loading users...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 font-medium text-center py-10">
              <p className="mb-2">Error loading users:</p>
              <p>{error}</p>
            </div>
          ) : userList.length === 0 ? (
            <div className="text-gray-600 text-center py-10">
              <p>No authorized users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      sAMAccountName
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
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
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
                          className="text-indigo-600 hover:text-indigo-900 font-bold"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900 font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

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
    </div>
  );
}
