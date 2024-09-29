import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, Divider, Typography } from '@mui/material';

import TextFieldConfiguration from './fields/configurations/TextFieldConfiguration';
import LongTextFieldConfiguration from './fields/configurations/LongTextFieldConfiguration';
import TextInput from './fields/inputs/TextInput';
import LongTextInput from './fields/inputs/LongTextInput';
import DatePickerConfiguration from './fields/configurations/DatePickerConfiguration';
import DatePickerInput from './fields/inputs/DatePickerInput';
import DateRangePickerConfiguration from './fields/configurations/DateRangePickerConfiguration';
import DateRangeInput from './fields/inputs/DateRangeInput';
import CheckboxConfiguration from './fields/configurations/CheckboxConfiguration';
import CheckboxInput from './fields/inputs/CheckboxInput';
import SelectConfiguration from './fields/configurations/SelectConfiguration';
import SelectInput from './fields/inputs/SelectInput';
import NumberConfiguration from './fields/configurations/NumberConfiguration';
import NumberInput from './fields/inputs/NumberInput';

const FieldWizard = () => {
  const [selectedFieldType, setSelectedFieldType] = useState('');
  const [previewConfig, setPreviewConfig] = useState({});
  const [fieldConfig, setFieldConfig] = useState({});

  useEffect(() => {
    console.log(fieldConfig);
  }, [fieldConfig]);

  const handlePreviewConfigChange = (newPreviewConfig) => {
    setPreviewConfig(newPreviewConfig);
  };

  const handleFieldTypeChange = (event) => {
    setSelectedFieldType(event.target.value);
    setFieldConfig({});
    setPreviewConfig({});
  };

  useEffect(() => {
    console.log(selectedFieldType);
  }, [selectedFieldType]);

  const renderFieldConfiguration = () => {
    switch (selectedFieldType) {
      case 'Checkbox':
        return <CheckboxConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      case 'Dropdown':
        return <SelectConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      case 'Date':
        return <DatePickerConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      case 'DateRange':
        return <DateRangePickerConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      case 'Text':
        return <TextFieldConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      case 'LongText':
        return <LongTextFieldConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      case 'Number':
        return <NumberConfiguration setFieldConfig={setFieldConfig} setPreviewConfig={handlePreviewConfigChange} />;
      default:
        return null;
    }
  };

  const renderPreviewConfiguration = () => {
    switch (selectedFieldType) {
      case 'Checkbox':
        return <CheckboxInput config={previewConfig} />;
      case 'Dropdown':
        return <SelectInput config={previewConfig} />;
      case 'Date':
        return <DatePickerInput config={previewConfig} />;
      case 'DateRange':
        return <DateRangeInput config={previewConfig} />;
      case 'Text':
        return <TextInput config={previewConfig} />;
      case 'LongText':
        return <LongTextInput config={previewConfig} />;
      case 'Number':
        return <NumberInput config={previewConfig} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '91vh', display: 'flex' }}>
      <Box sx={{ width: '65vw', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <FormControl sx={{ width: '20%' }} size="small">
          <InputLabel id="field-type-select-label">Field Type</InputLabel>
          <Select
            labelId="field-type-select-label"
            id="field-type-select"
            value={selectedFieldType}
            label="Field Type"
            onChange={handleFieldTypeChange}
            sx={{ paddingLeft: '15px'}}
          >
            <MenuItem value="Number">Number</MenuItem>
            <MenuItem value="Text">Text</MenuItem>
            <MenuItem value="LongText">Long Text</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
            <MenuItem value="DateRange">Date Range</MenuItem>
            <MenuItem value="Checkbox">Checkbox</MenuItem>
            <MenuItem value="Dropdown">Dropdown</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ width: '100%', my: 2 }} />
        {renderFieldConfiguration()}
      </Box>

      <Box sx={{ width: '35vw', bgcolor: 'lightgrey', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Field Preview</Typography>
        </Box>
        <Box sx={{ width: '25vw', margin: 'auto' }}>
          {renderPreviewConfiguration()}
        </Box>
      </Box>
    </Box>
  );
};

export default FieldWizard;
