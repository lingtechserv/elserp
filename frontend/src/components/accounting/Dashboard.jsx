import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Stack, Chip, Divider, Button, TextField, Autocomplete, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { globalColors } from '../../constants/Styles';
import SummaryCard from './components/dashboard/SummaryCard';
import PreviewCard from './components/dashboard/PreviewCard';
import CustomerPreviewCard from './components/dashboard/CustomerPreviewCard';

const DashboardModule = () => {
  const invoiceResult = { total: 15000, total_undue: 5000, performance: [{ status: 'paid', percentage: 60 }, { status: 'unpaid', percentage: 40 }] };
  const quoteResult = { total: 8000, performance: [{ status: 'accepted', percentage: 75 }, { status: 'pending', percentage: 25 }] };
  const offerResult = { total: 12000, performance: [{ status: 'sent', percentage: 50 }, { status: 'draft', percentage: 50 }] };
  const clientResult = { active: 25, new: 5 };

  const invoiceLoading = false;
  const quoteLoading = false;
  const offerLoading = false;
  const clientLoading = false;

  const moneyFormatter = ({ amount, currency_code }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency_code,
    }).format(amount);
  };

  const tagColor = (status) => {
    const colors = {
      paid: { color: 'green' },
      unpaid: { color: 'red' },
      accepted: { color: 'green' },
      pending: { color: 'orange' },
    };
    return colors[status] || { color: 'default' }; 
  };

  const dataTableColumns = [
    { field: 'number', headerName: 'Number', width: 150 },
    {
      field: 'clientName', 
      headerName: 'Client',
      width: 200,
      valueGetter: (params) => params.row.client.name, 
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 150,
      type: 'number',
      valueFormatter: (params) => {
        return moneyFormatter({
          amount: params.value,
          currency_code: params.row.currency, 
        });
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const statusColor = tagColor(params.value).color; 
        return <Chip label={params.value} color={statusColor} />;
      },
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: 'Invoices',
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: 'Quotes',
    },
    {
      result: offerResult,
      isLoading: offerLoading,
      entity: 'offer',
      title: 'Offers',
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  const [companies, setCompanies] = useState([
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
    // ... more companies
  ]);

  const [selectedCompany, setSelectedCompany] = useState(companies[0]); // Start with the first company
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  useEffect(() => {
    // Simulate fetching companies (replace with your actual data fetch logic)
    // const fetchedCompanies = [
    //   { id: 1, name: 'Company A' },
    //   { id: 2, name: 'Company B' },
    // ];
    // setCompanies(fetchedCompanies);
  }, []);

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
  };

  const handleAddCompany = () => {
    setShowAddCompanyModal(true);
  };

  const handleCloseAddCompanyModal = () => {
    setShowAddCompanyModal(false);
  };

  const handleSaveCompany = () => {
    const newCompany = {
      id: Date.now(), // Generate a temporary ID
      name: newCompanyName,
    };
    setCompanies([...companies, newCompany]);
    setNewCompanyName('');
    handleCloseAddCompanyModal();
  };

  return (
    <>
      <Grid container spacing={3} sx={{ border: '1px solid black' }}>
        {/* Company Selection */}
        <Grid item xs={12} md={6} sx={{ border: '1px solid black' }}>
          <Autocomplete
            disablePortal
            options={companies}
            getOptionLabel={(option) => option.name}
            value={selectedCompany}
            onChange={handleCompanyChange}
            renderInput={(params) => (
              <TextField {...params} label="Select Company" />
            )}
          />
        </Grid>

        {/* Add New Company Button */}
        <Grid item xs={12} md={6} sx={{ border: '1px solid black' }}>
          <Button variant="contained" onClick={handleAddCompany}>
            Add New Company
          </Button>
        </Grid>

        {/* Add Company Modal */}
        {showAddCompanyModal && (
          <div>
            <FormControl fullWidth>
              <InputLabel id="company-select-label">Company Name</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.name}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSaveCompany}>Save</Button>
            <Button variant="contained" onClick={handleCloseAddCompanyModal}>Cancel</Button>
          </div>
        )}

        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3} sx={{ border: '1px solid black' }}>
          <SummaryCard
            title="Invoices"
            tagColor={'cyan'}
            prefix="This month"
            isLoading={invoiceLoading}
            data={invoiceResult?.total}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ border: '1px solid black' }}>
          <SummaryCard
            title="Proforma Invoices"
            tagColor={'purple'}
            prefix="This month"
            isLoading={quoteLoading}
            data={quoteResult?.total}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ border: '1px solid black' }}>
          <SummaryCard
            title="Offers"
            tagColor={'green'}
            prefix="This month"
            isLoading={offerLoading}
            data={offerResult?.total}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ border: '1px solid black' }}>
          <SummaryCard
            title="Unpaid"
            tagColor={'red'}
            prefix="Not Paid"
            isLoading={invoiceLoading}
            data={invoiceResult?.total_undue}
          />
        </Grid>

        {/* Preview Cards */}
        <Box sx={{ my: 3, border: '1px solid black' }}>
          <Grid container spacing={3} sx={{ border: '1px solid black' }}>
            <Grid item xs={12} md={9} sx={{ border: '1px solid black' }}>
              <Stack direction="row" spacing={2} sx={{ border: '1px solid black' }}>
                {statisticCards}
              </Stack>
            </Grid>

            {/* Customer Preview Card */}
            <Grid item xs={12} md={3} sx={{ border: '1px solid black' }}>
              <CustomerPreviewCard
                isLoading={clientLoading}
                activeCustomer={clientResult?.active}
                newCustomer={clientResult?.new}
              />
            </Grid>
          </Grid>
        </Box>

        {/* DataGrids */}
        <Grid container spacing={3} sx={{ border: '1px solid black' }}>
          <Grid item xs={12} md={6} sx={{ border: '1px solid black' }}>
            <Paper elevation={3} sx={{ p: 2, border: '1px solid black' }}>
              <Typography variant="h6" gutterBottom>
                Recent Invoices
              </Typography>
              <DataGrid rows={[]} columns={dataTableColumns} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ border: '1px solid black' }}>
            <Paper elevation={3} sx={{ p: 2, border: '1px solid black' }}>
              <Typography variant="h6" gutterBottom>
                Recent Quotes
              </Typography>
              <DataGrid rows={[]} columns={dataTableColumns} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardModule;