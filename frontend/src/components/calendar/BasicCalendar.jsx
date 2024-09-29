import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar'

const BasicCalendar = ({ events, entities }) => {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('90vh');
  const [showDate, setShowDate] = useState(dayjs());

  return (
    <Box padding="10px">
      <Calendar
        resolution={4}
        startTime={startTime}
        endTime={endTime}
        entities={entities}
        events={events}
        width={width}
        height={height}
        showDate={showDate}
      />
    </Box>
  );
};

export default BasicCalendar;
