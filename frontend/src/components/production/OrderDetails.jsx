import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Divider, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import dayjs from 'dayjs';
import { ProductionScheduleContext } from '../../contexts/ProductionScheduleContext';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const OrderDetails = ({ orderDetails }) => {
  const { ingredients } = useContext(ProductionScheduleContext);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log('Selected Order Details:', orderDetails); // Debug: Log the selected order details
  }, [orderDetails]);

  if (!orderDetails) {
    return <Typography variant="h6">No Order Details Available</Typography>;
  }

  const title = `Order #${orderDetails.basics?.id ?? 'N/A'} - ${orderDetails.basics?.customer ?? 'N/A'}`;
  const createdDate = orderDetails.basics?.created_date ? dayjs(orderDetails.basics.created_date).format('D MMMM, YYYY') : 'N/A';

  const ingredientsDetails = orderDetails.ingredients?.map(({ id, quantity }) => ({
    ...ingredients[id],
    quantity
  }));

  return (
    <Box sx={{ width: '30vw', padding: 2, height: 'calc(100% - 50px)', marginTop: '42px' }}>
      <Typography variant="h6">{title}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography>Scheduled: {orderDetails.production?.scheduled_start ? dayjs(orderDetails.production.scheduled_start).format('YYYY-MM-DD') : 'N/A'}</Typography>
      <Typography>Created: {createdDate}</Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Typography variant="h6">Ingredients</Typography>
          <Divider sx={{ my: 2 }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Reorder</TableCell>
                  <TableCell>Tag 1</TableCell>
                  <TableCell>Tag 2</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredientsDetails?.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>{ingredient.sku}</TableCell>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.quantity}</TableCell>
                    <TableCell>{ingredient.stock_quantity}</TableCell>
                    <TableCell>{ingredient.reorder_quantity}</TableCell>
                    <TableCell>{ingredient.tag1}</TableCell>
                    <TableCell>{ingredient.tag2}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

OrderDetails.propTypes = {
  orderDetails: PropTypes.object.isRequired,
};

export default OrderDetails;
