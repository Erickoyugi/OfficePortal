// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Endpoint } from '../types/types';



const DashboardContent: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const MINIMUM_LOAD_TIME = 3000; // 3 seconds for a smoother feel
  const BACKEND_API_URL = 'https://itservices.creditbank.co.ke:3001/api/endpoint-statuses';

  const fetchEndpointStatuses = async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      console.log(`Dashboard: Attempting to fetch from backend: ${BACKEND_API_URL}`);
      const response = await fetch(BACKEND_API_URL);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
      }

      const data: Endpoint[] = await response.json();
      setEndpoints(data);
      console.log("Dashboard: Fetched data:", data);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = MINIMUM_LOAD_TIME - elapsedTime;

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

    } catch (err: any) {
      console.error("Dashboard: Failed to fetch endpoint statuses:", err);
      setError(`Failed to load dashboard data from ${BACKEND_API_URL}. Please ensure your backend is running, accessible, and serving over HTTPS. Error: ${err.message || 'Network error'}`);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = MINIMUM_LOAD_TIME - elapsedTime;
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpointStatuses();
    const intervalId = setInterval(fetchEndpointStatuses, 60000); // Fetch every 60 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 w-full border border-white border-opacity-30">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        ICT Monitor Dashboard
      </h1>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin text-purple-600 w-10 h-10 mr-3" />
          <span className="text-lg text-gray-700">Loading statuses...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!loading && endpoints.length === 0 && !error && (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg">No endpoints to display. Add some to get started!</p>
        </div>
      )}

      {!loading && endpoints.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Three columns on medium and large screens */}
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              className={`flex flex-col items-start p-4 rounded-lg shadow-md transition-all duration-300 h-full
                ${endpoint.status === 'Up' ? 'bg-green-50 border-green-200' :
                  endpoint.status === 'Down' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'}
                border-l-4
              `}
            >
              <div className="flex-1 w-full mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{endpoint.name}</h2>
                <p className="text-xs text-gray-500 mt-1">Last Checked: {endpoint.lastChecked}</p>
              </div>
              <div className="flex items-center space-x-2 mt-auto">
                {endpoint.status === 'Up' ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : endpoint.status === 'Down' ? (
                  <XCircle className="text-red-500 w-6 h-6" />
                ) : (
                  <Loader className="animate-spin text-blue-500 w-6 h-6" />
                )}
                <span className={`text-lg font-bold ${endpoint.status === 'Up' ? 'text-green-600' :
                  endpoint.status === 'Down' ? 'text-red-600' : 'text-blue-600'}`}>
                  {endpoint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>Dashboard updates every 60 seconds.</p>
      </div>
    </div>
  );
};

export default DashboardContent;
