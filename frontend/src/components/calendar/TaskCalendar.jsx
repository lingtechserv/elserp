import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Fab, Zoom, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTasks } from '../../contexts/TasksContext';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

const locales = {
  // Add your desired locales if needed
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TaskCalendar = () => {
  const { tasksData, fetchTasksData, addTask } = useTasks();
  const { authData } = useAuth(); // Get authData from AuthContext
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: dayjs(),
    end: dayjs(),
  });
  const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  useEffect(() => {
    console.log('Tasks:', tasksData);
  }, [authData]);

  useEffect(() => {
    // Map tasksData to events format
    const formattedEvents = tasksData.map(task => ({
      id: task.id, // Include ID to distinguish events
      title: task.title,
      start: new Date(task.start_date),
      end: new Date(task.end_date),
    }));
    setEvents(formattedEvents);
  }, [tasksData]);

  const handleSelectSlot = (slotInfo) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setSelectedEvent(null); // Ensure no event is selected when creating a new one
    setOpenDialog(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleTitleChange = (event) => {
    setNewEvent({
      ...newEvent,
      title: event.target.value,
    });
  };

  const handleStartTimeChange = (newValue) => {
    setNewEvent({
      ...newEvent,
      start: dayjs(newValue), // Convert to Day.js
    });
  };

  const handleEndTimeChange = (newValue) => {
    setNewEvent({
      ...newEvent,
      end: dayjs(newValue), // Convert to Day.js
    });
  };

  const handleAddEvent = async () => {
    const payload = {
      title: newEvent.title,
      start_date: newEvent.start.toISOString(),
      end_date: newEvent.end.toISOString(),
      user_id: authData.user.id, // Include user_id from authData
    };

    try {
      await addTask(payload);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick} // Add event click handler
          style={{ height: 500 }}
        />

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            setSelectedEvent(null); // Ensure no event is selected when clicking the FAB
            setOpenDialog(true);
          }}
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 1 // Ensure Fab is on top
          }}
          TransitionComponent={Zoom} // Add a zoom transition
        >
          <AddIcon />
        </Fab>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedEvent ? 'Event Details' : 'Add New Task'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              {selectedEvent ? (
                <>
                  <TextField
                    label="Title"
                    fullWidth
                    value={selectedEvent.title}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Start Date/Time"
                    fullWidth
                    value={selectedEvent.start.toLocaleString()}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="End Date/Time"
                    fullWidth
                    value={selectedEvent.end.toLocaleString()}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={newEvent.title}
                    onChange={handleTitleChange}
                  />
                  <DateTimePicker
                    label="Start Date/Time"
                    value={newEvent.start}
                    onChange={handleStartTimeChange}
                    slotProps={{ textField: { variant: 'outlined' } }}
                  />
                  <DateTimePicker
                    label="End Date/Time"
                    value={newEvent.end}
                    onChange={handleEndTimeChange}
                    slotProps={{ textField: { variant: 'outlined' } }}
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            {!selectedEvent && <Button onClick={handleAddEvent}>Add</Button>}
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default TaskCalendar;
