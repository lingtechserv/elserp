import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';

const validateFormat = (value, format, rule, chars) => {
  let regexPattern = '';

  // Build the regex pattern based on the format
  for (let i = 0; i < format.length; i++) {
    if (format[i] === '#') {
      regexPattern += '\\d';
    } else if (format[i] === 'C') {
      regexPattern += '.';
    } else if (format[i] === 'T') {
      regexPattern += '[A-Za-z]';
    } else if (format[i] === '"') {
      let stringContent = '';
      i++;
      while (i < format.length && format[i] !== '"') {
        stringContent += format[i];
        i++;
      }
      regexPattern += stringContent;
    } else {
      regexPattern += format[i];
    }
  }

  const pattern = new RegExp(`^${regexPattern}$`);
  
  // Validate the value against the regex pattern
  const isValidFormat = pattern.test(value);

  // Validate the characters against the allow/reject rule
  let isValidChars = true;
  if (chars) {
    const charsPattern = rule === 'Allow' ? new RegExp(`^[${chars}]+$`) : new RegExp(`^[^${chars}]+$`);
    isValidChars = charsPattern.test(value);
  }
  
  return isValidFormat && isValidChars;
};

const NumberInput = ({ config }) => {
  const {
    name,
    required,
    segments = [],
  } = config;

  useEffect(() => {
    console.log(config);
  }, [config]);

  const [values, setValues] = useState(segments.map(() => ''));
  const [errors, setErrors] = useState(segments.map(() => false));

  const handleChange = (index, segment) => (event) => {
    const newValue = event.target.value;
    const isValid = validateFormat(newValue, segment.format, segment.rule, segment.chars);

    const newValues = [...values];
    newValues[index] = newValue;

    const newErrors = [...errors];
    newErrors[index] = !isValid;

    setValues(newValues);
    setErrors(newErrors);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle1">{name}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <TextField
              label={segment.name}
              value={values[index]}
              onChange={handleChange(index, segment)}
              required={required}
              error={errors[index]}
              helperText={errors[index] ? `Invalid format: ${segment.format}` : ''}
              sx={{ flex: 1 }}
            />
            {index < segments.length - 1 && (
              <Typography variant="subtitle1" sx={{ alignSelf: 'center' }}>
                {segment.delimiter}
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default NumberInput;
