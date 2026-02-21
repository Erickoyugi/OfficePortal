import React, { useState, useEffect } from 'react';
import SimSwapSidebar from '../../Component/SimSwapSidebar';


declare const Swal: any;

// Helper function to load SweetAlert2 script
const loadSweetAlertScript = () => {
  const scriptId = 'sweetalert2-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.async = true;
    document.body.appendChild(script);
  }
};

const AddUser: React.FC = () => {
  // State variables for the two form fields and the derived display name
  const [sAMAccountName, setsAMAccountName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'Admin' | 'User' | 'ICT' | 'Pesalink' | 'K2B' | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSweetAlertScript();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all fields have been filled
    if (!sAMAccountName.trim() || !role) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Required',
        text: 'Please fill out all fields.',
        confirmButtonColor: 'green',
        draggable: true,
        position: "top-end"
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        sAMAccountName: sAMAccountName,
        displayName: sAMAccountName, // Use sAMAccountName for displayName
        role: role,
      };

      const response = await fetch('https://testapidevops.creditbank.co.ke:3011/admin/add-authorized-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add user');
      }

      Swal.fire({
        icon: 'success',
        title: 'User Added!',
        text: data.message,
        confirmButtonColor: '#22C55E',
        position: "top-end"
      });

      // Reset form
      setsAMAccountName('');
      setDisplayName('');
      setRole('');

    } catch (error: any) {
      console.error('Error adding user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An error occurred while adding the user.',
        confirmButtonColor: '#EF4444',
        position: "top-end"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setsAMAccountName('');
    setDisplayName('');
    setRole('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
      {/* Sidebar specific to SIM Swap Service */}
      <SimSwapSidebar />

      {/* Main Content Area for Add User Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">New User</h2>
          <form onSubmit={handleAddUser}>
            <div className="mb-4">
              {/* sAMAccountName Input Field (combines sAMAccountName and displayName) */}
              <div className="relative z-0 w-full mb-6 group">
                <label htmlFor="sAMAccountName" className="block text-gray-700 text-sm font-semibold mb-2">
                 Username
                </label>
                <input
                  type="text"
                  id="sAMAccountName"
                  className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., erick.oyugi"
                  value={sAMAccountName}
                  onChange={(e) => {
                    setsAMAccountName(e.target.value);
                    setDisplayName(e.target.value); // Auto-update displayName
                  }}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Role Select Dropdown with new options */}
              <div className="relative z-0 w-full mb-6 group">
                <label htmlFor="selectRole" className="block text-gray-700 text-sm font-semibold mb-2">
                  Select Role
                </label>
                <select
                  id="selectRole"
                  className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'Admin' | 'User' | 'ICT' | 'Pesalink' | 'K2B')}
                  disabled={isLoading}
                  required
                >
                  <option value="" disabled>Select a role...</option>
                  <option value="Admin">Admin</option>
                  <option value="ICT">ICT</option>
                  <option value="Pesalink">Pesalink</option>
                  <option value="K2B">K2B</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-6 rounded-lg text-gray-700 font-bold transition-all duration-300 ease-in-out bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`py-2 px-6 rounded-lg text-white font-bold transition-all duration-300 ease-in-out
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl'
                  }`}
                disabled={isLoading || !sAMAccountName || !role}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddUser;
