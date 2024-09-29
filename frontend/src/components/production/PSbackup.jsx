import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import { Container, TextField, Box, Toolbar, Typography, Paper, Divider } from '@mui/material';
import { globalStyles, globalColors } from '../../constants/Styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useProduction } from '../../contexts/ProductionContext';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = dayjsLocalizer(dayjs);

const ProductionSchedule = () => {
  const { equipmentData, unassignedOrders, fetchUnassignedOrders, scheduleOrder } = useProduction();
  const [events, setEvents] = useState([]);
  const [defaultView, setDefaultView] = useState(Views.DAY);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    fetchUnassignedOrders();
  }, [fetchUnassignedOrders]);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const sortedEquipment = useMemo(() => {
    if (!Array.isArray(equipmentData)) return [];

    const sorted = [...equipmentData].sort((a, b) => {
      if (a.name === 'Out of Office') return 1;
      if (b.name === 'Out of Office') return -1;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [equipmentData]);

  const resourceMap = sortedEquipment.map(equipment => ({
    resourceId: equipment.id,
    resourceTitle: equipment.name,
  }));

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return dayjs().hour(hours).minute(minutes).second(0).millisecond(0).toDate();
  };

  const minTime = parseTime(startTime);
  const maxTime = parseTime(endTime);

  const onEventResize = (data) => {
    const { start, end, event } = data;
    setEvents((prevEvents) =>
      prevEvents.map((evt) => (evt.id === event.id ? { ...evt, start, end } : evt))
    );
  };

  const onEventDrop = async ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const allDay = event.allDay && !droppedOnAllDaySlot ? false : event.allDay;
    setEvents(prevEvents =>
      prevEvents.map(evt => (evt.id === event.id ? { ...evt, start, end, allDay } : evt))
    );
    // Update the backend
    await scheduleOrder({
      order_id: event.id,
      equipment_id: event.resourceId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    });
  };

  const onDropFromUnassigned = async (item, date) => {
    const order = unassignedOrders.find(order => order.id === item.id);
    if (order) {
      const newEvent = {
        id: order.id,
        title: `Order #${order.id}`,
        start: date,
        end: dayjs(date).add(1, 'hour').toDate(), // Default to 1-hour duration
        resourceId: null,
      };
      setEvents([...events, newEvent]);
      // Remove from unassigned
      fetchUnassignedOrders();
    }
  };

  const onDragStart = (event, data) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
  };

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const date = new Date(event.target.getAttribute('data-date'));
    if (date) {
      onDropFromUnassigned(data, date);
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" style={{ ...globalStyles.globalBody, width: '100vw', padding: '1vw', height: 'calc(100vh - 64px)' }}>
      <Toolbar />
      <Box
        marginTop={2}
        display="flex"
        justifyContent="left"
        alignItems="center"
        gap={2}
      >
        <TextField
          id="start-time"
          label="Start Time"
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        <TextField
          id="end-time"
          label="End Time"
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </Box>

      <Box style={{ display: 'flex', width: '100%', alignItems: 'stretch', height: '100%' }}>
        {/* Calendar Section */}
        <Box style={{ width: '70vw', paddingRight: '1vw', height: '100%' }}>
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            defaultView={defaultView}
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            step={15}
            timeslots={1}
            min={minTime}
            max={maxTime}
            resources={resourceMap}
            resourceIdAccessor="resourceId"
            resourceTitleAccessor="resourceTitle"
            style={{ height: '100%', width: '100%' }}
            onEventDrop={onEventDrop}
            resizable
            onEventResize={onEventResize}
            onDrop={onDrop}
            onDragOver={onDragOver}
            components={{
              resourceHeader: ({ label }) => (
                <div
                  style={{
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.8rem', // Smaller font size
                    wordWrap: 'break-word', // Ensure text wraps
                    textAlign: 'center' // Center-align the text
                  }}
                >
                  {label}
                </div>
              )
            }}
          />
        </Box>

        {/* Right Section */}
        <Box style={{ width: '30vw', paddingLeft: '1vw', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Order List */}
          <Paper elevation={3} style={{ flex: 1, padding: '20px', marginBottom: 10, overflow: 'auto' }}>
            <Box
              style={{
                backgroundColor: globalColors.secondary,
                padding: '10px',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Typography
                variant="h6"
                style={{ color: 'white' }}
              >
                Unassigned Orders
              </Typography>
            </Box>
            <Divider />
            {unassignedOrders.map((order) => (
              <Box
                key={order.id}
                draggable
                onDragStart={(e) => onDragStart(e, order)}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginBottom: '5px',
                  cursor: 'grab',
                  borderRadius: '4px',
                  background: '#fff'
                }}
              >
                Order #{order.id}
              </Box>
            ))}
          </Paper>

          {/* Placeholder for the next Section */}
          <Paper elevation={3} style={{ flex: 1, padding: '20px' }}>
            <Box
              style={{
                backgroundColor: globalColors.secondary,
                padding: '10px',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Typography
                variant="h6"
                style={{ color: 'white' }}
              >
                Future Section
              </Typography>
            </Box>
            {/* You can add the next section's content here */}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductionSchedule;