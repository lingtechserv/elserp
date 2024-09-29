import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';

const EventCard = ({ 
  title, 
  description, 
  extraField1, 
  extraField2, 
  scheduled_end, 
  scheduled_start, 
  sx = {}, 
  onClick,
  schedule, 
  onTimeUpdate, 
}) => {
  const formattedStartTime = dayjs(scheduled_start).format('h:mm A');
  const formattedEndTime = dayjs(scheduled_end).format('h:mm A');

  const handleStart = async () => {
    try {
      const response = await axios.post('/api/production/update-times', {
        schedule_id: schedule.id,
        start_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      onTimeUpdate(response.data); 
    } catch (error) {
      console.error('Error updating start time:', error);
    }
  };

  const handleEnd = async () => {
    try {
      const response = await axios.post('/api/production/update-times', {
        schedule_id: schedule.id,
        end_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      onTimeUpdate(response.data);
    } catch (error) {
      console.error('Error updating end time:', error);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        backgroundColor: '#fff',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        overflowY: 'hidden',
        margin: '4px',
        cursor: 'pointer',
        ...sx,
      }}
      onClick={onClick}
    >
      {description && (
        <Box sx={{ marginBottom: '0px' }}>
          <Typography variant="subtitle1">
            {`${description} - ${title}`}
          </Typography>
        </Box>
      )}

      <Box sx={{ marginBottom: '0px' }}>
        <Typography variant="body2">
          {`${formattedStartTime} to ${formattedEndTime}`}
        </Typography>
      </Box>

      {(extraField1 || extraField2) && (
        <Box display="flex" justifyContent="space-between">
          {extraField1 && <Typography variant="body2">{extraField1}</Typography>}
          {extraField2 && <Typography variant="body2">{extraField2}</Typography>}
        </Box>
      )}
    </Box>
  );
};

export default EventCard;