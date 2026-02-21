import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import { ListUser } from './Pages/ListUser';
import SimSwapCheckerPage from './Pages/SimswapChecker';
import AddUser from './Pages/Simswap/AddUser';
import { useState, useEffect, useCallback } from 'react';
import TotalRequests from './Pages/Simswap/TotalRequest';
import { SmartAliasHome } from './Pages/AliasPortal/Home';
import { AliasList } from './Pages/AliasPortal/AliasList';
import { AddAlias } from './Pages/AliasPortal/AddAlias';

import { AdminPanelHome } from './Pages/AdminPanel/Home';
import { ActivityLogs } from './Pages/AdminPanel/ActivityLogs';

import ICTApp from './Pages/ICTPortal/Home';
import PasswordResetPage from './Pages/PasswordReset/Home';
import ResetLayout from './Pages/PasswordReset/Index';
import PasswordAttempt from './Pages/PasswordAttempt/PasswordAttempt';
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';
import ForexReports from './Pages/ForexReports/Home';





function App() {
    const [userCount, setUserCount] = useState<number | null>(null);
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
  return (
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
        <Route path='/home' element={<Home/>}/>
         <Route path="/sim/swap/users/list" element={<ProtectedRoute><ListUser /></ProtectedRoute>} />
            <Route path="/sim/swap/checker/portal" element={<ProtectedRoute><SimSwapCheckerPage /></ProtectedRoute>} />
              <Route path="/sim/swap/checker/add/user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                <Route path="/users/list/requests" element={<TotalRequests />} />

                <Route path="/alias/home/portal" element={<SmartAliasHome />} />

                <Route path="/smart/alias/list/users" element={<AliasList />} />
                 <Route path="/smart/alias/add/users" element={<AddAlias />} />
                 <Route path="/admin/panel/portal/" element={<AdminPanelHome />} />
                   <Route path="/admin/panel/portal/activity/logs" element={<ActivityLogs />} />
                   <Route path="/home/ict" element={<ICTApp />} />
                   <Route path="/reset/password/portal/" element={<ProtectedRoute><PasswordResetPage/></ProtectedRoute>} />
                   <Route path="/reset/password/portal/attempt" element={<ProtectedRoute><PasswordAttempt/></ProtectedRoute>} />
                   <Route path="/reset/password/portal/layout" element={<ProtectedRoute><ResetLayout/></ProtectedRoute>} />
                   <Route path="/home/forex/reports/portal" element={<ForexReports/>}/>
                
       
        
    </Routes>

 </Router>
  );
}

export default App;
