import React, { useState } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useInventory } from '../../contexts/InventoryContext';
import { Tabs, Tab, Button, Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { globalColors } from '../../constants/Styles';

interface DetailItem {
  id: number;
  name: string;
  format: string;
  pivot?: {
    value: string | null;
    required: number | null;
  };
}

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  type: string;
  category: string;
  subcat: string;
  details: DetailItem[];
  active: string;
}

function DetailItem({ detail }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2">{detail.name}</Typography>
      <Typography variant="body2">{detail.format}: {detail.pivot ? detail.pivot.value : 'N/A'}</Typography>
    </Box>
  );
}

const InventoryTable = () => {
  const { inventoryData } = useInventory();
  const [showAll, setShowAll] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'subcat', headerName: 'Subcategory', width: 200 },
  ];

  const filterRows = item => {
    const searchText = filterText.toLowerCase();
    return (
      (item.basics.sku || "").toLowerCase().includes(searchText) ||
      (item.basics.name || "").toLowerCase().includes(searchText) ||
      (item.basics.type || "").toLowerCase().includes(searchText) ||
      (item.basics.category || "").toLowerCase().includes(searchText) ||
      (item.basics.subcat || "").toLowerCase().includes(searchText)
    );
  };

  const rows = inventoryData
    .filter(item => showAll || item.basics.active)
    .filter(filterRows)
    .map((item, index) => ({
      id: index,
      sku: item.basics.sku,
      name: item.basics.name,
      type: item.basics.type,
      category: item.basics.category,
      subcat: item.basics.subcat,
      details: item.details,
      active: item.basics.active,
    }));

  const handleToggleChange = (event) => {
    setShowAll(event.target.checked);
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    console.log("Selected row:", params.row);
    setDrawerOpen(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div style={{ height: '90.5vh', width: '70vw', marginTop: '0.5vh' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: '10px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <FormControlLabel
          control={<Switch checked={showAll} onChange={handleToggleChange} />}
          label={showAll ? "Showing All Items" : "Showing Active Items"}
        />
      </div>
      <DataGridPro
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
      />
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            zIndex: 1400, // Ensure this is a high value
            position: 'fixed',
            top: '64px', // Align with the bottom of the AppBar (assuming the AppBar height is 64px)
            height: 'calc(100vh - 64px)', // Reduce the height by the AppBar height
          },
        }}
      >
        <Box
          sx={{ width: '30vw', height: '100%' }}
          role="presentation"
          padding={2}
        >
          {selectedRow && (
            <>
              <Box>
                <Typography variant="h6" component="div">
                  {selectedRow.sku} | {selectedRow.name}
                </Typography>
                <Typography variant="body1" component="div">
                  {selectedRow.type} | {selectedRow.category} | {selectedRow.subcat}
                </Typography>
              </Box>
              <Box sx={{ pt: 2, height: 'calc(100% - 150px)', overflow: 'auto' }}>
                <Tabs
                  value={activeTab}
                  onChange={(event, newValue) => setActiveTab(newValue)}
                  aria-label="inventory details tabs"
                >
                  <Tab label="Details" />
                  <Tab label="Inventory" />
                  <Tab label="Suppliers" />
                  <Tab label="Related" />
                </Tabs>
                {activeTab === 0 && selectedRow && (
                  <Box sx={{ pt: 2 }}>
                    <Table size="small" aria-label="details table">
                      <TableBody>
                        {(selectedRow.details || []).map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {detail.name}
                            </TableCell>
                            <TableCell align="right">{detail.pivot?.value ?? 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
                {activeTab === 1 && (
                  <Box sx={{ pt: 2 }}>
                    {/* Inventory tab content */}
                  </Box>
                )}
                {activeTab === 2 && (
                  <Box sx={{ pt: 2 }}>
                    {/* Suppliers tab content */}
                  </Box>
                )}
                {activeTab === 3 && (
                  <Box sx={{ pt: 2 }}>
                    {/* Related tab content */}
                  </Box>
                )}
              </Box>
            </>
          )}
          <Box flexGrow={1} />
          <Box sx={{ height: '50px', textAlign: 'center', p: 1 }}>
            <Box sx={{ p: 3, pb: 2, position: 'relative', bottom: 0, width: 'auto', textAlign: 'center', background: '#fff' }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={1}></Grid> {/* Adjusted spacing around buttons */}
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    sx={{
                      width: '100%',
                      backgroundColor: selectedRow && selectedRow.active === 'true' ? globalColors.primary : globalColors.primaryLight,
                      '&:hover': {
                        backgroundColor: globalColors.primaryDark,
                      },
                    }}
                    onClick={() => {/* Handle activation/deactivation */}}
                  >
                    {selectedRow && selectedRow.active === 'true' ? 'Activate' : 'Deactivate'}
                  </Button>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    sx={{
                      width: '100%',
                      backgroundColor: globalColors.secondary,
                      '&:hover': {
                        backgroundColor: globalColors.secondaryDark,
                      },
                    }}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item xs={1}></Grid> 
              </Grid>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default InventoryTable;