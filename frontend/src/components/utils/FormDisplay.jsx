import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckBoxInput from '../admin/fields/inputs/CheckboxInput';
import DatePickerInput from '../admin/fields/inputs/DatePickerInput';
import DateRangeInput from '../admin/fields/inputs/DateRangeInput';
import LongTextInput from '../admin/fields/inputs/LongTextInput';
import SelectInput from '../admin/fields/inputs/SelectInput';
import TextInput from '../admin/fields/inputs/TextInput';

const fieldComponents = {
  CheckBoxConfiguration: CheckBoxInput,
  DatePickerConfiguration: DatePickerInput,
  DateRangeConfiguration: DateRangeInput,
  LongTextConfiguration: LongTextInput,
  SelectConfiguration: SelectInput,
  TextFieldConfiguration: TextInput,
};

const FormDisplay = ({ formConfig }) => {
  if (!formConfig) {
    return <Typography>No form configuration available</Typography>;
  }

  const renderFields = () => {
    return formConfig.widgets.map(widget => {
      if (widget.type === 'field') {
        const { fieldConfig } = widget;
        const FieldComponent = fieldComponents[fieldConfig.type];
        if (!FieldComponent) {
          return <Box key={widget.id}>Unknown Field Type: {fieldConfig.type}</Box>;
        }
        return (
          <Box key={widget.id} sx={{ mb: 2 }}>
            <FieldComponent config={fieldConfig.config} />
          </Box>
        );
      }
      return null;
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>{formConfig.name}</Typography>
      {renderFields()}
    </Box>
  );
};

export default FormDisplay;
