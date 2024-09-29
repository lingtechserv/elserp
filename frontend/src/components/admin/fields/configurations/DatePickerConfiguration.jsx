import React, { useState, useEffect } from 'react';
import {
  ToggleButtonGroup, 
  ToggleButton, 
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  FormGroup,
  Checkbox,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useForm } from '../../../../contexts/FormContext';

const DatePickerConfiguration = ({ setFieldConfig, setPreviewConfig }) => {
  const [name, setName] = useState('');
  const [required, setRequired] = useState(false);
  const [resolution, setResolution] = useState({
    year: true,
    month: false,
    day: false,
    time: false,
  });
  const [dateRestriction, setDateRestriction] = useState('any');
  const [dateFormat, setDateFormat] = useState('');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: '2-digit' });
  const currentDay = currentDate.toLocaleString('default', { day: '2-digit' });
  const monthLong = currentDate.toLocaleString('default', { month: 'long' });
  const monthShort = currentDate.toLocaleString('default', { month: 'short' });
  const [clockFormat, setClockFormat] = useState('12');
  const [logSeconds, setLogSeconds] = useState(false);
  const [selectedType, setSelectedType] = useState('dateField');

  const { createField } = useForm(); // Get createField function from context

  const dateFormatOptions = () => {
    if (resolution.year && !resolution.month && !resolution.day) {
      return [<MenuItem value="year" key="year">{currentYear}</MenuItem>];
    } else if (resolution.year && resolution.month && !resolution.day) {
      return [
        <MenuItem value="mm/yyyy" key="mm/yyyy">{`${currentMonth}/${currentYear}`}</MenuItem>,
        <MenuItem value="mm-yyyy" key="mm-yyyy">{`${currentMonth}-${currentYear}`}</MenuItem>,
        <MenuItem value="yyyy/mm" key="yyyy/mm">{`${currentYear}/${currentMonth}`}</MenuItem>,
        <MenuItem value="yyyy-mm" key="yyyy-mm">{`${currentYear}-${currentMonth}`}</MenuItem>,
        <MenuItem value="mmm yyyy" key="mmm yyyy">{`${monthShort} ${currentYear}`}</MenuItem>,
        <MenuItem value="mmm, yyyy" key="mmm, yyyy">{`${monthShort}, ${currentYear}`}</MenuItem>,
        <MenuItem value="yyyy mmm" key="yyyy mmm">{`${currentYear} ${monthShort}`}</MenuItem>,
        <MenuItem value="yyyy, mmm" key="yyyy, mmm">{`${currentYear}, ${monthShort}`}</MenuItem>,
        <MenuItem value="mmmm yyyy" key="mmmm yyyy">{`${monthLong} ${currentYear}`}</MenuItem>,
        <MenuItem value="mmmm, yyyy" key="mmmm, yyyy">{`${monthLong}, ${currentYear}`}</MenuItem>,
        <MenuItem value="yyyy mmmm" key="yyyy mmmm">{`${currentYear} ${monthLong}`}</MenuItem>,
        <MenuItem value="yyyy, mmmm" key="yyyy, mmmm">{`${currentYear}, ${monthLong}`}</MenuItem>,
      ];
    } else if (resolution.year && resolution.month && resolution.day) {
      return [
        <MenuItem value="mm/dd/yyyy" key="mm/dd/yyyy">{`${currentMonth}/${currentDay}/${currentYear}`}</MenuItem>,
        <MenuItem value="mm-dd-yyyy" key="mm-dd-yyyy">{`${currentMonth}-${currentDay}-${currentYear}`}</MenuItem>,
        <MenuItem value="yyyy/mm/dd" key="yyyy/mm/dd">{`${currentYear}/${currentMonth}/${currentDay}`}</MenuItem>,
        <MenuItem value="yyyy-mm-dd" key="yyyy-mm-dd">{`${currentYear}-${currentMonth}-${currentDay}`}</MenuItem>,
        <MenuItem value="dd mmm yyyy" key="dd mmm yyyy">{`${currentDay} ${monthShort} ${currentYear}`}</MenuItem>,
        <MenuItem value="ddMMMyyyy" key="ddMMMyyyy">{`${currentDay}${monthShort.toUpperCase()}${currentYear}`}</MenuItem>,
        <MenuItem value="mmmm dd, yyyy" key="mmmm dd, yyyy">{`${monthLong} ${currentDay}, ${currentYear}`}</MenuItem>,
        <MenuItem value="dd mmmm, yyyy" key="dd mmmm, yyyy">{`${currentDay} ${monthLong}, ${currentYear}`}</MenuItem>,
        <MenuItem value="yyyy-mmmm-dd" key="yyyy-mmmm-dd">{`${currentYear}-${monthLong}-${currentDay}`}</MenuItem>,
        <MenuItem value="yyyy/mmmm/dd" key="yyyy/mmmm/dd">{`${currentYear}/${monthLong}/${currentDay}`}</MenuItem>,
      ];
    }
    return [];
  };
  
  const handleResolutionChange = (event) => {
    setResolution({
      ...resolution,
      [event.target.name]: event.target.checked,
    });
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setFieldConfig((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleRequiredChange = (event) => {
    setRequired(event.target.checked);
    setFieldConfig((prev) => ({ ...prev, required: event.target.checked }));
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
    }
  };

  const handleSaveConfig = () => {
    const config = {
      name,
      required,
      resolution,
      dateRestriction,
      dateFormat,
      clockFormat,
      logSeconds,
      type: selectedType,
    };
    setPreviewConfig(config);
    createField({ name, type: 'DatePicker', config }); // Save the configuration
    
    // Clear the component state
    setName('');
    setRequired(false);
    setResolution({
      year: true,
      month: false,
      day: false,
      time: false,
    });
    setDateRestriction('any');
    setDateFormat('');
    setClockFormat('12');
    setLogSeconds(false);
    setSelectedType('dateField');
  };

  useEffect(() => {
    const currentState = {
      name,
      required,
      resolution,
      dateRestriction,
      dateFormat,
      clockFormat,
      logSeconds,
      type: selectedType,
    };
    setPreviewConfig(currentState);
  }, [name, required, resolution, dateRestriction, dateFormat, clockFormat, logSeconds, selectedType]);

  return (
    <Box sx={{ position: 'relative', paddingBottom: '60px', minHeight: '89.5%', width: '60vw' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'lightyellow', py: 1, px: 2, borderRadius: 1, mb: 1 }}>
        <LightbulbIcon sx={{ color: 'orange', mr: 1, fontSize: 'default' }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          Tip
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 1, marginLeft: '15px' }}>
          A "Date Picker" is used to identify a single date. If you need a range of dates, "please use the Date Range Picker" instead.  The Button Group on the top row will determine the input method.  The Resolution checkbox group allows you to determine how deeply you want to track the date, from simply the year down to a second.  
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
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={handleTypeChange}
          value={selectedType}
          sx={{ ml: 2 }}
        >
          <ToggleButton value="picker">Picker</ToggleButton>
          <ToggleButton value="dateField">Field</ToggleButton>
          <ToggleButton value="calendar">Calendar</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Box sx={{ width: '40%' }}>
          <FormLabel component="legend">Resolution</FormLabel>
          <FormGroup row>
            <FormControlLabel control={<Checkbox checked={resolution.year} onChange={handleResolutionChange} name="year" />} label="Year" />
            <FormControlLabel control={<Checkbox checked={resolution.month} onChange={handleResolutionChange} name="month" disabled={!resolution.year} />} label="Month" />
            <FormControlLabel control={<Checkbox checked={resolution.day} onChange={handleResolutionChange} name="day" disabled={!resolution.month} />} label="Day" />
            <FormControlLabel control={<Checkbox checked={resolution.time} onChange={handleResolutionChange} name="time" disabled={!resolution.day} />} label="Time" />
          </FormGroup>
        </Box>
        <FormControl component="fieldset" sx={{ width: '60%' }}>
          <FormLabel component="legend">Date Input Restrictions</FormLabel>
          <RadioGroup row name="dateRestriction" value={dateRestriction} onChange={(event) => setDateRestriction(event.target.value)}>
            <FormControlLabel value="past" control={<Radio />} label="Can input past dates" />
            <FormControlLabel value="future" control={<Radio />} label="Can input future dates" />
            <FormControlLabel value="any" control={<Radio />} label="Can input any dates" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mt: 2 }}>
        <Box sx={{ width: '30%' }}>
          <FormControl fullWidth>
            <InputLabel id="date-format-select-label">Date Format</InputLabel>
            <Select
              labelId="date-format-select-label"
              id="date-format-select"
              value={dateFormat}
              label="Date Format"
              onChange={(event) => setDateFormat(event.target.value)}
            >
              {dateFormatOptions().map((option) => option)}
            </Select>
          </FormControl>
        </Box>
        <FormControl component="fieldset" sx={{ width: '30%' }} disabled={!resolution.time}>
          <FormLabel component="legend">Clock Format</FormLabel>
          <RadioGroup
            row
            name="clockFormat"
            value={clockFormat}
            onChange={(event) => setClockFormat(event.target.value)}
          >
            <FormControlLabel value="12" control={<Radio />} label="12 Hour Clock" />
            <FormControlLabel value="24" control={<Radio />} label="24 Hour Clock" />
          </RadioGroup>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={logSeconds} onChange={(event) => setLogSeconds(event.target.checked)} />}
          label="Log Seconds"
          sx={{ width: '30%' }}
          disabled={!resolution.time}
        />
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

export default DatePickerConfiguration;
