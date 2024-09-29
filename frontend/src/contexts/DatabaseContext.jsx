import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { openDB } from 'idb'; // Import idb for IndexedDB access

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  // State to hold data from both dbIndex and allData
  const [dbIndex, setDbIndex] = useState(null);
  const [dbAllData, setDbAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize IndexedDB if it hasn't been initialized
  const initializeIndexedDB = async () => {
    return await openDB('my-database', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('data-store')) {
          db.createObjectStore('data-store'); // Create an object store
        }
      },
    });
  };

  // Function to store dbData in IndexedDB
  const storeDbDataInIndexedDB = async (key, data) => {
    try {
      const db = await initializeIndexedDB();
      await db.put('data-store', data, key); // Store data in the object store
      console.log(`Stored ${key} data in IndexedDB`);
    } catch (error) {
      console.error(`Error storing ${key} in IndexedDB:`, error);
    }
  };

  // Function to retrieve data from IndexedDB
  const getDbDataFromIndexedDB = async (key) => {
    try {
      const db = await initializeIndexedDB();
      const data = await db.get('data-store', key); // Retrieve data from the object store
      return data;
    } catch (error) {
      console.error(`Error fetching ${key} from IndexedDB:`, error);
      return null;
    }
  };

  // Function to fetch the database index (tables) and store in 'dbIndex'
  const fetchDatabaseIndex = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/db-index'); // API to fetch tables
      const data = response.data;

      // Save dbIndex data to state and IndexedDB
      setDbIndex(data);
      await storeDbDataInIndexedDB('dbIndex', data); // Store dbIndex in IndexedDB
      console.log('Fetched and stored dbIndex:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dbIndex:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch ALL data from all tables and store in 'dbAllData'
  const fetchAllData = async (excludedTables = ['users', 'roles'], limit = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/all-data'); // API endpoint for all table data
      const rawData = response.data;

      // Filter out excluded tables
      const filteredData = Object.keys(rawData)
        .filter((tableName) => !excludedTables.includes(tableName))
        .reduce((acc, tableName) => {
          // Optionally limit the number of rows per table
          acc[tableName] = limit ? rawData[tableName].slice(0, limit) : rawData[tableName];
          return acc;
        }, {});

      // Save the fetched data in state and IndexedDB
      setDbAllData(filteredData);
      await storeDbDataInIndexedDB('dbAllData', filteredData); // Store allData in IndexedDB
      console.log('Fetched and stored allData:', filteredData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching all data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{ dbIndex, dbAllData, loading, error, fetchDatabaseIndex, fetchAllData, getDbDataFromIndexedDB }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the context
export const useDatabase = () => useContext(DatabaseContext);
