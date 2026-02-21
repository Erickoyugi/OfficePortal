// APIs.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Info } from 'lucide-react';
import { Endpoint } from '../types/types';



const ApiDetailsContent: React.FC = () => {
  const [apiEndpoints, setApiEndpoints] = useState<Endpoint[]>([]); // Renamed for clarity
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const MINIMUM_LOAD_TIME = 3000; // 3 seconds for a smoother feel
  const BACKEND_API_KONG_URL = 'https://itservices.creditbank.co.ke:3001/api/kong/'; // New API endpoint

  const fetchApiEndpoints = async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      console.log(`APIs: Attempting to fetch from backend: ${BACKEND_API_KONG_URL}`);
      const response = await fetch(BACKEND_API_KONG_URL);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
      }

      const data: Endpoint[] = await response.json();
      setApiEndpoints(data);
      console.log("APIs: Fetched data:", data);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = MINIMUM_LOAD_TIME - elapsedTime;

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

    } catch (err: any) {
      console.error("APIs: Failed to fetch API details:", err);
      setError(`Failed to load API details from ${BACKEND_API_KONG_URL}. Please ensure your backend is running, accessible, and serving over HTTPS. Error: ${err.message || 'Network error'}`);

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
    fetchApiEndpoints();
    const intervalId = setInterval(fetchApiEndpoints, 60000); // Fetch every 60 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-full border border-white border-opacity-30 flex justify-center items-center py-8">
        <Loader className="animate-spin text-purple-600 w-10 h-10 mr-3" />
        <span className="text-lg text-gray-700">Loading API details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (apiEndpoints.length === 0) {
    return (
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-full border border-white border-opacity-30 text-gray-800">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">API Details</h1>
        <p className="text-lg text-center">No specific APIs found to display in this section.</p>
        <p className="mt-4 text-center text-gray-600">Please ensure the backend is running and the required API data is available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-full border border-white border-opacity-30 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">API Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apiEndpoints.map((api) => (
          <div
            key={api.id}
            className={`flex flex-col items-start p-4 rounded-lg shadow-md transition-all duration-300 h-full
              ${api.status === 'Up' ? 'bg-green-50 border-green-200' :
                api.status === 'Down' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'}
              border-l-4
            `}
          >
            <div className="flex-1 w-full mb-2">
              <h2 className="text-lg font-semibold text-gray-800">{api.name}</h2>
              <p className="text-sm text-gray-600 truncate">{api.url}</p>
              <p className="text-xs text-gray-500 mt-1">Method: {api.method}</p>
              <p className="text-xs text-gray-500 mt-1">Last Checked: {api.lastChecked}</p>
            </div>
            <div className="flex items-center space-x-2 mt-auto">
              {api.status === 'Up' ? (
                <CheckCircle className="text-green-500 w-6 h-6" />
              ) : api.status === 'Down' ? (
                <XCircle className="text-red-500 w-6 h-6" />
              ) : (
                <Loader className="animate-spin text-blue-500 w-6 h-6" />
              )}
              <span className={`text-lg font-bold ${api.status === 'Up' ? 'text-green-600' :
                api.status === 'Down' ? 'text-red-600' : 'text-blue-600'}`}>
                {api.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-gray-600 text-sm">
        API details are updated with the dashboard every 60 seconds.
      </p>
    </div>
  );
};

export default ApiDetailsContent;
