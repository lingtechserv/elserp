import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  Autocomplete,
  TextField
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import { globalColors } from '../../../../constants/Styles';
import AddCustomerModal from '../../../sales/AddCustomerModal';
import { useCrm } from '../../../../contexts/CrmContext';

const CrmContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  height: '92.5vh'
}));

const AccountingCustomers = () => {
  const [openModal, setOpenModal] = useState(false);
  const { customersData, fetchCustomersData, getFilteredCustomers } = useCrm();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Fetch customers data on initial mount
    if (customersData.length === 0) {
      fetchCustomersData();
    }
  }, [customersData, fetchCustomersData]);

  // Function to handle selecting a customer
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddCustomer = (newCustomer) => {
    // Implement adding customer logic here (if needed)
    console.log('Adding customer:', newCustomer);
    handleCloseModal(); // Close modal after adding customer
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <CrmContainer>
      {/* Autocomplete Dropdown (updated to use name instead of companyName) */}
      <Autocomplete
        options={customersData}
        getOptionLabel={(customer) => customer.name} 
        value={selectedCustomer}
        onChange={(event, newValue) => setSelectedCustomer(newValue)}
        onInputChange={(event, newInputValue) => {
          setSelectedCustomer(getFilteredCustomers(newInputValue)[0] || null);
        }}
        renderInput={(params) => <TextField {...params} label="Search Customers" />}
      />

      {/* Display customer data (only if a customer is selected) */}
      {selectedCustomer && (
        <>
          <Typography variant="h2" gutterBottom>
            {selectedCustomer.name} 
          </Typography>

          {/* Map data to their respective spots */}
          <Grid container spacing={3}>
            {/* Addresses (updated to use addresses array) */}
            <Grid item xs={12} md={6}>
              <Box marginBottom={2}>
                <Typography variant="h5">Addresses</Typography>
                <Divider />
              </Box>
              <Grid container spacing={2}>
                {selectedCustomer.addresses.map((address, index) => (
                  <>
                    <Grid item xs={1}>
                      <LocationOnIcon style={{ fontSize: '1.5rem', color: globalColors.secondary }} />
                    </Grid>
                    <Grid item xs={11}>
                      <Typography variant="subtitle1">{address.Type} Address:</Typography>
                      <Typography>{address.AddressLine1}</Typography> 
                    </Grid>
                  </>
                ))}
              </Grid>
            </Grid>

            {/* Account Info (updated to use accountNumber) */}
            <Grid item xs={12} md={6}>
    <Box marginBottom={2}>
      <Typography variant="h5">Account Info</Typography>
      <Divider />
    </Box>
    <Typography variant="subtitle1">Account Number: {selectedCustomer.accountNumber}</Typography>
    <Typography>Credit: {selectedCustomer.credit || "Not Established"}</Typography> 
            </Grid>
          </Grid>

          {/* Contacts (updated to use contacts array) */}
          <Box marginTop={3}>
  <Typography variant="h5">Contacts</Typography>
  <Divider />
  <List>
    {selectedCustomer.contacts.map((contact) => (
      <ListItem key={contact.id} sx={{ paddingY: 2 }}>
        <ListItemText
          primary={`${contact.firstName} ${contact.lastName || ''}`}
          secondary={
            <>
              {contact.email && (
                <>
                  <EmailIcon style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: 4, color: globalColors.secondary }} />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Email: {contact.email}
                  </Typography>
                  <br />
                </>
              )}
              {contact.phone && (
                <>
                  <PhoneIcon style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: 4, color: globalColors.secondary }} />
                  Phone: {contact.phone}
                </>
              )}
            </>
          }
        />
      </ListItem>
    ))}
  </List>
</Box>
        </>
      )}

      {/* Add new customer button */}
      <IconButton
        sx={{ position: 'fixed', bottom: 16, right: 16, bgcolor: globalColors.primary, color: 'white' }}
        onClick={() => setOpenModal(true)}
      >
        <AddCircleOutlineIcon fontSize="large" />
      </IconButton>

      {/* Modal for adding a new customer */}
      <AddCustomerModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddCustomer}
      />
    </CrmContainer>
  );
};

export default AccountingCustomers;
