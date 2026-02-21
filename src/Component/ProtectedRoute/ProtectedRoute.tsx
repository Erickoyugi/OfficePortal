import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('tokenExpiry');

  useEffect(() => {
    const checkExpiry = () => {
      if (expiry) {
        const now = new Date().getTime();
        if (now > parseInt(expiry)) {
          // TOKEN EXPIRED
          localStorage.clear(); // Wipe everything
          navigate('/', { replace: true });
        }
      }
    };

    // Check once when component mounts
    checkExpiry();

    // Optional: Set an interval to check every minute while they are on the page
    const interval = setInterval(checkExpiry, 10000); 
    return () => clearInterval(interval);
  }, [expiry, navigate]);

  // Initial check for the render
  const isExpired = expiry ? new Date().getTime() > parseInt(expiry) : true;

  if (!token || isExpired) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;