// Switches.tsx
import React, { useState } from 'react';
import { Loader } from 'lucide-react'; // Import Loader icon

const SwitchesContent: React.FC = () => {
  // These states would be populated by a fetch request if this component had its own data source
  const [loading, setLoading] = useState<boolean>(false); // Set to false initially as it's static content
  const [error, setError] = useState<string | null>(null);

  // Example of how you might fetch data for switches if needed:
  /*
  useEffect(() => {
    const fetchSwitchesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://itservices.creditbank.co.ke:3001/api/switches');
        if (!response.ok) throw new Error('Failed to fetch switches data');
        const data = await response.json();
        // setSwitches(data); // Assuming you have a state for switches data
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSwitchesData();
    const intervalId = setInterval(fetchSwitchesData, 60000);
    return () => clearInterval(intervalId);
  }, []);
  */

  if (loading) {
    return (
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-full border border-white border-opacity-30 flex justify-center items-center py-8">
        <Loader className="animate-spin text-purple-600 w-10 h-10 mr-3" />
        <span className="text-lg text-gray-700">Loading Switches data...</span>
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

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-full border border-white border-opacity-30 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Network Switches</h1>
      <p className="text-lg text-center">Monitoring and configuration for network switches will be displayed here.</p>
      <p className="mt-4 text-center text-gray-600">Check back for updates!</p>
    </div>
  );
};

export default SwitchesContent;
