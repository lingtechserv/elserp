import React, { useState, useEffect } from 'react';
import { Typography, FormControlLabel, Checkbox, Switch, Radio, RadioGroup, FormGroup, Box } from '@mui/material';

const CheckboxInput = ({ config }) => {
  const [isChecked, setIsChecked] = useState(config.isDefaultChecked);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    setIsChecked(config.isDefaultChecked);
  }, [config.isDefaultChecked]);

  // Render content based on selectedType
  switch (config.selectedType) {
    case 'check':
      if (config.isSwitchSelected) {
        const label = isChecked && config.toggledName ? config.toggledName : config.name;
        return (
          <FormControlLabel
            control={<Switch checked={isChecked} onChange={handleChange} required={config.required} />}
            label={label}
          />
        );
      } else {
        return (
          <FormControlLabel
            control={<Checkbox checked={isChecked} onChange={handleChange} required={config.required} />}
            label={config.name}
          />
        );
      }

    case 'group':
      return (
        <Box>
          <Typography variant="h6">{config.name}</Typography>
          {config.allowMultiple ? (
            <FormGroup>
              {config.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox required={config.required} />}
                  label={option}
                />
              ))}
            </FormGroup>
          ) : (
            <RadioGroup name={config.name}>
              {config.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio required={config.required} />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}
        </Box>
      );

    case 'radio':
      return (
        <Box>
          <Typography variant="h6">{config.name}</Typography>
          <RadioGroup name={config.name}>
            {config.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio required={config.required} />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Box>
      );

    default:
      // Handle other selectedTypes or provide a fallback
      return null;
  }
};

export default CheckboxInput;
