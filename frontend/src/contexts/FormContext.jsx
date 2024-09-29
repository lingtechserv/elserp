import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [fields, setFields] = useState(() => {
    const savedFields = localStorage.getItem('fields');
    return savedFields ? JSON.parse(savedFields) : [];
  });
  const [forms, setForms] = useState(() => {
    const savedForms = localStorage.getItem('forms');
    return savedForms ? JSON.parse(savedForms) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all fields
  const fetchFields = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/fields', { withCredentials: true });
      setFields(response.data);
      localStorage.setItem('fields', JSON.stringify(response.data));
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.error('Fetch fields failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new field
  const createField = async (fieldConfig) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/fields', fieldConfig, { withCredentials: true });
      const updatedFields = [...fields, response.data];
      setFields(updatedFields);
      localStorage.setItem('fields', JSON.stringify(updatedFields));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all forms
  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/forms', { withCredentials: true });
      setForms(response.data);
      localStorage.setItem('forms', JSON.stringify(response.data));
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.error('Fetch forms failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new form
  const createForm = async (formConfig) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/forms', formConfig, { withCredentials: true });
      const updatedForms = [...forms, response.data];
      setForms(updatedForms);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing form
  const updateForm = async (id, formConfig) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/forms/${id}`, formConfig, { withCredentials: true });
      const updatedForms = forms.map(form => (form.id === id ? response.data : form));
      setForms(updatedForms);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a form
  const deleteForm = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/api/forms/${id}`, { withCredentials: true });
      const updatedForms = forms.filter(form => form.id !== id);
      setForms(updatedForms);
      localStorage.setItem('forms', JSON.stringify(updatedForms));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fields.length === 0) {
      fetchFields();
    }
    if (forms.length === 0) {
      fetchForms(); // Fetch forms on mount if not already in local storage
    }
  }, []); // Fetch fields and forms on mount

  return (
    <FormContext.Provider value={{ fields, forms, loading, error, fetchFields, createField, fetchForms, createForm, updateForm, deleteForm }}>
      {children}
    </FormContext.Provider>
  );
};