import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import dayjs from 'dayjs';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';
import { globalColors } from '../../constants/Styles';
import { useOrders } from '../../contexts/OrdersContext';

const EventModal = ({ event, open, onClose }) => {
  if (!event) return null;
  const { ordersData } = useOrders();

  const orderDetails = ordersData.find(order => order.id === event.orderId);
  const schedule = orderDetails.schedule; 

  const startDateTime = dayjs(event.scheduled_start);
  const endDateTime = dayjs(event.scheduled_end);

  const handleStart = async () => {
    try {
      const response = await axios.post('/api/production/update-times', {
        schedule_id: schedule.id,
        start_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
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
    } catch (error) {
      console.error('Error updating end time:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={{ backgroundColor: globalColors.primary, color: 'white' }}>
        {event.title} 
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {event.description} (Order ID: {event.orderId})
            </Typography>
            <Divider />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">
              Start Time: {startDateTime.format('dddd, MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              End Time: {endDateTime.format('dddd, MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">Quantity: {event.quantity}</Typography>
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Reorder</TableCell>
                    <TableCell align="right">Throughput</TableCell>
                    <TableCell align="right">Ordered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item.sku}</TableCell>
                      <TableCell>{item.item.name}</TableCell>
                      <TableCell align="right">{item.item.locations.reduce((total, loc) => total + loc.pivot.quantity, 0)}</TableCell>
                      <TableCell align="right">{item.item.locations.reduce((total, loc) => total + loc.pivot.reorder, 0)}</TableCell>
                      <TableCell align="right">{item.item.throughput}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

        </Grid>
        {schedule && (
          <IconButton onClick={schedule.start_time ? handleEnd : handleStart}>
            {schedule.start_time ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;