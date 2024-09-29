import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
  Button,
  TextField,
  Drawer,
  AppBar,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCustomerModal from '../sales/AddCustomerModal';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AccountingSuppliers from './components/customers/AccountingSuppliers';
import AccountingCustomers  from './components/customers/AccountingCustomers';
import { globalColors } from '../../constants/Styles';

const drawerWidth = 335;

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Customer', 
  });
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const initialContacts = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', type: 'Customer' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210', type: 'Supplier' },
      { id: 3, name: 'ABC Corp', email: 'abc@example.com', phone: '555-1212', type: 'Supplier' },
    ];
    setContacts(initialContacts);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddContact = () => {
    setShowAddCustomerModal(true);
  };

  const handleCloseAddCustomerModal = () => {
    setShowAddCustomerModal(false);
  };

  const handleSaveContact = () => {
    const newId = Date.now(); 
    const newContactWithId = { ...newContact, id: newId };
    setContacts([...contacts, newContactWithId]);
    setNewContact({ name: '', email: '', phone: '', type: 'Customer' });
    handleCloseAddCustomerModal();
  };

  const filteredContacts = contacts.filter((contact) => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
           (selectedFilter === 'All' || contact.type === selectedFilter);
  });

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Apply styles directly to the Toolbar */}
        <Toolbar style={{ backgroundColor: '#007bff', color: 'white' }}> 
          <Typography variant="h6" noWrap component="div">
            CRM
          </Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ padding: 2 }}> 
        <ButtonGroup variant="contained" aria-label="outlined primary button group" fullWidth>
            <Button 
              sx={{ 
                backgroundColor: selectedFilter === 'Customer' ? globalColors.primaryDark : globalColors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: globalColors.primaryDark, 
                },
              }} 
              onClick={() => setSelectedFilter('Customer')}
            >
              Customers
            </Button>
            <Button 
              sx={{ 
                backgroundColor: selectedFilter === 'All' ? globalColors.primaryDark : globalColors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: globalColors.primaryDark,
                },
              }}
              onClick={() => setSelectedFilter('All')}
            >
              All
            </Button>
            <Button 
              sx={{ 
                backgroundColor: selectedFilter === 'Supplier' ? globalColors.primaryDark : globalColors.primary, 
                color: 'white',
                '&:hover': {
                  backgroundColor: globalColors.primaryDark, 
                },
              }} 
              onClick={() => setSelectedFilter('Supplier')}
            >
              Suppliers
            </Button>
          </ButtonGroup>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Box>
        <Divider />
        <List>
          {filteredContacts.map((contact) => (
            <ListItem 
              key={contact.id} 
              button 
              onClick={() => setSelectedContact(contact)}
              sx={{
                backgroundColor: selectedContact && contact.id === selectedContact.id ? globalColors.primaryLight : 'transparent',
                '&:hover': {
                  backgroundColor: globalColors.primaryLight, 
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedContact && contact.id === selectedContact.id ? 'white' : 'inherit'}}>
                {contact.type === 'Supplier' ? (
                  <LocalShippingRoundedIcon />
                ) : contact.type === 'Customer' ? (
                  <StorefrontOutlinedIcon />
                ) : (
                  <LocationOnIcon />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={
                    <Typography 
                      sx={{ 
                        color: selectedContact && contact.id === selectedContact.id ? 'white' : 'inherit'
                      }}
                    >
                      {contact.name}
                    </Typography>
                  } 
                secondary={
                  <Typography 
                    sx={{ 
                      color: selectedContact && contact.id === selectedContact.id ? 'white' : 'inherit'
                    }}
                  >
                    {contact.email} 
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ marginTop: 64, marginLeft: drawerWidth }}> {/* Add margin directly */}
        {/* Content for the main area */}
        <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5', height: '92.5vh' }}>
          {/* Display selected contact details or add contact form */}
          {selectedContact ? (
            selectedContact.type === 'Customer' ? (
              <AccountingCustomers contact={selectedContact} />
            ) : (
              <AccountingSuppliers contact={selectedContact} />
            )
          ) : (
            <Button variant="contained" onClick={handleAddContact}>
              Add Contact
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Contacts;