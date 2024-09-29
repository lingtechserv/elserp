import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, FormControlLabel, Switch, Typography, InputAdornment, ToggleButton, ToggleButtonGroup, Divider, Button } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from '../../../../contexts/FormContext';

const NumberConfiguration = ({ setFieldConfig, setPreviewConfig }) => {
  const [name, setName] = useState('');
  const [required, setRequired] = useState(false);
  const [segments, setSegments] = useState([]);

  const { createField } = useForm(); // Get createField function from context

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setFieldConfig((prev) => ({ ...prev, Name: newName }));
    setPreviewConfig((prev) => ({ ...prev, Name: newName }));
  };

  const handleRequiredChange = (event) => {
    const newRequired = event.target.checked;
    setRequired(newRequired);
    setFieldConfig((prev) => ({ ...prev, Required: newRequired }));
    setPreviewConfig((prev) => ({ ...prev, Required: newRequired }));
  };

  const addSegment = () => {
    setSegments((prevSegments) => [
      ...prevSegments,
      { name: '', format: '', delimiter: '', decimals: 0, rule: 'Allow', chars: '' },
    ]);
  };

  const handleSegmentChange = (index, field) => (event, newValue) => {
    const value = field === 'decimals' ? parseInt(event.target.value, 10) : event.target.value;
    const updatedSegments = segments.map((segment, i) =>
      i === index ? { ...segment, [field]: newValue || value } : segment
    );
    setSegments(updatedSegments);
    setFieldConfig((prev) => ({ ...prev, Segments: updatedSegments }));
    setPreviewConfig((prev) => ({ ...prev, Segments: updatedSegments }));
  };

  const removeSegment = (index) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
    setFieldConfig((prev) => ({ ...prev, Segments: newSegments }));
    setPreviewConfig((prev) => ({ ...prev, Segments: newSegments }));
  };

  const handleSaveConfig = () => {
    const config = {
      name,
      required,
      segments,
    };
    setPreviewConfig(config);
    createField({ name, type: 'Number', config }); // Save the configuration
    
    // Clear the component state
    setName('');
    setRequired(false);
    setSegments([]);
  };

  useEffect(() => {
    setPreviewConfig({
      Name: name,
      Required: required,
      Segments: segments,
    });
  }, [name, required, segments]);

  return (
    <Box sx={{ position: 'relative', paddingBottom: '60px', minHeight: '89.5%', width: '60vw' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'lightyellow', py: 1, px: 2, borderRadius: 1, mb: 1 }}>
      <LightbulbIcon sx={{ color: 'orange', mr: 1, fontSize: 'default' }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          Tip
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 1, marginLeft: '15px' }}>
          The Number Input is much more than just a simple integer or decimal number.  The configuration tool allows you to build multiple segments and manage the structure of each segment individually.  These fields will always appear on a single row. The Segment Label is the placeholder text that will appear in that segment's input.  The Format will allow you to determine how the data should be structured, should you require specific rules.  To set this, use # to denote a number, T to denote a letter, and C to denote any character.  As an example, ### will require three numbers, no more no less, and will not accept any characters other than numbers.  #CTC# will require five total characters, a number followed by any character, followed by a number, followed by any character, and ending in a number.  The Delimiter is the character or string that will appear between your segments.  You can also input characters that you will Allow or Reject if needed.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <TextField
          label="Name"
          required
          onChange={handleNameChange}
          sx={{ mr: 2, flex: 3 }}
          value={name}
        />
        <FormControlLabel
          control={<Switch checked={required} onChange={handleRequiredChange} />}
          label="Required"
          sx={{ flex: 1 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={addSegment} color="primary">
            <AddCircleIcon />
          </IconButton>
        </Box>
        {segments.map((segment, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Segment Name"
                value={segment.name}
                onChange={handleSegmentChange(index, 'name')}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Format"
                value={segment.format}
                onChange={handleSegmentChange(index, 'format')}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Delimiter"
                value={segment.delimiter}
                onChange={handleSegmentChange(index, 'delimiter')}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Decimals"
                type="number"
                value={segment.decimals}
                onChange={handleSegmentChange(index, 'decimals')}
                sx={{ width: '80px' }}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">dec</InputAdornment>,
                }}
              />
              <IconButton onClick={() => removeSegment(index)} size="small" color="secondary">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ToggleButtonGroup
                value={segment.rule}
                exclusive
                onChange={handleSegmentChange(index, 'rule')}
                aria-label="text formatting"
              >
                <ToggleButton value="Allow">Allow</ToggleButton>
                <ToggleButton value="Reject">Reject</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                label={`${segment.rule} Characters`}
                value={segment.chars}
                onChange={handleSegmentChange(index, 'chars')}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        ))}
      </Box>
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

export default NumberConfiguration;
