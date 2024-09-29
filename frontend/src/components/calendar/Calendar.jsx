import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Box, Button, ButtonGroup, Grid, IconButton, Popover, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { globalColors } from '../../constants/Styles';
import EventCard from './EventCard';
import EventModal from './EventModal';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

const INTERVAL_OPTIONS = [60, 12, 10, 6, 4, 2, 1];

const Calendar = ({
  resolution = 4,
  startTime,
  endTime,
  entities = [],
  events = [],
  width = '100%',
  height = 'auto',
  showDate = dayjs(),
}) => {
  if (!INTERVAL_OPTIONS.includes(resolution)) {
    console.error('Invalid resolution, must be one of:', INTERVAL_OPTIONS);
    return null;
  }

  const [currentDate, setCurrentDate] = useState(dayjs(showDate));
  const [start, setStart] = useState(dayjs(startTime, 'HH:mm'));
  const [end, setEnd] = useState(dayjs(endTime, 'HH:mm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log('Events to Calendar', events)
  },[events]);
  
  const intervalMinutes = 60 / resolution;
  const intervals = [];
  let current = start;

  while (current.isBefore(end)) {
    intervals.push(current.format('HH:mm'));
    current = current.add(intervalMinutes, 'minute');
  }

  useEffect(() => {
    console.log('Equipment:', entities);
    console.log('Schedule:', events);
  }, [entities, events]);

  const onDragEnd = (result) => {
    // Add your drag end logic here
  };

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => prevDate.add(1, 'day'));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(dayjs(newDate));
  };

  const handleDateIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDatePicker = () => {
    setAnchorEl(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const getBackgroundColor = (interval) => {
    const minute = dayjs(interval, 'HH:mm').minute();
    return minute === 0 ? '#d3d3d3' : '#f0f0f0';
  };

  const timeToPosition = (dateTime) => {
    const date = dayjs(dateTime);
    const startOfDay = dayjs(currentDate).startOf('day').hour(start.hour()).minute(start.minute());
    return (date.diff(startOfDay, 'minute') / intervalMinutes) * 30;
  };
  
  const timeToHeight = (startDateTime, endDateTime) => {
    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);
    return (end.diff(start, 'minute') / intervalMinutes) * 30;
  };
  

  const flattenedEvents = Object.values(events).flat();

  const filteredEvents = flattenedEvents
  .filter((event) => entities.some((entity) => entity.resourceId === event.production.equipment_id))
  .map((event) => ({
    ...event,
    entityId: event.production.equipment_id,
    scheduled_start: dayjs(event.production.scheduled_start),
    scheduled_end: dayjs(event.production.scheduled_end),
  }))
  .filter(
    (event) =>
      event.scheduled_start.isSame(currentDate, 'day') ||
      event.scheduled_end.isSame(currentDate, 'day')
  );

  useEffect(() => {
    console.log('Filtered Events:', filteredEvents);
  }, [filteredEvents]);

  useEffect(() => {
    console.log('Flattened Events:', flattenedEvents);
    console.log('Entities:', entities);
    const filteredEvents = flattenedEvents
      .filter((event) => entities.some((entity) => entity.resourceId === event.production.equipment_id))
      .map((event) => ({
        ...event,
        entityId: event.production.equipment_id,
        scheduled_start: event.scheduled_start,
        scheduled_end: event.scheduled_end,
      }))
      .filter(
        (event) =>
          dayjs(event.scheduled_start).isSame(currentDate, 'day') ||
          dayjs(event.scheduled_end).isSame(currentDate, 'day')
      );
    console.log('Filtered Events:', filteredEvents);
  }, [entities, events]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ width: width, height: height, overflow: 'hidden', border: '1px solid' }}
      >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb={2}
            height="15%"
            width="100%"
            sx={{ border: '1px solid', padding: 2 }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h4" align="center">
                {currentDate.format('DD MMM, YYYY')}
              </Typography>
              <IconButton onClick={handleDateIconClick} sx={{ marginLeft: 1 }}>
                <CalendarTodayIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseDatePicker}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <DatePicker
                  value={currentDate}
                  onChange={(newValue) => {
                    handleDateChange(newValue);
                    handleCloseDatePicker();
                  }}
                  renderInput={({ inputRef, inputProps, InputProps }) => (
                    <Box sx={{ p: 2 }}>
                      <input ref={inputRef} {...inputProps} />
                      {InputProps?.endAdornment}
                    </Box>
                  )}
                />
              </Popover>
            </Box>
            <ButtonGroup variant="contained">
              <Button
                onClick={handlePrevDay}
                startIcon={<ArrowLeftIcon />}
                sx={{ fontSize: '0.7rem', color: 'white', backgroundColor: globalColors.primary }}
              >
                Back
              </Button>
              <Button
                onClick={handleToday}
                sx={{ fontSize: '0.7rem', color: 'white', backgroundColor: globalColors.primary }}
              >
                Today
              </Button>
              <Button
                onClick={handleNextDay}
                endIcon={<ArrowRightIcon />}
                sx={{ fontSize: '0.7rem', color: 'white', backgroundColor: globalColors.primary }}
              >
                Next
              </Button>
            </ButtonGroup>
          </Box>
          <Box height="85%" width="100%" sx={{ border: '1px solid', padding: 1, overflow: 'auto', position: 'relative' }}>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={1}>
              <TimePicker
                label="Start"
                value={start}
                onChange={(newValue) => setStart(dayjs(newValue))}
                sx={{ marginRight: 1, '.MuiInputBase-input': { padding: '4px' }, '.MuiInputLabel-root': { fontSize: '0.8rem' } }}
                slotProps={{ textField: { size: 'small' } }}
              />
              <TimePicker
                label="End"
                value={end}
                onChange={(newValue) => setEnd(dayjs(newValue))}
                sx={{ '.MuiInputBase-input': { padding: '4px' }, '.MuiInputLabel-root': { fontSize: '0.8rem' } }}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
            <Grid container>
              <Grid item sx={{ minWidth: 100, marginRight: '2px' }}>
                <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, padding: 1 }}>
                  <Typography align="center">Time</Typography>
                </Box>
                {intervals.map((interval) => (
                  <Box key={interval} height={30} sx={{ backgroundColor: getBackgroundColor(interval) }}>
                    <Typography>{interval}</Typography>
                  </Box>
                ))}
              </Grid>
              {entities.map((entity) => (
                <Grid
                  key={entity.resourceId}
                  item
                  sx={{ flexGrow: 1, minWidth: 100, marginRight: '2px', position: 'relative', overflow: 'hidden' }}
                >
                  <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, padding: 1 }}>
                    <Typography align="center">{entity.resourceTitle}</Typography>
                  </Box>
                  {intervals.map((interval) => (
                    <Box key={`${entity.resourceId}-${interval}`} height={30} sx={{ backgroundColor: getBackgroundColor(interval) }}>
                      {/* Empty Box */}
                    </Box>
                  ))}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}>
                  {filteredEvents
                    .filter((event) => event.entityId === entity.resourceId)
                    .map((event) => (
                      <EventCard
                      key={event.id}
                      title={event.orderId}
                      description={event.customer}
                      extraField2={event.quantity}
                      scheduled_start={event.scheduled_start}
                      scheduled_end={event.scheduled_end}
                      onClick={() => handleEventClick(event)}
                      sx={{
                        top: `${timeToPosition(event.scheduled_start)}px`,
                        height: `${timeToHeight(event.scheduled_start, event.scheduled_end)}px`,
                        left: 0,
                        right: 0,
                        position: 'absolute',
                        margin: '4px',
                      }}
                    />
                    ))}
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </DragDropContext>
      <EventModal
        event={selectedEvent}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </LocalizationProvider>
  );
};

export default Calendar;