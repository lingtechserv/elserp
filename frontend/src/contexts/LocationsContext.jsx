import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const LocationsContext = createContext();

export const useLocations = () => useContext(LocationsContext);

export const LocationsProvider = ({ children }) => {
  const safeParseJSON = (data, defaultValue) => {
    try {
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [locations, setLocations] = useState(() => {
    const localData = localStorage.getItem('locationsData');
    return safeParseJSON(localData, []);
  });

  const [sections, setSections] = useState(() => {
    const localData = localStorage.getItem('sectionsData');
    return safeParseJSON(localData, []);
  });

  const [rows, setRows] = useState(() => {
    const localData = localStorage.getItem('rowsData');
    return safeParseJSON(localData, []);
  });

  const [shelves, setShelves] = useState(() => {
    const localData = localStorage.getItem('shelvesData');
    return safeParseJSON(localData, []);
  });

  const [bins, setBins] = useState(() => {
    const localData = localStorage.getItem('binsData');
    return safeParseJSON(localData, []);
  });

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/locations/all');
      const { data } = response;

      // Save fetched data to Local Storage
      localStorage.setItem('locationsData', JSON.stringify(data.locations || []));
      localStorage.setItem('sectionsData', JSON.stringify(data.sections || []));
      localStorage.setItem('rowsData', JSON.stringify(data.rows || []));
      localStorage.setItem('shelvesData', JSON.stringify(data.shelves || []));
      localStorage.setItem('binsData', JSON.stringify(data.bins || []));

      // Update state with fetched data
      setLocations(Array.isArray(data.locations) ? data.locations : []);
      setSections(Array.isArray(data.sections) ? data.sections : []);
      setRows(Array.isArray(data.rows) ? data.rows : []);
      setShelves(Array.isArray(data.shelves) ? data.shelves : []);
      setBins(Array.isArray(data.bins) ? data.bins : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Optionally, include error handling logic here
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <LocationsContext.Provider value={{ locations, sections, rows, shelves, bins, fetchLocations }}>
      {children}
    </LocationsContext.Provider>
  );
};