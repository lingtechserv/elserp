import React from 'react';
import { Paper } from '@mui/material';

const Event = ({ interval }) => {
  return (
    <Paper sx={{ padding: 1, margin: 1, backgroundColor: 'lightblue' }}>
      <span>{interval}</span>
    </Paper>
  );
};

export default Event;