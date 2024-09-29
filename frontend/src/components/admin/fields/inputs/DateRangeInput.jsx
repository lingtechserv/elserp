import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import dayjs from 'dayjs';
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

  const [value, setValue] = React.useState([
    dayjs('2022-04-17'),
    dayjs('2022-04-21'),
  ]);

  const getPickerVariant = (Type) => {
    switch (Type) {
      case 'picker':
        return DateRangePicker;
      case 'dateField':
        return MultiInputDateRangeField;
      case 'calendar':
        return DateRangeCalendar;
      default:
        return DateRangePicker;
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
        value={value}
        onChange={(newValue) => setSelectedDate(newValue)}
        inputFormat={DateFormat}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
