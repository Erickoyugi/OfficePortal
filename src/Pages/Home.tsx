import React, { useState, useEffect, useCallback, JSX } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import SimSwapCheckerPage from './SimswapChecker';
import AddUser from './Simswap/AddUser';
import Sidebar from '../Component/Sidebar';

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

// Define a type for a service item
interface ServiceItem {
  name: string;
  route: string;
  roles: string[]; // Roles required to see this service
  status?: 'Up' | 'Down'; // Placeholder for status
  lastChecked?: string; // Placeholder for last checked time
 iconSvg: JSX.Element; 
}


const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href ='/'
};

function Home() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load SweetAlert2 script when Home component mounts
  useEffect(() => {
    loadSweetAlertScript();
  }, []);

  // Effect to load user roles from local storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        // --- FIX START ---
        // Parse the JSON string back into a JavaScript object
        const user = JSON.parse(storedUser);
        console.log("Parsed user from local storage:", user); // Debugging log

        if (user && user.role) {
          // Ensure role is always an array for consistency
          setUserRoles(Array.isArray(user.role) ? user.role : [user.role]);
        }
        // --- FIX END ---
      }
    } catch (error) {
      console.error("Failed to parse user data from local storage:", error);
    }
  }, []); // Run once on component mount

  // Function to fetch the count of authorized users
  const fetchUserCount = useCallback(async () => {
    try {
      const response = await fetch('https://testapidevops.creditbank.co.ke:3011/creditbank/api/user/list');
      const data = await response.json();
      if (response.ok) {
        setUserCount(data.count);
      } else {
        console.error('Failed to fetch user count:', data.message);
        setUserCount(null);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
      setUserCount(null);
    }
  }, []);

  // Fetch user count on component mount
  useEffect(() => {
    fetchUserCount();
  }, [fetchUserCount]);

  // Define the services available in the portal
  const services: ServiceItem[] = [
    {
      name: 'IMSI Checker Portal',
      route: '/sim/swap/checker/portal',
      roles: ['operations', 'Admin'], // Only users with 'simswap' or 'admin' role can access this
      status: 'Up',
      lastChecked: '8/5/2025, 12:53:03 PM',
      iconSvg: (
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="#079567" stroke-linecap="round" stroke-linejoin="round" d="M10.223 32.383H6.541a1.025 1.025 0 0 1-1.027-1.027V7.735c0-.57.458-1.027 1.027-1.027h34.918c.57 0 1.027.458 1.027 1.027v23.621c0 .57-.458 1.027-1.027 1.027H26.256" stroke-width="1"/><circle cx="18.394" cy="20.831" r="6.162" fill="none" stroke="#079567" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path fill="none" stroke="#079567" stroke-linecap="round" stroke-linejoin="round" d="M8.064 41.292h20.415c.996-17.147-21.246-17.879-20.415 0m9.559-34.584v8.007m12.083-8.007v25.675m12.78-12.838H24.428m-18.914 0H12.3m17.475 6.309h12.711" stroke-width="1"/></svg>
      ),
    },
    {
      name: 'Smart Alias Portal',
      route: '/alias/home/portal', // Example route for K2B
      roles: ['Digital', 'Admin'],
      status: 'Up',
      lastChecked: '8/5/2025, 12:53:03 PM',
            iconSvg: (
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#079567" fill-rule="evenodd" d="M9.075 6.953a.5.5 0 1 1-.707.707a1.5 1.5 0 0 0-2.122 0L4.125 9.782a1.5 1.5 0 1 0 2.121 2.121l1.145-1.144a.5.5 0 0 1 .707.707L6.953 12.61a2.5 2.5 0 1 1-3.535-3.535l2.121-2.122a2.5 2.5 0 0 1 3.536 0m3.535-3.535a2.5 2.5 0 0 1 0 3.535l-2.12 2.122a2.5 2.5 0 0 1-3.536 0a.5.5 0 1 1 .707-.708a1.5 1.5 0 0 0 2.122 0l2.121-2.12a1.5 1.5 0 1 0-2.121-2.122L8.637 5.269a.5.5 0 1 1-.707-.707l1.145-1.144a2.5 2.5 0 0 1 3.535 0"/></svg>
      )
    },
    {
      name: 'Forex Reports Portal',
      route: '/home/forex/reports/portal', // Example route for PesaLink
      roles: ['TBO', 'Admin'],
      status: 'Up',
      lastChecked: '8/5/2025, 12:53:03 PM',
            iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="#079567" stroke-linecap="round" stroke-linejoin="round" d="m22.064 32.79l-6.012-14.8l-6.012 14.8z" stroke-width="1"/><g fill="none" stroke="#079567" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="m33.884 32.79l-6.012-14.8l-6.012 14.8z"/><path d="m11.07 39.397l-4.537-6.58l11.35-27.701l5.997 14.799l5.997-14.8l11.35 27.702l-4.536 6.58z"/></g><path fill="none" stroke="#079567" stroke-linecap="round" stroke-linejoin="round" d="M45.5 24c0 11.874-9.626 21.5-21.5 21.5S2.5 35.874 2.5 24S12.126 2.5 24 2.5S45.5 12.126 45.5 24m-10.119-5.448h9.414m-4.402 12.233h3.985M36.217 20.59h9.01m-8.174 2.04h8.403m-7.568 2.038h7.58m-6.744 2.039h6.583m-5.747 2.039h5.386" stroke-width="1"/></svg>
      )
    },
    {
      name: 'ICT Monitoring Portal',
      route: '/home/ict', // Example route for ICT Tools
      roles: ['ICT', 'Admin'],
      status: 'Up',
      lastChecked: '8/5/2025, 12:53:03 PM',
            iconSvg: (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#079567" d="M1.77 19.462v-1h20.46v1zm1.23-2v-13h18v13zm1-1h16v-11H4zm0 0v-11z"/></svg>
      )
    },
    {
      name: 'Admin Panel', // New service for admin-only access
      route: '/admin/panel/portal/',
      roles: ['Admin'],
      status: 'Up',
      lastChecked: '8/5/2025, 12:53:03 PM',
            iconSvg: (
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="#079567" d="M14.68 14.81a6.76 6.76 0 1 1 6.76-6.75a6.77 6.77 0 0 1-6.76 6.75m0-11.51a4.76 4.76 0 1 0 4.76 4.76a4.76 4.76 0 0 0-4.76-4.76" className="clr-i-outline clr-i-outline-path-1"/><path fill="#079567" d="M16.42 31.68A2.14 2.14 0 0 1 15.8 30H4v-5.78a14.8 14.8 0 0 1 11.09-4.68h.72a2.2 2.2 0 0 1 .62-1.85l.12-.11c-.47 0-1-.06-1.46-.06A16.47 16.47 0 0 0 2.2 23.26a1 1 0 0 0-.2.6V30a2 2 0 0 0 2 2h12.7Z" className="clr-i-outline clr-i-outline-path-2"/><path fill="#079567" d="M26.87 16.29a.4.4 0 0 1 .15 0a.4.4 0 0 0-.15 0" className="clr-i-outline clr-i-outline-path-3"/><path fill="#079567" d="m33.68 23.32l-2-.61a7.2 7.2 0 0 0-.58-1.41l1-1.86A.38.38 0 0 0 32 19l-1.45-1.45a.36.36 0 0 0-.44-.07l-1.84 1a7 7 0 0 0-1.43-.61l-.61-2a.36.36 0 0 0-.36-.24h-2.05a.36.36 0 0 0-.35.26l-.61 2a7 7 0 0 0-1.44.6l-1.82-1a.35.35 0 0 0-.43.07L17.69 19a.38.38 0 0 0-.06.44l1 1.82a6.8 6.8 0 0 0-.63 1.43l-2 .6a.36.36 0 0 0-.26.35v2.05A.35.35 0 0 0 16 26l2 .61a7 7 0 0 0 .6 1.41l-1 1.91a.36.36 0 0 0 .06.43l1.45 1.45a.38.38 0 0 0 .44.07l1.87-1a7 7 0 0 0 1.4.57l.6 2a.38.38 0 0 0 .35.26h2.05a.37.37 0 0 0 .35-.26l.61-2.05a7 7 0 0 0 1.38-.57l1.89 1a.36.36 0 0 0 .43-.07L32 30.4a.35.35 0 0 0 0-.4l-1-1.88a7 7 0 0 0 .58-1.39l2-.61a.36.36 0 0 0 .26-.35v-2.1a.36.36 0 0 0-.16-.35M24.85 28a3.34 3.34 0 1 1 3.33-3.33A3.34 3.34 0 0 1 24.85 28" className="clr-i-outline clr-i-outline-path-4"/><path fill="none" d="M0 0h36v36H0z"/></svg>
      ),
    },

    {
      name: 'T24 Reset', // New service for admin-only access
      route: '/reset/password/portal/layout',
      roles: ['User'],
      status: 'Up',
      lastChecked: '8/5/2025, 12:53:03 PM',
            iconSvg: (
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="#079567" d="M14.68 14.81a6.76 6.76 0 1 1 6.76-6.75a6.77 6.77 0 0 1-6.76 6.75m0-11.51a4.76 4.76 0 1 0 4.76 4.76a4.76 4.76 0 0 0-4.76-4.76" className="clr-i-outline clr-i-outline-path-1"/><path fill="#079567" d="M16.42 31.68A2.14 2.14 0 0 1 15.8 30H4v-5.78a14.8 14.8 0 0 1 11.09-4.68h.72a2.2 2.2 0 0 1 .62-1.85l.12-.11c-.47 0-1-.06-1.46-.06A16.47 16.47 0 0 0 2.2 23.26a1 1 0 0 0-.2.6V30a2 2 0 0 0 2 2h12.7Z" className="clr-i-outline clr-i-outline-path-2"/><path fill="#079567" d="M26.87 16.29a.4.4 0 0 1 .15 0a.4.4 0 0 0-.15 0" className="clr-i-outline clr-i-outline-path-3"/><path fill="#079567" d="m33.68 23.32l-2-.61a7.2 7.2 0 0 0-.58-1.41l1-1.86A.38.38 0 0 0 32 19l-1.45-1.45a.36.36 0 0 0-.44-.07l-1.84 1a7 7 0 0 0-1.43-.61l-.61-2a.36.36 0 0 0-.36-.24h-2.05a.36.36 0 0 0-.35.26l-.61 2a7 7 0 0 0-1.44.6l-1.82-1a.35.35 0 0 0-.43.07L17.69 19a.38.38 0 0 0-.06.44l1 1.82a6.8 6.8 0 0 0-.63 1.43l-2 .6a.36.36 0 0 0-.26.35v2.05A.35.35 0 0 0 16 26l2 .61a7 7 0 0 0 .6 1.41l-1 1.91a.36.36 0 0 0 .06.43l1.45 1.45a.38.38 0 0 0 .44.07l1.87-1a7 7 0 0 0 1.4.57l.6 2a.38.38 0 0 0 .35.26h2.05a.37.37 0 0 0 .35-.26l.61-2.05a7 7 0 0 0 1.38-.57l1.89 1a.36.36 0 0 0 .43-.07L32 30.4a.35.35 0 0 0 0-.4l-1-1.88a7 7 0 0 0 .58-1.39l2-.61a.36.36 0 0 0 .26-.35v-2.1a.36.36 0 0 0-.16-.35M24.85 28a3.34 3.34 0 1 1 3.33-3.33A3.34 3.34 0 0 1 24.85 28" className="clr-i-outline clr-i-outline-path-4"/><path fill="none" d="M0 0h36v36H0z"/></svg>
      ),
    },
    // Add more services as needed
  ];

  // Component for a single service box
  const ServiceBox = ({ service, userRoles }: { service: ServiceItem; userRoles: string[]; }) => {
    // Check if the user has at least one of the required roles for this service
    const hasAccess = service.roles.some(role => userRoles.includes(role));

    const handleClick = () => {
      if (hasAccess) {
        navigate(service.route);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: `You do not have the required role(s) to access '${service.name}'.`,
          confirmButtonColor: '#EF4444',
          position: "top-end",
          draggable: true,
        });
      }
    };

    return (
      <div
        className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 flex flex-col justify-between items-center text-center
          ${hasAccess ? 'hover:shadow-xl cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'}`}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center mb-4">
          {service.iconSvg}
          <h3 className="text-xl font-semibold text-gray-800 mt-2">{service.name}</h3>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last Checked: {service.lastChecked}</p>
        </div>
        <div className="flex items-center mt-4">
          {service.status === 'Up' ? (
            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className={`font-bold ${service.status === 'Up' ? 'text-green-600' : 'text-red-600'}`}>
            {service.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white-500 to-stone-300 font-inter">
      {/* Sidebar Component */}
      <Sidebar userCount={userCount} fetchUserCount={fetchUserCount} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Available Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {services.length > 0 ? ( // Iterate over all services, not just filtered ones
            services.map((service) => (
              <ServiceBox key={service.name} service={service} userRoles={userRoles} />
            ))
          ) : (
            <p className="text-gray-600 text-lg col-span-full text-center">No services defined.</p>
          )}
        </div>

        {/* Nested Routes for specific service pages */}
        <div className="w-full max-w-6xl mt-8">
          <Routes>
            {/* Default route for /home, if no specific sub-route is matched */}
            <Route path="/" element={<div className="hidden"></div>} /> {/* Render nothing directly on /home */}
            <Route path="sim-checker" element={<SimSwapCheckerPage />} />
            <Route path="/sim/swap/checker/add/user" element={<AddUser />} />
            {/* Add routes for other services here */}
            <Route path="k2b" element={<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"><h2 className="text-2xl font-bold">K2B Service Page</h2><p>Content for K2B service.</p></div>} />
            <Route path="pesalink" element={<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"><h2 className="text-2xl font-bold">PesaLink Service Page</h2><p>Content for PesaLink service.</p></div>} />
            <Route path="ict" element={<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"><h2 className="text-2xl font-bold">ICT Tools Page</h2><p>Content for ICT Tools.</p></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default Home;
