import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Checkbox, FormControl, InputLabel, Select, Container, Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import adminOptions from '../utils/AdminOptions.json';

const AddInventory = ({ onAddItem }) => {
  const [form] = React.useState();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('/api/location').then(response => {
      setLocations(response.data);
    });
  }, []);

  const onFinish = (values) => {
    onAddItem(values);
    form.resetFields();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Add Inventory Item
      </Typography>
      <Box component="form" onSubmit={onFinish} noValidate autoComplete="off">
        <Typography variant="h6" gutterBottom>
          General
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              required
              id="item-name"
              name="item"
              label="Item Name"
              fullWidth
              autoComplete="item"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              required
              id="stock-number"
              name="stockNumber"
              label="Stock #"
              fullWidth
              autoComplete="stock-number"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="standard">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                required
                defaultValue=""
              >
                {adminOptions.inventoryTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Locations
        </Typography>
        {/* Add Form List for Locations */}
        {/* You can use MUI's nested form controls instead */}

        <Typography variant="h6" gutterBottom>
          Suppliers
        </Typography>
        {/* Add Form List for Suppliers */}
        {/* You can use MUI's nested form controls instead */}

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddInventory;