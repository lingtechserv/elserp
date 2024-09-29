// Calendar.jsx
import React from 'react';
import { Grid, Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Timeline from './Timeline';
import { DragDropContext } from 'react-beautiful-dnd';

const INTERVAL_OPTIONS = [60, 12, 10, 6, 4, 2, 1];

const Calendar = ({
  resolution = 4,
  startTime,
  endTime,
  entities,
  aspect = 'vertical',
  width = '100%',
  height = 'auto',
  showDate
}) => {
  if (!INTERVAL_OPTIONS.includes(resolution)) {
    console.error('Invalid resolution, must be one of:', INTERVAL_OPTIONS);
    return null;
  }

  const [currentDate, setCurrentDate] = React.useState(dayjs(showDate));
  const start = currentDate.hour(startTime.split(':')[0]).minute(startTime.split(':')[1]);
  const end = currentDate.hour(endTime.split(':')[0]).minute(endTime.split(':')[1]);
  const intervalMinutes = 60 / resolution; // Calculate interval in minutes
  const intervals = [];

  let current = start;
  while (current.isBefore(end)) {
    intervals.push(current.format('HH:mm'));
    current = current.add(intervalMinutes, 'minute');
  }

  const onDragEnd = (result) => {
    // Add your drag end logic here
  };

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => prevDate.add(1, 'day'));
  };

  return (
    <Box sx={{ width: width, height: height, overflow: 'hidden' }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button onClick={handlePrevDay}>Previous Day</Button>
        <Typography variant="h3">{currentDate.format('YYYY-MM-DD')}</Typography>
        <Button onClick={handleNextDay}>Next Day</Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${entities.length + 1}, 1fr)`, height: 'calc(100% - 64px)' }}>
          <Box sx={{ position: 'sticky', top: 0, gridColumn: 'span', display: 'grid', gridTemplateColumns: `repeat(${entities.length + 1}, 1fr)`, backgroundColor: 'white', zIndex: 1 }}>
            <Box />
            {entities.map((entity, index) => (
              <Box key={index} sx={{ textAlign: 'center', borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>
                <Typography variant="h6">{entity}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ overflowY: 'scroll', height: '100%', display: 'grid', gridTemplateColumns: `repeat(${entities.length + 1}, 1fr)` }}>
            <Box sx={{ borderRight: '1px solid lightgrey' }}>
              {intervals.map((interval, index) => (
                <Box
                  key={index}
                  sx={{
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '8px',
                    borderBottom: '1px solid lightgrey',
                    typography: interval.endsWith('00') ? 'h6' : 'body2'
                  }}
                >
                  {interval}
                </Box>
              ))}
            </Box>
            {entities.map((_, entityIndex) => (
              <Box key={entityIndex} sx={{ borderRight: '1px solid lightgrey' }}>
                <Timeline entity={entityIndex} intervals={intervals} aspect={aspect} />
              </Box>
            ))}
          </Box>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default Calendar;