import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, TextField } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RowConfiguration from './RowConfiguration';
import { useForm } from '../../../../contexts/FormContext';

const TextFieldConfiguration = ({ setFieldConfig, setPreviewConfig }) => {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const { createField } = useForm(); // Get createField function from context

  const addRow = () => {
    setRows((prevRows) => [...prevRows, { id: prevRows.length, fields: [] }]);
  };

  const updateRowConfig = (id, fields) => {
    setRows((prevRows) => prevRows.map(row => row.id === id ? { ...row, fields } : row));
  };

  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter(row => row.id !== id));
  };

  const handleSaveConfig = () => {
    if (!name.trim()) {
      alert("Field Name is required.");
      return;
    }
    
    const config = { name, rows };
    setPreviewConfig(config);
    createField({ name: name, type: 'TextFieldConfiguration', config }); // Save the configuration
    
    // Clear the component state
    setRows([]);
    setName('');
  };

  useEffect(() => {
    setPreviewConfig({ name, rows });
    setFieldConfig({ name, rows });
  }, [name, rows]);

  return (
    <Box sx={{ position: 'relative', paddingBottom: '60px', minHeight: '89.5%', width: '60vw' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Field Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'lightyellow', py: 1, px: 2, borderRadius: 1, mb: 1 }}>
        <LightbulbIcon sx={{ color: 'orange', mr: 1, fontSize: 'default' }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          Tip
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 1, marginLeft: '15px' }}>
          The Text Field builder will allow you to build one or more text inputs for a group.  For example, a Single Text field would be used to capture an email address while a Text Field Group would be used to capture a first and last name.  A text group can have up to four rows.  Each row has up to four individual fields.  You can use the Span selector to determine the width of each field.  You may also use the Spacer switch to create an empty space at the determined span.  Each field can be individually marked as "Required".  The "Limit" number determines the maximum number of characters (including spaces) a field can hold, to a maximum of 120.
        </Typography>
      </Box>
      <Button onClick={addRow} startIcon={<AddCircleIcon />} sx={{ mb: 2 }}>
        Add Row
      </Button>
      {rows.map((row, index) => (
        <Box key={index} sx={{ mb: 2, position: 'relative' }}>
          <RowConfiguration row={row} updateRowConfig={updateRowConfig} deleteRow={deleteRow} />
          <IconButton
            onClick={() => deleteRow(row.id)}
            sx={{ position: 'absolute', top: 0, right: 0 }}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveConfig}
        sx={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
        }}
      >
        Save Configuration
      </Button>
    </Box>
  );
};

export default TextFieldConfiguration;
