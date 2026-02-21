import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Send, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const ForexReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, sent: 0 });

  // Simulated Fetch from your Java Backend
  const fetchReports = async () => {
    setLoading(true);
    try {
      // Replace with your actual endpoint: http://localhost:8080/fetch
      const response = await fetch('/api/reports'); 
      const data = await response.json();
      setReports(data);
      
     const pending = data.filter((r: any) => r.RECORD_INDICATOR === '0').length;
      setStats({ pending, sent: data.length - pending });
    } catch (error) {

      Swal.fire({
         icon:'error',
         title:'Error fetching reports',
         text:`${error}`,
         position:'top-end'
      })
      // console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger the Backend Controller Push
  const handlePushToCBK = async () => {
    setLoading(true);
    try {
      // This hits your InboundController handle method
      const response = await fetch('/api/push', { method: 'POST' });
      const result = await response.json();
      alert(result.message || "Process Completed");
      fetchReports(); // Refresh data
    } catch (error) {
      Swal.fire({
         icon:'error',
         title:'Failed!',
         text:`${error}`,
         position:'top-end'
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            Forex Inbound Reporting
          </h1>
          <p className="text-gray-500">Central Bank of Kenya (CBK) Submission Portal</p>
        </div>
        <button 
          onClick={handlePushToCBK}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <Send size={18} />}
          Push Pending to CBK
        </button>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 font-medium">Pending Records</p>
            <Clock className="text-orange-500" size={20} />
          </div>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 font-medium">Successfully Sent</p>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold mt-2">{stats.sent}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 font-medium">System Status</p>
            <AlertCircle className="text-blue-500" size={20} />
          </div>
          <p className="text-lg font-semibold mt-2 text-green-600">Connected</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Ref No</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Currency</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reports.map((report) => (
              <tr key={report.ROW_ID} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-gray-700">{report.TRANSACTION_REFERENCE_NO}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{report.CUSTOMER_NAME}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.CB_CURRENCY_TRADED}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                  {new Intl.NumberFormat().format(report.AMOUNT_IN_TRADED_CURRENCY)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.RECORD_INDICATOR === '1' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                  }`}>
                    {report.RECORD_INDICATOR === '1' ? 'Sent' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  No records found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForexReports;