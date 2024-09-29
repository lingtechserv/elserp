import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';

const DatePickerInput = ({ config }) => {
  const {
    Name,
    Required,
    Type,
    Resolution,
    DateFormat,
  } = config;

  console.log('Config:', config);
  console.log('Year:', Resolution?.year);

  const [selectedDate, setSelectedDate] = useState(null);

  const getPickerVariant = (Type) => {
    switch (Type) {
      case 'picker':
        return DatePicker;
      case 'dateField':
        return DateField;
      case 'calendar':
        return DateCalendar;
      default:
        return DatePicker;
    }
  };

  const calculateViews = () => {
  const views = [];
  if (Resolution?.year) views.push('year');
  if (Resolution?.month) views.push('month');
  if (Resolution?.day) views.push('day');
  return views;
};


  const determineOpenTo = () => {
    if (Resolution?.day) return 'day';
    if (Resolution?.month) return 'month';
    if (Resolution?.year) return 'year';
    return 'year';
  };

  const PickerVariant = getPickerVariant(Type);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PickerVariant
        label={Name}
        required={Required}
        views={calculateViews()}
        openTo={determineOpenTo()}
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        inputFormat={DateFormat}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
