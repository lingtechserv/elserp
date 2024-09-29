import { Button, TextField, Modal, Table, Popover, Typography, Container, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    supplier_name: '',
    contact_phone: '',
    contact_email: '',
    contact_url: '',
    notes: ''
  });

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/suppliers/all');
      setSuppliers(response.data.suppliers.map((supplier) => ({
        key: supplier.id,
        supplierName: supplier.name,
        contactPhone: supplier.phone,
        contactEmail: supplier.email,
        contactUrl: supplier.url,
        notes: supplier.notes,
      })));
    } catch (error) {
      console.error('There was an error fetching the suppliers data:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const response = await axios.post('/api/suppliers/create', formValues);
      setIsModalVisible(false);
      fetchSuppliers();
    } catch (error) {
      console.error('There was an error creating the supplier:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const columns = [
    {
      title: 'Supplier Name',
      field: 'supplierName',
      sortable: true
    },
    {
      title: 'Contact Phone',
      field: 'contactPhone'
    },
    {
      title: 'Contact Email',
      field: 'contactEmail'
    },
    {
      title: 'Contact URL',
      field: 'contactUrl'
    },
    {
      title: 'Notes',
      field: 'notes',
      render: (rowData) => (
        rowData.notes ? (
          <Popover content={rowData.notes} title="Notes" trigger="click">
            <Button type="link">View Notes</Button>
          </Popover>
        ) : null
      )
    }
  ];

  const filteredSuppliers = suppliers.filter((supplier) => {
    return Object.values(supplier).some((field) =>
      field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <TextField 
          label="Search suppliers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={showModal}>
          Add Supplier
        </Button>
      </Box>
      <Table
        title="Suppliers"
        columns={columns}
        data={filteredSuppliers}
        options={{ sorting: true, search: false }}
      />
      <Modal
        open={isModalVisible}
        onClose={handleCancel}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Container maxWidth="sm">
          <Box mt={5}>
            <Typography variant="h4" gutterBottom id="modal-title">
              Add Supplier
            </Typography>
            <Box component="form" autoComplete="off">
              <Box mb={2}>
                <TextField
                  name="supplier_name"
                  label="Supplier Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formValues.supplier_name}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  name="contact_phone"
                  label="Contact Phone"
                  variant="outlined"
                  fullWidth
                  value={formValues.contact_phone}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  name="contact_email"
                  label="Contact Email"
                  variant="outlined"
                  fullWidth
                  value={formValues.contact_email}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  name="contact_url"
                  label="Contact URL"
                  variant="outlined"
                  fullWidth
                  value={formValues.contact_url}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  name="notes"
                  label="Notes"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={formValues.notes}
                  onChange={handleChange}
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" onClick={handleOk}>
                  Add Supplier
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Modal>
    </Container>
  );
};

export default Suppliers;