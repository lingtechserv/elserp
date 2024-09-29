import React, { useEffect, useState } from 'react';
import { TextField, Box } from '@mui/material';

const LongTextInput = ({ config }) => {
  const { name, required, limit, prohibitedCharacters } = config;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    console.log(config);
  }, [config]);

  const handleInputChange = (event) => {
    const value = event.target.value;

    if (prohibitedCharacters && prohibitedCharacters.split('').some(char => value.includes(char))) {
      // Handle prohibited characters case
    } else {
      if (!limit || value.length <= limit) {
        setInputValue(value);
      }
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
        multiline
        rows={4}
      />
      <Box sx={{ position: 'absolute', right: 0, top: '100%', mt: 1, fontSize: '0.75rem' }}>
        {`${inputValue.length}/${limit}`}
      </Box>
    </Box>
  );
};

export default LongTextInput;
