import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { TextField, Box, Button, Typography, Paper, Divider, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { globalColors } from '../../constants/Styles';
import InfoIcon from '@mui/icons-material/Info';
import BasicCalendar from '../calendar/BasicCalendar';
import { useOrders } from '../../contexts/OrdersContext'; 

const ProductionSchedule = () => {
  const { ordersData } = useOrders(); 

  const pendingOrders = useMemo(() => ordersData.filter(order => order.status === 'pending'), [ordersData]);
  const schedulableOrders = useMemo(() => 
    ordersData.filter(order => order.status === 'scheduled' || order.status === 'Scheduled - Flagged'), 
    [ordersData]
  );

  const [events, setEvents] = useState([]);
  const [droppedItems, setDroppedItems] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('20:00');
  const [equipmentData, setEquipmentData] = useState(['Auto Bottler']);
  const [eventsData, setEventsData] = useState([]);

  const resourceMap = useMemo(() => [{
    resourceId: 1,
    resourceTitle: 'Auto Bottler',
  }], []);

  const namesList = [
    { firstName: 'John', lastInitial: 'D.' },
    { firstName: 'Michael', lastInitial: 'S.' },
    { firstName: 'David', lastInitial: 'B.' },
    { firstName: 'James', lastInitial: 'K.' },
    { firstName: 'Robert', lastInitial: 'L.' },
  ];

  const cards = namesList.map((name, index) => ({
    id: `card-${index}`,
    title: `${name.firstName} ${name.lastInitial}`
  }));

  useEffect(() => {
    const transformedEvents = schedulableOrders.map(order => ({
      id: order.id,
      orderId: order.id,
      customer: order.customer.name, 
      createdDate: order.created_at, 
      quantity: order.items[0]?.quantity || 0,
      production: { 
        equipment_id: 1, 
        scheduled_start: order.schedule.schedule_start,
        scheduled_end: order.schedule.schedule_end,
      },
    }));
    setEventsData(transformedEvents);
  }, [schedulableOrders]); 
  

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const roundUpTo15Minutes = (minutes) => Math.ceil(minutes / 15) * 15;

  const addBusinessDays = (date, days) => {
    let result = new Date(date);
    let count = 0;
    while (count < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        count++;
      }
    }
    return result;
  };
  
  const setTime = (date, hours, minutes) => {
    let result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  };
  
  const addMinutesConsideringBusinessHours = (start, minutes) => {
    let result = new Date(start);
    while (minutes > 0) {
      if (result.getHours() >= 17) {
        result = addBusinessDays(result, 1);
        result = setTime(result, 7, 0);
      } else if (result.getHours() < 7) {
        result = setTime(result, 7, 0);
      } else {
        let remainingMinutesToday = Math.min(minutes, (17 - result.getHours()) * 60 - result.getMinutes());
        result.setMinutes(result.getMinutes() + remainingMinutesToday);
        minutes -= remainingMinutesToday;
        if (result.getHours() >= 17) {
          result = addBusinessDays(result, 1);
          result = setTime(result, 7, 0);
        }
      }
    }
    return result;
  };

  return (
    <Box 
      sx={{ 
        width: '100vw', 
        height: 'calc(97vh - 64px)', 
        display: 'flex', 
        boxSizing: 'border-box',
      }}
    >
      <Box 
        sx={{
          width: 'calc(70vw - 1vw - 1vw - 1vw)',
          marginRight: '1vw',
        }}
      >
        <BasicCalendar events={eventsData} entities={resourceMap} />
      </Box>
      <Box 
        sx={{
          width: '30vw',
        }}
      >
        <Paper elevation={3} style={{ flex: 1, paddingBottom: '10px', marginBottom: 10, overflow: 'auto', height: '40vh', marginTop: '8px' }}>
        <Box
          style={{
            backgroundColor: globalColors.primary,
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
        <TableContainer sx={{ maxHeight: 'calc(40vh - 64px)' }}>
          <Table stickyHeader aria-label="pending-orders-table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                  {pendingOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer?.name || "N/A"}</TableCell> 
                      <TableCell>{order.createdDate}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleOpenModal(order)}>Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
          </Table>
        </TableContainer>
      </Paper>

        <Paper elevation={3} style={{ flex: 1, paddingBottom: '20px', height: '50vh' }}>
          <Box sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          </Box>
        </Paper>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="order-details-title"
        aria-describedby="order-details-description"
      >
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography id="order-details-title" variant="h6" component="h2">
            Order Details
          </Typography>
          <Typography id="order-details-description" sx={{ mt: 2 }}>
            {selectedOrder ? `Details of order ${selectedOrder.id}` : 'No order selected'}
          </Typography>
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default ProductionSchedule;