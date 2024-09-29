import React, { createContext, useContext, useState } from 'react';

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,  // Token stored in memory
    user: null,
  });

  // Update auth data (like token after login)
  const updateAuthData = (data) => {
    console.log("Updating auth data with:", data);  // Debugging line
    setAuthData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  console.log("Auth data after update:", authData);  // Debugging line to check latest state

  return (
    <AuthContext.Provider value={{ authData, updateAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
