import React from 'react';

const Logs: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">SIM Swap Logs</h2>
      <p className="text-gray-600 text-lg">
        This page will display detailed logs of SIM swap checks.
      </p>
      {/* You can add a table of logs here */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg max-h-96 overflow-y-auto text-left">
        <p className="font-mono text-sm text-gray-700">
          [2025-08-06 14:00:01] Request for +254712345678 - Success<br/>
          [2025-08-06 14:01:15] Request for +254723456789 - SIM Swapped (01-01-1900)<br/>
          [2025-08-06 14:02:30] Request for +254734567890 - No SIM Swap Detected<br/>
          {/* ... more log entries */}
          (Placeholder Logs)
        </p>
      </div>
    </div>
  );
};

export default Logs;
