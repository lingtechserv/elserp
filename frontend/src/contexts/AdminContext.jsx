import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    return savedSettings ? JSON.parse(savedSettings) : [];
  });
  const [completedForms, setCompletedForms] = useState(() => {
    const savedForms = localStorage.getItem('completedForms');
    return savedForms ? JSON.parse(savedForms) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/settings', { withCredentials: true });
      setSettings(response.data);
      localStorage.setItem('adminSettings', JSON.stringify(response.data));
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.error('Fetch settings failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSetting = async (settingConfig) => {
    setLoading(true);
    try {
      const payload = {
        ...settingConfig,
        settings: JSON.stringify(settingConfig.settings) // Ensure this is a JSON string
      };
      
      const response = await axios.post('/api/settings', payload, { withCredentials: true });
      const updatedSettings = [...settings, response.data];
      setSettings(updatedSettings);
      localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateSetting = async (id, settingConfig) => {
    setLoading(true);
    try {
      const payload = {
        ...settingConfig,
        settings: JSON.stringify(settingConfig.settings) // Ensure this is a JSON string
      };
  
      const response = await axios.put(`/api/settings/${id}`, payload, { withCredentials: true });
      const updatedSettings = settings.map(setting => (setting.id === id ? response.data : setting));
      setSettings(updatedSettings);
      localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchCompletedForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/completed-forms', { withCredentials: true });
      setCompletedForms(response.data);
      localStorage.setItem('completedForms', JSON.stringify(response.data));
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.error('Fetch completed forms failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCompletedForm = async (formConfig) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/completed-forms', formConfig, { withCredentials: true });
      const updatedForms = [...completedForms, response.data];
      setCompletedForms(updatedForms);
      localStorage.setItem('completedForms', JSON.stringify(updatedForms));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCompletedForm = async (id, formConfig) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/completed-forms/${id}`, formConfig, { withCredentials: true });
      const updatedForms = completedForms.map(form => (form.id === id ? response.data : form));
      setCompletedForms(updatedForms);
      localStorage.setItem('completedForms', JSON.stringify(updatedForms));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCompletedForms();
  }, []); // Fetch settings and completed forms on mount

  return (
    <AdminContext.Provider value={{ 
      settings, 
      completedForms, 
      loading, 
      error, 
      fetchSettings, 
      createSetting, 
      updateSetting, 
      fetchCompletedForms, 
      createCompletedForm, 
      updateCompletedForm 
    }}>
      {children}
    </AdminContext.Provider>
  );
};
