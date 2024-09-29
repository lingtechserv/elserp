import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControlLabel, Switch, Select, MenuItem, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RowConfiguration = ({ row, updateRowConfig }) => {
  const [fields, setFields] = useState(row.fields);

  const addField = () => {
    setFields([...fields, { type: 'field', name: '', required: false, limit: 120, slots: 2 }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = fields.map((field, i) => i === index ? { ...field, [key]: value } : field);
    setFields(updatedFields);
    updateRowConfig(row.id, updatedFields);
  };

  const handleDeleteField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    updateRowConfig(row.id, updatedFields);
  };

  const availableSlots = (currentIndex) => {
    const usedSlots = fields.reduce((acc, field, i) => i < currentIndex ? acc + field.slots : acc, 0);
    return 12 - usedSlots;
  };

  useEffect(() => {
    updateRowConfig(row.id, fields);
  }, [fields]);

  return (
    <Box sx={{ mb: 2, position: 'relative', border: '1px solid #ccc', p: 2, borderRadius: 1, minWidth: '60vw' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, width: '55vw' }}>
        <Button onClick={addField}>Add Field</Button>
      </Box>
      {fields.map((field, index) => (
        <Box key={index} sx={{ mb: 2, minWidth: '40vw' }}>
          <FormControlLabel
            control={<Switch checked={field.type === 'spacer'} onChange={(e) => handleFieldChange(index, 'type', e.target.checked ? 'spacer' : 'field')} />}
            label="Spacer"
          />
          <TextField
            label="Field Name"
            value={field.name}
            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
            sx={{ mr: 2, width: '35vw' }}
            disabled={field.type === 'spacer'}
          />
          <FormControlLabel
            control={<Switch checked={field.required} onChange={(e) => handleFieldChange(index, 'required', e.target.checked)} />}
            label="Required"
            sx={{ mr: 2 }}
            disabled={field.type === 'spacer'}
          />
          <TextField
            label="Limit"
            type="number"
            value={field.limit}
            onChange={(e) => handleFieldChange(index, 'limit', parseInt(e.target.value, 10))}
            sx={{ mr: 2, width: '80px' }}
            inputProps={{ min: 1, max: 120 }}
            disabled={field.type === 'spacer'}
          />
          <TextField
            select
            label="Span"
            value={field.slots}
            onChange={(e) => handleFieldChange(index, 'slots', parseInt(e.target.value, 10))}
            sx={{ width: '100px', mr: 2 }}
          >
            {Array.from({ length: availableSlots(index) - 1 }).map((_, i) => (
              <MenuItem key={i} value={i + 2}>{i + 2}</MenuItem>
            ))}
          </TextField>
          <IconButton onClick={() => handleDeleteField(index)} size="small" color="secondary">
            <DeleteIcon />
          </IconButton>
          {index > 0 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default RowConfiguration;
