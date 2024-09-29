
import axios from 'axios';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authData, updateAuthData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get('/api/user/roles-permissions');
        updateAuthData({ ...authData, user: response.data });
      } catch (error) {
        updateAuthData({ ...authData, user: null });
      }
    };

    verifyUser();
  }, []);

  if (authData.user === undefined) {
    return <div>Loading...</div>;
  }

  return authData.user ? children : <Navigate to="/" state={{ from: location }} />;
};

export default ProtectedRoute;
