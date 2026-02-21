import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TotalRequests from './Simswap/TotalRequest';
import Logs from './Simswap/Logs';
import SimSwapSidebar from '../Component/SimSwapSidebar';



// Define interfaces for API responses
interface SimSwapData {
  requestRefID: string;
  responseCode: string;
  responseDesc: string;
  msisdnRegistrationDate?: string; // Made optional as it might not always be present in 'already searched' data
  lastSwapDate: string;
  customerNumber: string;
  source?: string; // Add source field for 'already searched' response
}

// Updated SimApiResponse to be more flexible for the "already searched" response
interface SimApiResponse {
  message: string;
  data: SimSwapData; // Now data is consistently SimSwapData
}

// Declare swal as a global variable to avoid TypeScript errors
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

// Component for the actual SIM Swap Checker Form
const SimSwapForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSweetAlertScript();
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const checkSimSwap = async () => {
    if (!phoneNumber.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Required',
        text: 'Please enter a phone number to check.',
        confirmButtonColor: 'green',
        draggable: true,
        position: "top-end"
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const apiUrl = 'https://testapidevops.creditbank.co.ke:3015/creditbank/api/v1/checkATI'; // Your actual SIM swap API endpoint

      const payload = {
        customerNumber: phoneNumber,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const apiResponse: SimApiResponse = await response.json();

      // --- UPDATED LOGIC FOR ALREADY SEARCHED PHONE NUMBER ---
      if (apiResponse.message && apiResponse.message.includes("This phone number has been searched before")) {
        const previousSimSwapData: SimSwapData = apiResponse.data; // Cast to SimSwapData
        Swal.fire({
          icon: 'info', // Changed icon to 'info' for already searched
          title: 'Already Searched!',
          html: `
            <p class="mb-2"><strong>${apiResponse.message}</strong></p>
            <p><strong>Request Ref ID:</strong> ${previousSimSwapData.requestRefID || 'N/A'}</p>
            <p><strong>Response Code:</strong> ${previousSimSwapData.responseCode || 'N/A'}</p>
            <p><strong>Description:</strong> ${previousSimSwapData.responseDesc || 'N/A'}</p>
            <p><strong>Last Swap Date:</strong> ${previousSimSwapData.lastSwapDate || 'N/A'}</p>
            <p><strong>Customer Number:</strong> ${previousSimSwapData.customerNumber || 'N/A'}</p>
            <p><strong>Source:</strong> ${previousSimSwapData.source || 'N/A'}</p>
          `,
          confirmButtonColor: '#17A2B8', // Info blue color
          draggable: true,
          position: "top-end"
        });
      } else {
        // Existing logic for new SIM swap check results
        const apiResult: SimSwapData = apiResponse.data;

        const isSimSwapped = !(apiResult.responseCode === "200" && apiResult.responseDesc === "Success");

        if (isSimSwapped) {
          Swal.fire({
            icon: 'error',
            title: 'SIM Swapped!',
            html: `
              <p><strong>Request Ref ID:</strong> ${apiResult.requestRefID}</p>
              <p><strong>Response Code:</strong> ${apiResult.responseCode}</p>
              <p><strong>Description:</strong> ${apiResult.responseDesc}</p>
              <p><strong>Last Swap Date:</strong> ${apiResult.lastSwapDate}</p>
              <p><strong>Customer Number:</strong> ${apiResult.customerNumber}</p>
            `,
            confirmButtonColor: '#EF4444',
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'No SIM Swap Detected',
            html: `
              <p><strong>Request Ref ID:</strong> ${apiResult.requestRefID}</p>
              <p><strong>Description:</strong> ${apiResult.responseDesc}</p>
              <p><strong>Registration Date:</strong>${apiResult.msisdnRegistrationDate}</p>
              <p><strong>Last Swap Date:</strong> ${apiResult.lastSwapDate}</p>
              <p><strong>Customer Number:</strong> ${apiResult.customerNumber}</p>
            `,
            confirmButtonColor: '#22C55E',
          });
        }
      }
      // --- END UPDATED LOGIC ---

    } catch (err: any) {
      console.error("Error checking SIM swap:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || "Failed to connect to the SIM swap service. Please try again.",
        confirmButtonColor: '#EF4444',
        position: "top-end"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        SIM Swap Checker
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Enter a phone number to check if a SIM card swap has occurred.
      </p>

      <div className="mb-6">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          placeholder="e.g., 2547000000"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={checkSimSwap}
        className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ease-in-out
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl'
          }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking...
          </div>
        ) : (
          'Check SIM Swap'
        )}
      </button>
    </div>
  );
};


// Main SimSwapCheckerPage component (acts as a layout)
const SimSwapCheckerPage: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white-500 to-stone-300 font-inter">
      {/* Sidebar specific to SIM Swap Service */}
      <SimSwapSidebar />

      {/* Main Content Area for SIM Swap Service */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Routes>
          {/* Default route for /home/sim-checker, shows the form */}
          <Route path="/" element={<SimSwapForm />} />
          {/* Routes for the sidebar menus */}
          <Route path="total-requests" element={<TotalRequests />} />
          <Route path="logs" element={<Logs />} />
        </Routes>
      </main>
    </div>
  );
};

export default SimSwapCheckerPage;
