import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

import CheckBoxInput from '../admin/fields/inputs/CheckboxInput';
import DatePickerInput from '../admin/fields/inputs/DatePickerInput';
import DateRangeInput from '../admin/fields/inputs/DateRangeInput';
import LongTextInput from '../admin/fields/inputs/LongTextInput';
import SelectInput from '../admin/fields/inputs/SelectInput';
import TextInput from '../admin/fields/inputs/TextInput';
import NumberInput from '../admin/fields/inputs/NumberInput';

const fieldComponents = {
  Checkbox: CheckBoxInput,
  DatePicker: DatePickerInput,
  DateRangePicker: DateRangeInput,
  TextField: LongTextInput,
  Select: SelectInput,
  TextFieldConfiguration: TextInput,
  Number: NumberInput,
};

const FormFiller = ({ config, onSubmit }) => {
  const [layoutConfig, setLayoutConfig] = useState([]);
  const [fillFormConfig, setFillFormConfig] = useState([]);

  const splitConfig = (config) => {
    console.log('Splitting config:', config);
    const layout = [];
    const fields = [];

    config.forEach(item => {
      if (item.type === 'field' && item.fieldConfig && item.fieldConfig.config) {
        fields.push(item);
      } else {
        layout.push(item);
      }
    });

    return { layout, fields };
  };

  const processFieldConfig = (fields) => {
    return fields.map(item => {
      const processedItem = {
        ...item,
        fieldConfig: {
          ...item.fieldConfig,
          config: {
            ...item.fieldConfig.config,
            input: '', // Initialize input field
          },
        },
      };
      console.log("Processed field item:", processedItem);
      return processedItem;
    });
  };

  useEffect(() => {
    console.log("Received config:", config);

    let parsedConfig;
    try {
      parsedConfig = JSON.parse(config);
    } catch (error) {
      console.error("Failed to parse config:", error);
      return;
    }

    if (parsedConfig && Array.isArray(parsedConfig)) {
      const { layout, fields } = splitConfig(parsedConfig);
      console.log("Split config - layout:", layout);
      console.log("Split config - fields:", fields);
      setLayoutConfig(layout);
      setFillFormConfig(processFieldConfig(fields));
    } else {
      console.warn("Config is not an array or is invalid:", parsedConfig);
    }
  }, [config]);

  useEffect(() => {
    console.log("layoutConfig:", layoutConfig);
    console.log("fillFormConfig:", fillFormConfig);
  }, [layoutConfig, fillFormConfig]);

  const handleInputChange = (id, value) => {
    setFillFormConfig(prevConfig => {
      const newConfig = prevConfig.map(item => {
        if (item.id === id) {
          return {
            ...item,
            fieldConfig: {
              ...item.fieldConfig,
              config: {
                ...item.fieldConfig.config,
                input: value,
              },
            },
          };
        }
        return item;
      });
      console.log("Updated fillFormConfig:", newConfig);
      return newConfig;
    });
  };

  const renderLayoutElements = () => {
    return layoutConfig.map((item, index) => {
      console.log(`Rendering layout element: ${item.type} with id: ${item.id}`);

      if (item.type === 'header') {
        return (
          <Box
            key={item.id || index}
            sx={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.w}px`,
              height: `${item.h}px`,
              padding: 1,
              borderRadius: 1,
              backgroundColor: 'white',
              boxSizing: 'border-box',
            }}
          >
            <Typography
              variant="h4"
              style={{ fontSize: `${item.properties.fontSize}px`, color: item.properties.color }}
            >
              {item.properties.text}
            </Typography>
          </Box>
        );
      } else if (item.type === 'divider') {
        return (
          <Box
            key={item.id || index}
            sx={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.w}px`,
              height: `${item.h}px`,
              padding: 1,
              borderRadius: 1,
              backgroundColor: 'white',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: `${item.properties.thickness}px`,
                backgroundColor: item.properties.color,
              }}
            />
          </Box>
        );
      }
      return null;
    });
  };

  const renderFields = () => {
    if (fillFormConfig.length === 0) {
      console.log("fillFormConfig is empty, nothing to render.");
      return <Box>No fields to display</Box>;
    }

    return fillFormConfig.map((field, index) => {
      console.log(`Rendering field: ${field.fieldConfig.type} with id: ${field.id}`);
      const FieldComponent = fieldComponents[field.fieldConfig.type];
      if (!FieldComponent) {
        console.warn(`Unknown field type: ${field.fieldConfig.type}`);
        return <Box key={field.id || index}>Unknown field type: {field.fieldConfig.type}</Box>;
      }

      return (
        <Box
          key={field.id || index}
          sx={{
            position: 'absolute',
            left: `${field.x}px`,
            top: `${field.y}px`,
            width: `${field.w}px`,
            height: `${field.h}px`,
            padding: 1,
            borderRadius: 1,
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        >
          <FieldComponent
            config={field.fieldConfig.config}
            onInputChange={(value) => handleInputChange(field.id, value)}
          />
        </Box>
      );
    });
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {renderLayoutElements()}
      {renderFields()}
      <Button sx={{ position: 'absolute', bottom: 16, left: 16 }} onClick={() => onSubmit([...layoutConfig, ...fillFormConfig])}>Submit</Button>
    </Box>
  );
};

export default FormFiller;
