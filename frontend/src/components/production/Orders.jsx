import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  IconButton,
  Box,
  Typography,
  Divider,
  TablePagination
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useOrders } from '../../contexts/OrdersContext';
import dayjs from 'dayjs'; 

const Orders = () => {
  const { ordersData } = useOrders();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDrawerOpen = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <TableContainer component={Paper} sx={{maxHeight: '80vh'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDrawerOpen(order)}>
                        <ChevronRightIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ordersData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: '30vw', padding: 2, height: 'calc(100% - 50px)', marginTop: '50px' }}>
          {/* Access selectedOrder here */}
          {selectedOrder && (
            <>
              <Typography variant="h6">
                Order #{selectedOrder.id} - {selectedOrder.customer.name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>
                Scheduled: {selectedOrder.schedule ? dayjs(selectedOrder.schedule.schedule_start).format('YYYY-MM-DD') : 'N/A'}
              </Typography>
              <Typography>
                Created: {dayjs(selectedOrder.created_at).format('YYYY-MM-DD')}
              </Typography>
              <Typography variant="h6">Ingredients</Typography>
              <Divider sx={{ my: 2 }} />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Reorder</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.item.sku}</TableCell>
                        <TableCell>{item.item.name}</TableCell>
                        <TableCell>{item.item.locations.reduce((total, loc) => total + loc.pivot.quantity, 0)}</TableCell>
                        <TableCell>{item.item.locations.reduce((total, loc) => total + loc.pivot.reorder, 0)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Orders;