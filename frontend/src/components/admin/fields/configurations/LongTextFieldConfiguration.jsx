import React, { useState, useEffect } from 'react';
import { TextField, Switch, FormControlLabel, Box, Typography, Button } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useForm } from '../../../../contexts/FormContext';

const TextFieldConfiguration = ({ setFieldConfig, setPreviewConfig }) => {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState(2000);
  const [prohibitedChars, setProhibitedChars] = useState('');
  const [required, setRequired] = useState(false);

  const { createField } = useForm(); // Get createField function from context

  const currentState = {
    name,
    limit,
    required,
    prohibitedCharacters: prohibitedChars,
  };

  useEffect(() => {
    setPreviewConfig(currentState);
  }, [name, limit, required, prohibitedChars, setFieldConfig]);

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setName(newValue);
    setFieldConfig((prev) => ({ ...prev, name: newValue }));
  };

  const handleLimitChange = (event) => {
    const newLimit = Number(event.target.value);
    const enforcedLimit = newLimit > 2000 ? 2000 : newLimit;
    setLimit(enforcedLimit);
  };

  const handleRequiredChange = (event) => {
    const newValue = event.target.checked;
    setRequired(newValue);
    setFieldConfig((prev) => ({ ...prev, required: newValue }));
  };

  const handleProhibitedCharsChange = (event) => {
    setProhibitedChars(event.target.value);
  };

  const handleSaveConfig = () => {
    const config = {
      name,
      limit,
      required,
      prohibitedCharacters: prohibitedChars,
    };
    setPreviewConfig(config);
    createField({ name, type: 'TextField', config }); // Save the configuration
    
    // Clear the component state
    setName('');
    setLimit(2000);
    setProhibitedChars('');
    setRequired(false);
  };

  return (
    <Box sx={{ position: 'relative', paddingBottom: '60px', minHeight: '89.5%', width: '60vw' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'lightyellow', py: 1, px: 2, borderRadius: 1, mb: 1 }}>
        <LightbulbIcon sx={{ color: 'orange', mr: 1, fontSize: 'default' }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          Tip
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 1, marginLeft: '15px' }}>
          A "Long Text Field" is used for longer text fields, like a paragraph. This field is limited between 1-2000 characters.  You can use the Prohibited Characters field to identify any characters that will not be allowed in the input box.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <TextField
          label="Name"
          required
          onChange={handleNameChange}
          inputProps={{ maxLength: limit }}
          sx={{ mr: 2, flex: 3 }}
          value={name}
        />
        <TextField
          label="Limit"
          type="number"
          value={limit}
          onChange={handleLimitChange}
          inputProps={{ max: 2000 }}
          sx={{ mr: 2, width: '100px' }}
        />
        <FormControlLabel
          control={<Switch checked={required} onChange={handleRequiredChange} />}
          label="Required"
          sx={{ flex: 1 }}
        />
      </Box>
      <TextField
        label="Prohibited Characters"
        multiline
        rows={4}
        value={prohibitedChars}
        onChange={handleProhibitedCharsChange}
        placeholder="List characters to be prohibited, e.g., @#$%^&*()"
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />
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
