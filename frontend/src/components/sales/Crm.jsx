import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Divider,
  Modal
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { globalColors } from '../../constants/Styles';
import FormDisplay from '../utils/FormDisplay'; // Ensure this is the correct import path
import FormFiller from '../utils/FormFiller'; // Ensure this is the correct import path
import { useAdmin } from '../../contexts/AdminContext'; // Import the useAdmin hook
import { useForm } from '../../contexts/FormContext'; // Import the useForm hook

const CrmContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '92.5vh',
  backgroundColor: '#f5f5f5',
  overflow: 'hidden' // Prevent overflow
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: '300px',
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRight: `1px solid ${theme.palette.divider}`,
  overflowY: 'auto'
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  overflowY: 'auto'
}));

const Crm = () => {
  const [openModal, setOpenModal] = useState(false);
  const { completedForms, createCompletedForm } = useAdmin();
  const { forms } = useForm();
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formConfig, setFormConfig] = useState(null);

  useEffect(() => {
    const customerForms = completedForms.filter(form => form.type === 'Customer');
    setFilteredCustomers(customerForms);
  }, [completedForms]);

  useEffect(() => {
    const filtered = completedForms.filter(customer =>
      customer.config.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.config.name.localeCompare(b.config.name));
    setFilteredCustomers(filtered);
  }, [searchTerm, completedForms]);

  useEffect(() => {
    const adminSettings = JSON.parse(localStorage.getItem('adminSettings')) || [];
    const salesSettings = adminSettings.find(setting => setting.module === 'Sales');

    if (salesSettings) {
      const selectedFormId = JSON.parse(salesSettings.settings).selectedForm;
      const selectedFormConfig = forms.find(form => form.id === selectedFormId);
      if (selectedFormConfig) {
        setFormConfig(selectedFormConfig.config);
        console.log('Using form config:', selectedFormConfig.config); // Log the form config
      }
    }
  }, [forms]);

  useEffect(() => {
    console.log('Form config:', formConfig);
  }, [formConfig]);


  const handleAddCustomer = async (formData) => {
    const newCustomer = {
      type: 'Customer',
      config: formData
    };
    await createCompletedForm(newCustomer);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <CrmContainer>
      <Sidebar>
        <TextField
          label="Search Customers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <List>
          {filteredCustomers.map((customer) => (
            <ListItem 
              key={customer.id} 
              button 
              onClick={() => setSelectedCustomer(customer)}
              selected={selectedCustomer && selectedCustomer.id === customer.id}
            >
              <ListItemText primary={customer.config.name} />
            </ListItem>
          ))}
        </List>
        <IconButton
          sx={{ position: 'fixed', bottom: 16, left: 16, bgcolor: globalColors.primary, color: 'white' }}
          onClick={() => setOpenModal(true)}
        >
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
      </Sidebar>
      <ContentArea>
        {selectedCustomer ? (
          <>
            <Typography variant="h2" gutterBottom>
              {selectedCustomer.config.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormDisplay formConfig={selectedCustomer.config} />
          </>
        ) : (
          <Typography variant="h4" color="textSecondary">
            Select a customer to view their details
          </Typography>
        )}
      </ContentArea>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          position: 'relative',
          width: '90vw',
          height: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflow: 'hidden',
        }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Customer</Typography>
          <FormFiller config={formConfig} onSubmit={handleAddCustomer} />
        </Box>
      </Modal>
    </CrmContainer>
  );
};

export default Crm;
