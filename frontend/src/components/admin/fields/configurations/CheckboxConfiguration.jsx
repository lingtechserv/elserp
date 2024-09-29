import React, { useEffect, useState } from 'react';
import { Box, Button, FormControlLabel, FormGroup, Grid, IconButton, Radio, RadioGroup, Switch, TextField, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { useForm } from '../../../../contexts/FormContext';

const CheckboxConfiguration = ({ setFieldConfig, setPreviewConfig }) => {
  const [name, setName] = useState('');
  const [required, setRequired] = useState(false);
  const [selectedType, setSelectedType] = useState('check');
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [defaultOption, setDefaultOption] = useState('');
  const [isSwitchSelected, setIsSwitchSelected] = useState(false);
  const [isDefaultChecked, setIsDefaultChecked] = useState(false);
  const [toggledName, setToggledName] = useState('');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [layout, setLayout] = useState('vertical');

  const { createField } = useForm(); // Get createField function from context

  const handleNameChange = (event) => {
    setName(event.target.value);
    setFieldConfig((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleRequiredChange = (event) => {
    setRequired(event.target.checked);
    setFieldConfig((prev) => ({ ...prev, required: event.target.checked }));
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
    }
  };

  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };

  const addOption = () => {
    if (newOption.trim() !== '') {
      setOptions((prevOptions) => [...prevOptions, newOption]);
      setNewOption('');
    }
  };

  const handleDefaultOptionChange = (event) => {
    setDefaultOption(event.target.value);
  };

  const removeOption = (optionToRemove) => {
    setOptions(options.filter(option => option !== optionToRemove));
    // If the removed option was the default, clear the default selection
    if (defaultOption === optionToRemove) {
      setDefaultOption('');
    }
  };

  const toggleSwitch = (event) => {
    setIsSwitchSelected(event.target.checked);
  };

  const toggleDefaultChecked = (event) => {
    setIsDefaultChecked(event.target.checked);
  };

  const handleToggledNameChange = (event) => {
    setToggledName(event.target.value);
  };

  const handleAllowMultipleChange = (event) => {
    setAllowMultiple(event.target.checked);
  };

  const handleLayoutChange = (event, newLayout) => {
    if (newLayout !== null) {
      setLayout(newLayout);
    }
  };

  const handleSaveConfig = () => {
    const config = { name, required, options, defaultOption, selectedType, isSwitchSelected, isDefaultChecked, toggledName, allowMultiple, layout };
    setPreviewConfig(config);
    createField({ name, type: 'Checkbox', config }); // Save the configuration
    
    // Clear the component state
    setName('');
    setRequired(false);
    setSelectedType('check');
    setOptions([]);
    setNewOption('');
    setDefaultOption('');
    setIsSwitchSelected(false);
    setIsDefaultChecked(false);
    setToggledName('');
    setAllowMultiple(false);
    setLayout('vertical');
  };

  useEffect(() => {
    setPreviewConfig({ name, required, options, defaultOption, selectedType, isSwitchSelected, isDefaultChecked, toggledName, allowMultiple, layout });
  }, [name, required, options, defaultOption, selectedType, isSwitchSelected, isDefaultChecked, toggledName, allowMultiple, layout]);

  return (
    <Box sx={{ position: 'relative', paddingBottom: '60px', minHeight: '89.5%', width: '60vw' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'lightyellow', py: 1, px: 2, borderRadius: 1, mb: 1 }}>
        <LightbulbIcon sx={{ color: 'orange', mr: 1, fontSize: 'default' }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          Tip
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 1, marginLeft: '15px' }}>
          A "Checkbox" is used to indicate a "Yes/No" or "True/False" response. Use a "Checkbox Group" if one or more answers can be applicable. Use a "Radio Group" if there are multiple choices, but only one answer.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ maxWidth: '30%', minWidth: '20%', mr: 0 }}>
          <TextField
            label="Name"
            required
            onChange={handleNameChange}
            value={name}
            fullWidth
          />
        </Box>
        <Box sx={{ width: '8%' }}>
          <FormControlLabel
            control={<Switch checked={required} onChange={handleRequiredChange} />}
            label="Required"
          />
        </Box>
        <Box sx={{ width: '14%' }}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={handleTypeChange}
            value={selectedType}
          >
            <ToggleButton value="check">Check</ToggleButton>
            <ToggleButton value="group">Group</ToggleButton>
            <ToggleButton value="radio">Radio</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ minWidth: '48%' }}>
          {selectedType === 'check' && (
            <FormGroup row>
              <FormControlLabel
                control={<Switch checked={isSwitchSelected} onChange={toggleSwitch} />}
                label={isSwitchSelected ? "Switch" : "Checkbox"}
                labelPlacement="start"
                sx={{ mr: 0 }}
              />
              <FormControlLabel
                control={<Switch checked={isDefaultChecked} onChange={toggleDefaultChecked} />}
                label="Default Checked"
                sx={{ ml: 1 }}
              />
            </FormGroup>
          )}
          {selectedType === 'group' && (
           <FormGroup row>
              <FormControlLabel
                control={<Switch checked={allowMultiple} onChange={handleAllowMultipleChange} />}
                label="Allow Multiple Selections"
              />
              <ToggleButtonGroup
                color="primary"
                exclusive
                onChange={handleLayoutChange}
                value={layout}
              >
                <ToggleButton value="vertical">Vertical</ToggleButton>
                <ToggleButton value="horizontal">Horizontal</ToggleButton>
              </ToggleButtonGroup>
              </FormGroup>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {(selectedType === 'group' || selectedType === 'radio') && (
          <>
            <TextField
              label="New Option"
              value={newOption}
              onChange={handleNewOptionChange}
              sx={{ width: '100%' }}
            />
            <Button onClick={addOption}>Add Option</Button>
            <RadioGroup
              value={defaultOption}
              onChange={handleDefaultOptionChange}
            >
              {options.map((option, index) => (
                <Grid container key={index} spacing={2} alignItems="center" wrap="nowrap">
                  <Grid item xs>
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => removeOption(option)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </RadioGroup>
          </>
        )}
      </Box>
      {selectedType === 'check' && isSwitchSelected && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Toggled Name"
            value={toggledName}
            onChange={handleToggledNameChange}
            sx={{ width: '100%' }}
          />
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveConfig}
        sx={{
          position: 'absolute',
          bottom: '16px',
          right: '16px'
        }}
      >
        Save Configuration
      </Button>
    </Box>
  );
};

export default CheckboxConfiguration;
