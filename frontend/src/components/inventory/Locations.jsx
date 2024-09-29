import { Button, Input, Table, Tabs, Modal, Typography, Container, Box, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LocationBuilder from './LocationBuilder';
import { useLocations } from '../../contexts/LocationsContext';

const Locations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationBuilderVisible, setIsLocationBuilderVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState({ message: '', severity: 'success' });
  const { locations, sections, rows, shelves, bins, fetchLocations } = useLocations();

  useEffect(() => {
    console.log('Locations:', locations);
  }, [locations]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      filters: [...new Set(locations.map(item => item.type))].map(type => ({
        text: type,
        value: type,
      })),
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
  ];

  const rowColumns = [
    { title: 'Row Number', dataIndex: 'name', key: 'name' },
  ];

  const binColumns = [
    { title: 'Bin Name', dataIndex: 'name', key: 'name' },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    { 
      title: 'Item', 
      key: 'item',
      sorter: (a, b) => a.type.localeCompare(b.type), 
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
    },
    {
      title: 'Minimum Quantity',
      dataIndex: 'minimumQuantity',
      key: 'minimumQuantity',
    },
  ];

  const expandedRowRenderForRows = (rowRecord) => {
    const matchingShelves = shelves.filter(shelf => shelf.parentlocationid === rowRecord.id);

    if (matchingShelves.length === 0) {
        return <Typography>No shelves available</Typography>;
    }

    return (
        <Tabs>
            {matchingShelves.map(shelf => (
                <Tab label={shelf.name} key={shelf.id}>
                    <Table
                        columns={binColumns}
                        dataSource={bins.filter(bin => bin.parentlocationid === shelf.id)}
                        pagination={false}
                        size="small"
                    />
                </Tab>
            ))}
        </Tabs>
    );
  };

  const rowTableConfig = {
    columns: rowColumns,
    pagination: false,
    size: "small",
    expandable: {
        expandedRowRender: expandedRowRenderForRows,
        rowExpandable: rowRecord => shelves.some(shelf => shelf.parentlocationid === rowRecord.id)
    }
  };

  const retailVendorColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sorter: (a, b) => a.product.localeCompare(b.product),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
    },
    {
      title: 'Minimum Quantity',
      dataIndex: 'minimumQuantity',
      key: 'minimumQuantity',
    },
  ];

  const expandedRowRender = (record) => {
    switch (record.type) {
      case 'Warehouse':
        const matchingSections = sections.filter(section => section.parentlocationid === record.id);
        if (matchingSections.length === 0) {
          return <Typography>No sections available</Typography>;
        }
        return (
          <Tabs>
            {matchingSections.map(section => (
              <Tab label={section.name} key={section.id}>
                <Table 
                  {...rowTableConfig} 
                  dataSource={rows.filter(row => row.parentlocationid === section.id)}
                />
              </Tab>
            ))}
          </Tabs>
        );

      case 'Vendor':
      case 'Retail':
        const data = []; 

        return (
          <Table
            columns={retailVendorColumns}
            dataSource={data}
            pagination={false}
          />
        );

      default:
        return null;
    }
  };

  const handleCancel = () => {
    setIsLocationBuilderVisible(false);
  };

  const handleLocationBuilderOk = () => {
    setIsLocationBuilderVisible(false);
    fetchLocations();
    setSnackbarContent({ message: 'Inventory Location successfully built', severity: 'success' });
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Input
          placeholder="Search locations"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px', marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={() => setIsLocationBuilderVisible(true)}>
          Add Location
        </Button>
      </Box>
      
      <Box style={{ overflow: 'auto', maxHeight: '80vh' }}>
        <Table
          columns={columns}
          dataSource={locations}
          rowKey="id"
          pagination={false}
          scroll={{ y: '80vh' }}
          expandable={{ 
            expandedRowRender,
            rowExpandable: record => ['Warehouse', 'Vendor', 'Retail'].includes(record.type)
          }}
        />
      </Box>

      <Modal 
        open={isLocationBuilderVisible} 
        onClose={handleCancel} 
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{ minWidth: '90vw', maxWidth: '90vw', minHeight: '80vh', maxHeight: '80vh' }}
      >
        <Container maxWidth="sm">
          <Box mt={5}>
            <Typography variant="h4" gutterBottom id="modal-title">
              Add Location
            </Typography>
            <LocationBuilder onOk={handleLocationBuilderOk} onCancel={handleCancel} />
          </Box>
        </Container>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarContent.severity} sx={{ width: '100%' }}>
          {snackbarContent.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Locations;