import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const SchemaContext = createContext();

export const useSchema = () => useContext(SchemaContext);

export const SchemaProvider = ({ children }) => {
  const [schemaData, setSchemaData] = useState(() => {
    const localData = localStorage.getItem('schemaData');
    return localData ? JSON.parse(localData) : {};
  });

  const [tableData, setTableData] = useState(null); // State for dynamic table data
  const [tableDataLoading, setTableDataLoading] = useState(false); // State for loading table data
  const [tableDataError, setTableDataError] = useState(null); // State for error handling

  // Save schemaData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('schemaData', JSON.stringify(schemaData));
  }, [schemaData]);

  // Fetch schema data (list of tables and columns)
  const fetchSchemaData = async () => {
    try {
      const response = await axios.get('/api/schema/tables');
      setSchemaData(response.data);
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  };

  // Fetch data from a specific table with optional filters and sorting
  const fetchTableData = async (tableName, filters = {}, sortBy = '', sortOrder = 'asc') => {
    setTableDataLoading(true);
    setTableDataError(null);
    try {
      const response = await axios.get(`/api/data/${tableName}`, {
        params: {
          filters,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableDataError('Error fetching table data.');
    } finally {
      setTableDataLoading(false);
    }
  };

  // Function to build tables and update schema
  const buildTables = async (config) => {
    try {
      const response = await axios.post('/api/build-tables', config);
      if (response.status === 200) {
        console.log('Tables built successfully:', response.data);
        fetchSchemaData(); // Update the schema list after successful build
      }
    } catch (error) {
      console.error('Error building tables:', error);
    }
  };

  // Initial load: fetch schema data if not available
  useEffect(() => {
    if (Object.keys(schemaData).length === 0) {
      fetchSchemaData();
    }
  }, []);

  return (
    <SchemaContext.Provider value={{ 
      schemaData, 
      fetchSchemaData, 
      tableData, 
      fetchTableData,
      tableDataLoading,
      tableDataError,
      buildTables // Provide buildTables function to the context
    }}>
      {children}
    </SchemaContext.Provider>
  );
};
