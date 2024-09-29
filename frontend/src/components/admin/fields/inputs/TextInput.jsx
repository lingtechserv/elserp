import React, { useState } from 'react';
import { TextField, Box, Grid, Typography } from '@mui/material';

const TextInput = ({ config, onInputChange }) => {
  const { name, rows = [] } = config;

  const handleFieldChange = (rowIndex, fieldIndex, value) => {
    onInputChange(name, rowIndex, fieldIndex, value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {name}
      </Typography>
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            {row.fields.map((field, fieldIndex) => (
              <Grid item xs={field.slots} key={fieldIndex}>
                {field.type === 'field' ? (
                  <TextFieldComponent
                    field={field}
                    onChange={(value) => handleFieldChange(rowIndex, fieldIndex, value)}
                  />
                ) : (
                  <SpacerComponent slots={field.slots} />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

const TextFieldComponent = ({ field, onChange }) => {
  const { name, required, limit, prohibitedCharacters } = field;
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (prohibitedCharacters && prohibitedCharacters.split('').some(char => value.includes(char))) {
      // Do nothing if prohibited character is found
    } else {
      setInputValue(value);
      onChange(value);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        label={name}
        required={required}
        inputProps={{ maxLength: limit }}
        value={inputValue}
        onChange={handleInputChange}
        fullWidth
        size='small'
        sx={{
          fontSize: '0.875rem',
          '& .MuiInputBase-root': {
            padding: '0px 0px',
          },
          '& .MuiInputLabel-root': {
            margin: '0',
            padding: '0',
            fontSize: '0.75rem',
          },
        }}
      />
      <Box sx={{ position: 'absolute', right: 0, top: '100%', mt: 1, fontSize: '0.75rem' }}>
        {`${inputValue.length}/${limit}`}
      </Box>
    </Box>
  );
};

const SpacerComponent = () => {
  return <Box sx={{ width: '100%', height: '100%' }} />;
};

export default TextInput;
