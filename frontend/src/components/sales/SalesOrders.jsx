import React, { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    TextField,
    Autocomplete,
    Stack,
    Fab,
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
    AppBar,
    Toolbar,
    useScrollTrigger,
    Slide,
    TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import { useInventory } from '../../contexts/InventoryContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useCrm } from '../../contexts/CrmContext';
import { globalColors } from '../../constants/Styles';

// Function to control sticky header behavior
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function SalesOrders() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [lineItems, setLineItems] = useState([
        // Initialize with an empty line item
        { id: 1, product: null, quantity: 0 }
    ]);
    const [submitError, setSubmitError] = useState(null);
    const { filteredProductInventory } = useInventory();
    const { customersData, fetchCustomersData } = useCrm();
    const { addOrder, ordersData, fetchOrdersData } = useOrders();
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

    useEffect(() => {
        if (!customersData.length) {
            fetchCustomersData();
        }
    }, [customersData.length, fetchCustomersData]);

    const sortedProducts = filteredProductInventory
        .filter(item => item.basics && item.basics.name)
        .sort((a, b) => a.basics.name.localeCompare(b.basics.name));

    const handleOpenModal = () => {
        setOpenModal(true);
        // Initialize with an empty line item
        setLineItems([{ id: 1, product: null, quantity: 0 }]);
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleCustomerChange = (_, newValue) => {
        setSelectedCustomer(newValue);
        console.log('Selected Customer:', JSON.stringify(newValue, null, 2));
    };

    const handleProductChange = (event, newValue, itemId) => {
        const updatedLineItems = lineItems.map(item => {
            if (item.id === itemId) {
                return { ...item, product: newValue };
            }
            return item;
        });
        setLineItems(updatedLineItems);
    };

    const handleQuantityChange = (event, itemId) => {
        const updatedLineItems = lineItems.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: parseInt(event.target.value, 10) };
            }
            return item;
        });
        setLineItems(updatedLineItems);
    };

    const addLineItem = () => {
        // Generate a unique ID for the new line item
        const newId = lineItems.length + 1;
        setLineItems([
            ...lineItems,
            { id: newId, product: null, quantity: 0 } // Initialize with empty values
        ]);
    };

    const deleteLineItem = (itemId) => {
        setLineItems(lineItems.filter(item => item.id !== itemId));
    };

    const handleFormSubmit = async () => {
        console.log('Submitting order with line items:', lineItems);

        if (!selectedCustomer || !selectedCustomer.name) {
            console.error('Selected customer is invalid:', selectedCustomer);
            setSubmitError('Please select a customer.');
            return;
        }

        const validLineItems = lineItems.filter(
            item => item.product?.basics?.id && item.quantity > 0
        );

        if (validLineItems.length === 0) {
            setSubmitError('Please add at least one valid product and quantity.');
            return;
        }

        const orderData = {
            customer_id: selectedCustomer.id,
            lineItems: validLineItems.map(item => ({
                product_id: item.product.basics.id,
                quantity: item.quantity,
            })),
        };

        try {
            await addOrder(orderData);
            handleCloseModal();
            setSelectedCustomer(null);
            setLineItems([]); // Reset line items after submission
            setSubmitError(null);
            fetchOrdersData(); // Refresh order data after successful submission
        } catch (error) {
            console.error('Error submitting order:', error);
            setSubmitError('Failed to submit order. Please try again.');
        }
    };

    useEffect(() => {
        console.log('Line Items:', lineItems);
    }, [lineItems]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <HideOnScroll {...{ window: () => window }}>
                <AppBar position="fixed" sx={{ background: globalColors.primary }}>
                    <Toolbar>
                        <Typography variant="h6" color="white">
                            Sales Orders
                        </Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Box sx={{ paddingTop: '70px' }}> {/* Add padding to avoid overlap */}
                <Button variant="contained" sx={{ backgroundColor: globalColors.primary, color: 'white', mt: 2 }} onClick={handleOpenModal}>
                    New Order
                </Button>

                <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
                    <TableContainer component={Paper} sx={{maxHeight: '80vh'}}>
                        <Table sx={{ minWidth: 650 }}>
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
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Reorder</TableCell>
                                                <TableCell>Throughput</TableCell>
                                                <TableCell>Qty Ordered</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.item.name}</TableCell>
                                                    <TableCell>{item.item.locations.reduce((total, loc) => total + loc.pivot.quantity, 0)}</TableCell>
                                                    <TableCell>{item.item.locations.reduce((total, loc) => total + loc.pivot.reorder, 0)}</TableCell>
                                                    <TableCell>{item.item.throughput}</TableCell>
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

                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '80vw',
                        height: '80vh',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography variant="h6" component="h2">
                            New Order
                        </Typography>

                        {/* Customer Selection */}
                        {customersData.length > 0 ? (
                            <Autocomplete
                                options={customersData}
                                getOptionLabel={(customer) => customer.name}
                                value={selectedCustomer}
                                onChange={handleCustomerChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Customer"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                )}
                                sx={{ mt: 2 }}
                            />
                        ) : (
                            <Typography variant="body1">Loading customers...</Typography>
                        )}

                        {/* Line Items Table */}
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lineItems.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell sx={{ width: 800 }}>
                                                <Autocomplete
                                                    options={sortedProducts}
                                                    getOptionLabel={(product) => product.basics?.name ?? ''}
                                                    value={item.product}
                                                    onChange={(event, newValue) => handleProductChange(event, newValue, item.id)}
                                                    renderInput={(params) => <TextField {...params} variant="standard" />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(event) => handleQuantityChange(event, item.id)}
                                                    variant="standard"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {index !== 0 && (
                                                    <IconButton onClick={() => deleteLineItem(item.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Add Line Item Button */}
                        <Fab color="primary" aria-label="add" onClick={addLineItem} sx={{ mt: 2 }}>
                            <AddIcon />
                        </Fab>

                        <Box sx={{ flexGrow: 1, mt: 2 }} />

                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            <Button variant="outlined" color="error" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: globalColors.primary, color: 'white' }} onClick={handleFormSubmit}>
                                Submit
                            </Button>
                        </Stack>

                        {submitError && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {submitError}
                            </Typography>
                        )}

                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}

export default SalesOrders;