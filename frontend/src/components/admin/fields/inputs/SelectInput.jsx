import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, Typography } from '@mui/material';
import { openDB } from 'idb'; // Import idb for IndexedDB access

const SelectInput = ({ config }) => {
  const {
    name,
    label,
    required,
    options = [],
    defaultValue,
    type,
    flex,
    selectedTable,    // Field from config for database table
    selectedColumn,   // Field from config for database column
  } = config;

  const [selectedValue, setSelectedValue] = useState(() => {
    return type === 'multi' ? defaultValue || [] : defaultValue || '';
  });

  const [databaseOptions, setDatabaseOptions] = useState([]);

  // Function to fetch dbData from IndexedDB
  const getDbDataFromIndexedDB = async () => {
    try {
      const db = await openDB('my-database', 1); // Open IndexedDB
      const data = await db.get('data-store', 'dbData'); // Retrieve dbData from the store
      return data;
    } catch (error) {
      console.error('Error fetching dbData from IndexedDB:', error);
      return null;
    }
  };

  useEffect(() => {
    // Load options from IndexedDB when config has selectedTable and selectedColumn
    const fetchDbData = async () => {
      if (selectedTable && selectedColumn) {
        const dbData = await getDbDataFromIndexedDB();

        if (dbData) {
          const tableData = dbData[selectedTable];

          if (tableData && Array.isArray(tableData)) {
            // Extract options based on the column (e.g., 'name' from 'Suppliers')
            const extractedOptions = tableData.map(row => row[selectedColumn]);
            setDatabaseOptions(extractedOptions.filter(Boolean)); // Remove any null or undefined values
          }
        }
      }
    };

    fetchDbData();
  }, [selectedTable, selectedColumn]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedValue(
      type === 'multi' ? (typeof value === 'string' ? value.split(',') : value) : value
    );
  };

  useEffect(() => {
    if (type === 'multi') {
      setSelectedValue(defaultValue || []);
    } else {
      setSelectedValue(defaultValue || '');
    }
  }, [defaultValue, type]);

  // Determine whether to use custom options or database-driven options
  const displayOptions = selectedTable && selectedColumn ? databaseOptions : options;

  return (
    <Box sx={{ display: flex === 'horizontal' ? 'flex' : 'block', alignItems: 'center', gap: 2 }}>
      <Typography variant="subtitle1">{name}</Typography>
      <FormControl fullWidth required={required}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selectedValue}
          onChange={handleChange}
          label={label}
          multiple={type === 'multi'}
          renderValue={(selected) => (type === 'multi' ? selected.join(', ') : selected)}
        >
          {displayOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {type === 'multi' && <Checkbox checked={selectedValue.indexOf(option) > -1} />}
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectInput;
