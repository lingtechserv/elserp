import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, FormControlLabel, Grid, IconButton, Radio, RadioGroup, Switch, TextField, Typography, Checkbox, FormGroup } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useForm } from '../../../../contexts/FormContext';
import { openDB } from 'idb'; // Import idb for IndexedDB access

const SelectConfiguration = ({ setFieldConfig, setPreviewConfig }) => {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [selectedType, setSelectedType] = useState('single');
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [flex, setFlex] = useState('vertical');
  const [isCustom, setIsCustom] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState([]);
  const [dbData, setDbData] = useState({});

  const { createField } = useForm();

  // Function to fetch dbData from IndexedDB
  const getDbDataFromIndexedDB = async () => {
    try {
      const db = await openDB('my-database', 1); // Open IndexedDB with the correct name and version
      const data = await db.get('data-store', 'dbData'); // Retrieve dbData from the data-store
      return data;
    } catch (error) {
      console.error('Error fetching dbData from IndexedDB:', error);
      return null;
    }
  };

  // Fetch dbData from IndexedDB when component mounts
  useEffect(() => {
    const fetchDbData = async () => {
      const storedDbData = await getDbDataFromIndexedDB();
      if (storedDbData) {
        setDbData(storedDbData);
        console.log('Loaded dbData from IndexedDB:', storedDbData);
      } else {
        console.log('No dbData found in IndexedDB');
      }
    };

    fetchDbData();
  }, []);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setFieldConfig((prev) => ({ ...prev, Name: newName }));
    setPreviewConfig((prev) => ({ ...prev, Name: newName }));
  };

  const handleLabelChange = (event) => {
    const newLabel = event.target.value;
    setLabel(newLabel);
    setFieldConfig((prev) => ({ ...prev, Label: newLabel }));
    setPreviewConfig((prev) => ({ ...prev, Label: newLabel }));
  };

  const handleRequiredChange = (event) => {
    const newRequired = event.target.checked;
    setRequired(newRequired);
    setFieldConfig((prev) => ({ ...prev, Required: newRequired }));
    setPreviewConfig((prev) => ({ ...prev, Required: newRequired }));
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
      setFieldConfig((prev) => ({ ...prev, Type: newType }));
      setPreviewConfig((prev) => ({ ...prev, Type: newType }));
    }
  };

  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };

  const addOption = () => {
    if (newOption.trim() !== '') {
      setOptions((prevOptions) => {
        const updatedOptions = [...prevOptions, newOption];
        setFieldConfig((prev) => ({ ...prev, Options: updatedOptions }));
        setPreviewConfig((prev) => ({ ...prev, Options: updatedOptions }));
        return updatedOptions;
      });
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove) => {
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter((option) => option !== optionToRemove);
      setFieldConfig((prev) => ({ ...prev, Options: updatedOptions }));
      setPreviewConfig((prev) => ({ ...prev, Options: updatedOptions }));
      return updatedOptions;
    });
  };

  const handleDefaultOptionChange = (event) => {
    const option = event.target.value;
    if (selectedType === 'single') {
      setDefaultOptions([option]);
      setFieldConfig((prev) => ({ ...prev, DefaultValue: option }));
      setPreviewConfig((prev) => ({ ...prev, DefaultValue: option }));
    } else if (selectedType === 'multi') {
      setDefaultOptions((prev) => {
        const isChecked = event.target.checked;
        const updatedDefaults = isChecked
          ? [...prev, option]
          : prev.filter((opt) => opt !== option);
        setFieldConfig((prev) => ({ ...prev, DefaultValue: updatedDefaults }));
        setPreviewConfig((prev) => ({ ...prev, DefaultValue: updatedDefaults }));
        return updatedDefaults;
      });
    }
  };

  const handleCustomDatabaseToggle = () => {
    setIsCustom((prev) => !prev);
  };

  const handleTableChange = (event) => {
    const tableName = event.target.value;
    setSelectedTable(tableName);
    setColumns(dbData[tableName] || []);
  };

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  };

  const addFilter = () => {
    setFilters((prevFilters) => [
      ...prevFilters,
      { column: '', operator: 'equal', value: '', logic: 'AND' },
    ]);
  };

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...filters];
    updatedFilters[index][field] = value;
    setFilters(updatedFilters);
  };

  const handleSaveConfig = () => {
    const config = {
      name,
      label,
      required,
      options,
      type: selectedType,
      defaultValue: selectedType === 'single' ? defaultOptions[0] || '' : defaultOptions,
      flex,
      selectedTable,
      selectedColumn,
      filters,
    };
    setPreviewConfig(config);
    createField({ name, type: 'Select', config });

    // Clear the component state
    setName('');
    setLabel('');
    setRequired(false);
    setSelectedType('single');
    setOptions([]);
    setNewOption('');
    setDefaultOptions([]);
    setFlex('vertical');
    setSelectedTable('');
    setSelectedColumn('');
    setFilters([]);
  };

  useEffect(() => {
    setPreviewConfig({
      Name: name,
      Label: label,
      Required: required,
      Options: options,
      Type: selectedType,
      DefaultValue: selectedType === 'single' ? defaultOptions[0] || '' : defaultOptions,
      Flex: flex,
      Table: selectedTable,
      Column: selectedColumn,
      Filters: filters,
    });
  }, [name, label, required, options, selectedType, defaultOptions, flex, selectedTable, selectedColumn, filters]);

  return (
    <Box sx={{ position: 'relative', paddingBottom: '60px', minHeight: '89.5%', width: '60vw' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'lightyellow', py: 1, px: 2, borderRadius: 1, mb: 1 }}>
        <LightbulbIcon sx={{ color: 'orange', mr: 1, fontSize: 'default' }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          Tip
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 1, marginLeft: '15px' }}>
          {/* Tip message */}
        </Typography>
      </Box>

      {/* First Row with Name, Label, etc. */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <TextField
          label="Name"
          required
          onChange={handleNameChange}
          sx={{ mr: 2, flex: 3 }}
          value={name}
        />
        <TextField
          label="Label"
          required
          onChange={handleLabelChange}
          sx={{ mr: 2, flex: 3 }}
          value={label}
        />
        <FormControlLabel
          control={<Switch checked={required} onChange={handleRequiredChange} />}
          label="Required"
          sx={{ flex: 1 }}
        />
      </Box>

      {/* New section: Custom/Database Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ mr: 2 }}>Custom</Typography>
        <FormControlLabel
          control={<Switch checked={!isCustom} onChange={handleCustomDatabaseToggle} />}
          label="Database"
          labelPlacement="end"
        />
      </Box>

      {/* Options Section */}
      {!isCustom && (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          {/* Dropdown to select a table */}
          <FormControl sx={{ width: '40%' }}>
            <InputLabel>Select Table</InputLabel>
            <Select
              value={selectedTable}
              onChange={handleTableChange}
              label="Select Table"
            >
              {Object.keys(dbData).length > 0 ? (
                Object.keys(dbData).map((table, index) => (
                  <MenuItem key={index} value={table}>
                    {table}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No tables available</MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Dropdown to select a column */}
          <FormControl sx={{ width: '40%' }}>
            <InputLabel>Select Column</InputLabel>
            <Select
              value={selectedColumn}
              onChange={handleColumnChange}
              label="Select Column"
            >
              {columns.length > 0 ? (
                columns.map((column, index) => (
                  <MenuItem key={index} value={column}>
                    {column}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No columns available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Filter Section */}
      {!isCustom && (
        <>
          <Button startIcon={<AddCircleIcon />} onClick={addFilter} sx={{ mt: 2 }}>
            Add Filter
          </Button>

          {filters.map((filter, index) => (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }} key={index}>
              {/* Column Dropdown */}
              <FormControl sx={{ width: '20%' }}>
                <InputLabel>Select Column</InputLabel>
                <Select
                  value={filter.column}
                  onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
                  label="Select Column"
                >
                  {columns
                    .filter((column) => column !== selectedColumn)
                    .map((column, idx) => (
                      <MenuItem key={idx} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* Operator Dropdown */}
              <FormControl sx={{ width: '20%' }}>
                <InputLabel>Select Operator</InputLabel>
                <Select
                  value={filter.operator}
                  onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                  label="Select Operator"
                >
                  <MenuItem value="equal">Equal to</MenuItem>
                  <MenuItem value="not_equal">Not equal to</MenuItem>
                  <MenuItem value="includes">Includes</MenuItem>
                  <MenuItem value="not_includes">Does not include</MenuItem>
                  <MenuItem value="greater_than">Greater than</MenuItem>
                  <MenuItem value="less_than">Less than</MenuItem>
                </Select>
              </FormControl>

              {/* Text Field for the filter value */}
              <TextField
                label="Value"
                sx={{ width: '25%' }}
                value={filter.value}
                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
              />

              {/* Logic Radio Buttons (AND/OR) */}
              <RadioGroup
                value={filter.logic}
                onChange={(e) => handleFilterChange(index, 'logic', e.target.value)}
                sx={{ ml: 2 }}
              >
                <FormControlLabel
                  value="AND"
                  control={<Radio />}
                  label={<Typography variant="caption">AND</Typography>}
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  value="OR"
                  control={<Radio />}
                  label={<Typography variant="caption">OR</Typography>}
                />
              </RadioGroup>
            </Box>
          ))}
        </>
      )}

      {/* Custom Options Section */}
      {isCustom && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="New Option"
            value={newOption}
            onChange={handleNewOptionChange}
            sx={{ width: '100%' }}
          />
          <Button onClick={addOption}>Add Option</Button>
          {selectedType === 'single' ? (
            <RadioGroup value={defaultOptions[0] || ''} onChange={handleDefaultOptionChange}>
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
          ) : (
            <FormGroup>
              {options.map((option, index) => (
                <Grid container key={index} spacing={2} alignItems="center" wrap="nowrap">
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={defaultOptions.includes(option)}
                          onChange={handleDefaultOptionChange}
                          value={option}
                        />
                      }
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
            </FormGroup>
          )}
        </Box>
      )}

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

export default SelectConfiguration;
