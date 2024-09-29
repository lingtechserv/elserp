import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    
    const [inventoryData, setInventoryData] = useState(() => {
        const localData = localStorage.getItem('inventoryData');
        return localData ? JSON.parse(localData) : [];
    });

    const [recipeInventory, setRecipeInventory] = useState([]);
    const [productInventory, setProductInventory] = useState([]);

    useEffect(() => {
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    }, [inventoryData]);

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get('/api/inventory/all', { withCredentials: true });
            setInventoryData(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    useEffect(() => {
        if (!Array.isArray(inventoryData) || !inventoryData.length) {
            fetchInventoryData();
        }
    }, [inventoryData]);

    const filterInventory = () => {
        if (!Array.isArray(inventoryData)) return;

        const filteredRecipe = inventoryData.filter(item => 
            (item.basics.type === "Flavour Concentrate" && item.basics.category === "Concentrate") ||
            (item.basics.type === "Raw Material") ||
            (item.basics.type === "Bulk eLiquid")
        );
        setRecipeInventory(filteredRecipe);

        const filteredProduct = inventoryData.filter(item => 
            (item.basics.type === "Product")
        );
        setProductInventory(filteredProduct);
    };

    useEffect(() => {
        filterInventory();
    }, [inventoryData]);

    const [filteredProductInventory, setFilteredProductInventory] = useState([]);

  useEffect(() => {
    setFilteredProductInventory(
      inventoryData.filter(item => item.basics.type === "Product")
    );
  }, [inventoryData]);

    return (
        <InventoryContext.Provider value={{ inventoryData, fetchInventoryData, recipeInventory, productInventory, filterInventory, filteredProductInventory }}>
            {children}
        </InventoryContext.Provider>
    );
};