import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import FormBuilder from '../admin/formbulder/FormBuilder'; // Adjust the import path as needed

const SalesAdmin = () => {
  const [formNames, setFormNames] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [salesSettingId, setSalesSettingId] = useState(null);
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);

  useEffect(() => {
    // Fetch form names from local storage
    const forms = JSON.parse(localStorage.getItem('forms')) || [];
    const names = forms.map(form => ({ id: form.id, name: form.name }));
    setFormNames(names);

    // Fetch settings from local storage
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || [];
    const salesSetting = settings.find(setting => setting.module === 'Sales');
    if (salesSetting) {
      setSelectedForm(salesSetting.settings.selectedForm);
      setSalesSettingId(salesSetting.id);
    }
  }, []);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  const handleSaveSettings = async () => {
    const salesSettings = {
      module: 'Sales',
      settings: JSON.stringify({
        selectedForm
      }) // Stringify the settings object here
    };

    try {
      if (salesSettingId) {
        // Update existing setting
        const response = await axios.put(`/api/settings/${salesSettingId}`, salesSettings, { withCredentials: true });
        updateLocalStorageSettings(response.data);
      } else {
        // Create new setting
        const response = await axios.post('/api/settings', salesSettings, { withCredentials: true });
        updateLocalStorageSettings(response.data);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateLocalStorageSettings = (updatedSetting) => {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || [];
    const settingIndex = settings.findIndex(setting => setting.id === updatedSetting.id);

    if (settingIndex > -1) {
      settings[settingIndex] = updatedSetting;
    } else {
      settings.push(updatedSetting);
    }

    localStorage.setItem('adminSettings', JSON.stringify(settings));
  };

  const handleOpenFormBuilder = () => {
    setIsFormBuilderOpen(true);
  };

  const handleCloseFormBuilder = () => {
    setIsFormBuilderOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Sales Admin Settings</Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>Customer Information Form</Typography>
      <FormControl fullWidth>
        <InputLabel id="customer-form-label">Customer Form</InputLabel>
        <Select
          labelId="customer-form-label"
          id="customer-form-select"
          value={selectedForm}
          onChange={handleFormChange}
          label="Customer Form"
        >
          {formNames.map((form) => (
            <MenuItem key={form.id} value={form.id}>
              {form.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSaveSettings}
      >
        Save Settings
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, ml: 2 }}
        onClick={handleOpenFormBuilder}
      >
        Add New Form
      </Button>
      <Modal
        open={isFormBuilderOpen}
        onClose={handleCloseFormBuilder}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          p: 0,
          overflow: 'auto',
        }}>
          <IconButton
            onClick={handleCloseFormBuilder}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>
          <FormBuilder />
        </Box>
      </Modal>
    </Box>
  );
};

export default SalesAdmin;
