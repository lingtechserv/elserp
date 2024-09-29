import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [ordersData, setOrdersData] = useState(() => {
    const localData = localStorage.getItem('ordersData');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('ordersData', JSON.stringify(ordersData));
  }, [ordersData]);

  const fetchOrdersData = async () => {
    try {
      const response = await axios.get('/api/orders', { withCredentials: true });
      setOrdersData(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    console.log('Orders:', ordersData)
  }, [ordersData]);

  useEffect(() => {
    if (!ordersData.length) {
      fetchOrdersData();
    }
  }, []);

  const addOrder = async (orderData, onSuccess) => {
    try {
      const response = await axios.post('/api/orders', orderData, { withCredentials: true });
      const newOrder = response.data.order;

      // Only add the new order if it's not "On Hold"
      if (newOrder.status !== 'On Hold') { 
        setOrdersData(prevOrders => [...prevOrders, newOrder]);
      }
      onSuccess && onSuccess(newOrder); 

      // Fetch updated orders after successful add
      fetchOrdersData(); //  This is the key change

    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <OrdersContext.Provider value={{ ordersData, fetchOrdersData, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};