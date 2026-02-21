import React, { useState, useEffect } from 'react';
import SimSwapSidebar from '../../Component/SimSwapSidebar';

// Define the SimSwapResponse data type
interface SimSwapResponse {
  id: number;
  requestRefID: string;
  responseCode: string;
  responseDesc: string;
  lastSwapDate: string;
  customerNumber: string;
  createdAt: string;
}

const TotalRequests: React.FC = () => {
  // State variables for fetching and displaying data
  const [responses, setResponses] = useState<SimSwapResponse[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Function to fetch the data from the backend
  const fetchResponses = async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      // Replace with your actual backend URL for fetching responses
      const response = await fetch('https://testapidevops.creditbank.co.ke:3015/creditbank/api/v1/get/responses');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setResponses(data.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setDataError(error.message || 'An error occurred while fetching data.');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchResponses();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white-500 to-stone-300 font-inter">
      {/* Sidebar specific to SIM Swap Service */}
      <SimSwapSidebar />
      
      <main className="flex-1 flex flex-col items-center justify-start p-4 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Sim Swap Responses</h3>
        {isDataLoading && <p className="text-gray-500">Loading data...</p>}
        {dataError && <p className="text-red-500">Error: {dataError}</p>}
        {!isDataLoading && !dataError && responses.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Swap Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response) => (
                  <tr key={response.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {response.customerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.responseCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.responseDesc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.lastSwapDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isDataLoading && !dataError && responses.length === 0 && (
            <p className="text-gray-500 mt-4">No data found in the database.</p>
        )}
      </main>
    </div>
  );
};

export default TotalRequests;
