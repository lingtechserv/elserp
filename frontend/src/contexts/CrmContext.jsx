import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CrmContext = createContext();

export const useCrm = () => useContext(CrmContext); 

export const CrmProvider = ({ children }) => {
  const [customersData, setCustomersData] = useState(() => {
    const localData = localStorage.getItem('customersData');
    return localData ? JSON.parse(localData) : []; // Initial state
  });

  // Function to filter customers for autocomplete
  const getFilteredCustomers = (inputValue) => {
    return customersData.filter((customer) =>
      customer.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // fetchCustomersData function
  const fetchCustomersData = async () => {
    try {
      const response = await axios.get('/api/customers/all', { withCredentials: true });
      setCustomersData(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Consider error handling and/or setting error state
    }
  };

  // useEffect hooks
  useEffect(() => {
    localStorage.setItem('customersData', JSON.stringify(customersData));
  }, [customersData]);

  useEffect(() => {
    if (!Array.isArray(customersData) || !customersData.length) {
      fetchCustomersData();
    }
  }, []); 

  return (
    <CrmContext.Provider value={{ 
      customersData, 
      fetchCustomersData, 
      getFilteredCustomers
    }}>
      {children}
    </CrmContext.Provider>
  );
};
