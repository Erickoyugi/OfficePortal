import React, { useEffect, useState } from "react";
import SimSwapSidebar from '../../Component/SimSwapSidebar';
import Swal from "sweetalert2"; // 🔹 import Swal
import axios from "axios";
import SmartAliasSidebar from "../../Component/SmartAliasSidebar";


// Mock data for the dashboard summary cards
const dashboardData = [
  { title: "Accounts", count: 125, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M5 21H3m2 0h2m0 0h12v2H7v-2zm0 0a2 2 0 01-2-2V7m4 0h12a2 2 0 012 2v12m-14-12h2m-2 0h-2m-2 0h-2M5 21v-2a2 2 0 012-2h12a2 2 0 012 2v2M5 21h14M7 5v2m0 0h10v2H7V5z" />
</svg> },
  { title: "Subscribers", count: 76, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m13-2a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h10zm-3.414-9.586a2 2 0 112.828 2.828l-4.243 4.243c-1.172 1.172-3.072 1.172-4.243 0l-4.243-4.243a2 2 0 012.828-2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414z" />
</svg>},
  { title: "Users", count: 1, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg> },
  { title: "Archives", amount: "Ksh 0", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1V7m0 1a4 4 0 00-4 4h8a4 4 0 00-4-4zm-2.828-4.243c.78-.78 2.04-.78 2.828 0l.707.707a2 2 0 010 2.828l-.707.707a2 2 0 01-2.828 0l-.707-.707a2 2 0 010-2.828l.707-.707zm3.536 3.536c.78-.78 2.04-.78 2.828 0l.707.707a2 2 0 010 2.828l-.707.707a2 2 0 01-2.828 0l-.707-.707a2 2 0 010-2.828l.707-.707z" />
</svg>}
];

interface AliasData {
  id: number;
  transactionType: string;
  accountNumber: string;
  transactionReference: string;
  aliasAccountName: string;
  customerName: string;
  phoneNumber: string;
  isArchived: string;
}



export function SmartAliasHome() {


const [aliasList, setAliasList] = useState<AliasData[]>([]);

const activeAliases = aliasList.filter((item) => item.isArchived === "0");
const archivedAliases = aliasList.filter((item) => item.isArchived === "1");

const dashboardData = [
        { 
            title: "Total Aliases", 
            count: aliasList.length, // Total count of all records
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M5 21H3m2 0h2m0 0h12v2H7v-2zm0 0a2 2 0 01-2-2V7m4 0h12a2 2 0 012 2v12m-14-12h2m-2 0h-2m-2 0h-2M5 21v-2a2 2 0 012-2h12a2 2 0 012 2v2M5 21h14M7 5v2m0 0h10v2H7V5z" />
</svg>
        },
        // Assuming "Subscribers" is the count of currently Active Aliases
        { 
            title: "Active Aliases", 
            count: activeAliases.length, 
           icon : <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m13-2a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h10zm-3.414-9.586a2 2 0 112.828 2.828l-4.243 4.243c-1.172 1.172-3.072 1.172-4.243 0l-4.243-4.243a2 2 0 012.828-2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414z" />
</svg>
        },
        // We'll keep 'Users' static or remove it if not relevant to alias counts
        { 
            title: "Users", 
            count: 1, 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg>
        },
        // Your Archives/Deleted Alias Count
        { 
            title: "Archived Aliases", 
            count: archivedAliases.length, // The count of records where isArchived is "1"
            // Since you used 'amount: "Ksh 0"' before, we'll use 'count' for consistency
           icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1V7m0 1a4 4 0 00-4 4h8a4 4 0 00-4-4zm-2.828-4.243c.78-.78 2.04-.78 2.828 0l.707.707a2 2 0 010 2.828l-.707.707a2 2 0 01-2.828 0l-.707-.707a2 2 0 010-2.828l.707-.707zm3.536 3.536c.78-.78 2.04-.78 2.828 0l.707.707a2 2 0 010 2.828l-.707.707a2 2 0 01-2.828 0l-.707-.707a2 2 0 010-2.828l.707-.707z" />
</svg>
        }
    ];

  useEffect(() => {
    const fetchAliasData = async () => {
      try {
        const response = await axios.get(
          "https://testapidevops.creditbank.co.ke:3013/creditbank/api/v1/get/alias/list"
        );
        if (response.data && response.data.success) {
          setAliasList(response.data.data);
        } else {
          // If success flag is false
          Swal.fire({
            icon: "error",
            title: "Fetch Failed",
            text: "Failed to retrieve alias data from the server.",
          });
        }
      } catch (error) {
        console.error("Error fetching alias list:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch data from the database. Please try again later.",
        });
      }
    };

    fetchAliasData();
  }, []);


function formatDateTime(){

    const date = new Date();

      return date.toLocaleString();

}

// const activeAliases = aliasList.filter((item) => item.isArchived === "0");
// const archivedAliases = aliasList.filter((item) => item.isArchived === "1")
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-stone-300 font-inter">
      {/* Sim Swap Sidebar component */}
      <SmartAliasSidebar />
      
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
                                {/* 💥 Display the dynamic count */}
                                <p className="text-3xl font-bold text-gray-800 mt-2">
                                  {item.count}
                                </p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full">
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>
        {/* Registered Users table section */}
<section className="bg-white rounded-xl shadow-2xl p-6 mb-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-2">
            Registered Users
          </h2>
<div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-indigo-50/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider rounded-tl-lg">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Account Number</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider rounded-tr-lg">Alias Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeAliases.map((alias) => (
                        <tr key={alias.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.accountNumber}</td>
                          {/* <td>{alias.transactionType}</td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.aliasAccountName}</td>
                          {/* <td>{alias.transactionReference}</td> */}
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Archived Alias table section */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Deleted Alias</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Archived</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {archivedAliases.map((alias) => (
                  <tr key={alias.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alias.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.accountNumber}</td>
                                    {/* Assuming transactionType is the 'Channel' */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.transactionType}</td> 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alias.aliasAccountName}</td>
                                    {/* NOTE: If your model had createdAt or updatedAt, use it here */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
