import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Toolbar,
  AppBar,
  MenuItem,
  Select,
  ButtonGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { globalColors } from '../../../../../constants/Styles';

const InputOutputConfiguration = ({ config, onSave, onCancel }) => {
  const [ioType, setIoType] = useState(config.ioType || 'Input'); // "Input" or "Output"
  const [dataSource, setDataSource] = useState(config.dataSource || '');
  const [dataDestination, setDataDestination] = useState(config.dataDestination || '');
  const [fieldMappings, setFieldMappings] = useState(config.fieldMappings || []);

  const handleSave = () => {
    onSave({
      ioType,
      dataSource,
      dataDestination,
      fieldMappings,
    });
  };

  const handleIoTypeChange = (type) => {
    setIoType(type);
    if (type === 'Input') {
      setDataDestination('');
    } else {
      setDataSource('');
    }
  };

  const handleFieldMappingChange = (index, field, value) => {
    const newMappings = [...fieldMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setFieldMappings(newMappings);
  };

  const addFieldMapping = () => {
    setFieldMappings([...fieldMappings, { sourceField: '', destinationField: '' }]);
  };

  const removeFieldMapping = (index) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  return (
    <Modal
      open={true}
      onClose={onCancel}
      aria-labelledby="io-config-modal"
      aria-describedby="modal-to-open-io-config"
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          display: 'flex',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            padding: 0,
            marginLeft: 0,
            marginTop: '56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: globalColors.primary,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              width: '100%',
              left: 0,
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                Input/Output Configuration
              </Typography>
              <IconButton
                aria-label="close"
                onClick={onCancel}
                sx={{
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ mt: '16px', pl: '16px', width: '100%', maxWidth: '240px' }}>
            <Typography variant="h6">Select Type</Typography>
            <ButtonGroup variant="contained" sx={{ mt: 2 }}>
              <Button
                color={ioType === 'Input' ? 'primary' : 'inherit'}
                onClick={() => handleIoTypeChange('Input')}
              >
                Input
              </Button>
              <Button
                color={ioType === 'Output' ? 'primary' : 'inherit'}
                onClick={() => handleIoTypeChange('Output')}
              >
                Output
              </Button>
            </ButtonGroup>
          </Box>

          <Box sx={{ mt: 2, pl: '16px', pr: '16px', width: '100%', display: 'flex', gap: 4 }}>
            {ioType === 'Input' ? (
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Data Source</Typography>
                <Select
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {/* Add options for data sources (e.g., database tables, APIs) */}
                  <MenuItem value="Database">Database</MenuItem>
                  <MenuItem value="API">API Endpoint</MenuItem>
                  <MenuItem value="Manual">Manual Entry</MenuItem>
                </Select>
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Data Destination</Typography>
                <Select
                  value={dataDestination}
                  onChange={(e) => setDataDestination(e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {/* Add options for data destinations (e.g., database tables, files) */}
                  <MenuItem value="Database">Database</MenuItem>
                  <MenuItem value="File">File System</MenuItem>
                  <MenuItem value="API">API Endpoint</MenuItem>
                </Select>
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 4, pl: '16px', pr: '16px', width: '100%' }}>
            <Typography variant="subtitle1">Field Mappings</Typography>
            {fieldMappings.map((mapping, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Source Field"
                  value={mapping.sourceField}
                  onChange={(e) => handleFieldMappingChange(index, 'sourceField', e.target.value)}
                  fullWidth
                  disabled={ioType === 'Output'}
                />
                <TextField
                  label="Destination Field"
                  value={mapping.destinationField}
                  onChange={(e) => handleFieldMappingChange(index, 'destinationField', e.target.value)}
                  fullWidth
                  disabled={ioType === 'Input'}
                />
                <IconButton
                  onClick={() => removeFieldMapping(index)}
                  sx={{ alignSelf: 'center' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={addFieldMapping} sx={{ mt: 2 }}>
              Add Field Mapping
            </Button>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'flex-end',
              width: 'auto',
              marginRight: 5,
            }}
          >
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default InputOutputConfiguration;
