import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProductionContext = createContext();

export const useProduction = () => useContext(ProductionContext);

export const ProductionProvider = ({ children }) => {
    const [equipmentData, setEquipmentData] = useState(() => {
        const localData = localStorage.getItem('equipmentData');
        return localData ? JSON.parse(localData) : [];
    });

    const [productionUsers, setProductionUsers] = useState(() => {
        const localData = localStorage.getItem('productionUsers');
        return localData ? JSON.parse(localData) : [];
    });

    const [unassignedOrders, setUnassignedOrders] = useState([]);

    useEffect(() => {
        localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
    }, [equipmentData]);

    useEffect(() => {
        localStorage.setItem('productionUsers', JSON.stringify(productionUsers));
    }, [productionUsers]);

    const fetchEquipmentData = async () => {
        try {
            const response = await axios.get('/api/equipment', { withCredentials: true });
            setEquipmentData(response.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    const fetchProductionUsers = async () => {
        try {
            const response = await axios.get('/api/production/users', { withCredentials: true });
            setProductionUsers(response.data);
        } catch (error) {
            console.error('Error fetching production users:', error);
        }
    };

    const fetchUnassignedOrders = async () => {
        try {
            const response = await axios.get('/api/production/unassigned-orders', { withCredentials: true });
            setUnassignedOrders(response.data);
        } catch (error) {
            console.error('Error fetching unassigned orders:', error);
        }
    };

    const scheduleOrder = async ({ order_id, equipment_id, start_time, end_time }) => {
        try {
            const response = await axios.post('/api/production/schedule-order', {
                order_id,
                equipment_id,
                start_time,
                end_time,
            }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error scheduling order:', error);
        }
    };

    // Remove automatic fetching by useEffect to avoid looping API calls
    // useEffect(() => {
    //     if (!Array.isArray(equipmentData) || !equipmentData.length) {
    //         fetchEquipmentData();
    //     }
    // }, [equipmentData]);

    // useEffect(() => {
    //     if (!Array.isArray(productionUsers) || !productionUsers.length) {
    //         fetchProductionUsers();
    //     }
    // }, [productionUsers]);

    // useEffect(() => {
    //     fetchUnassignedOrders();
    // }, []);

    return (
        <ProductionContext.Provider value={{ 
            equipmentData, 
            fetchEquipmentData, 
            productionUsers, 
            fetchProductionUsers, 
            unassignedOrders, 
            fetchUnassignedOrders, 
            scheduleOrder 
        }}>
            {children}
        </ProductionContext.Provider>
    );
};