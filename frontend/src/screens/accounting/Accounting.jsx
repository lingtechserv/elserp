import React, { useState } from 'react';
import { AppBar, Toolbar, Menu, MenuItem, Typography, Box, Container } from '@mui/material';
import { globalColors } from '../../constants/Styles';
import Dashboard from '../../components/accounting/Dashboard';


const menuItems = [
  { key: 'dashboard', label: 'Dashboard', component: Dashboard },
  { key: 'stockrooms', label: 'Stockrooms', component: null },
  { key: 'suppliers', label: 'Suppliers', component: null },
  { key: 'admin', label: 'Admin', component: null },
];

const Accounting = () => {
  const [selectedMenu, setSelectedMenu] = useState('inventory');

  const renderContent = () => {
    const selectedItem = menuItems.find(item => item.key === selectedMenu);
    return selectedItem ? selectedItem.component : null;
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" style={{ backgroundColor: globalColors.secondary }}>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5vh' }}>
            <Box>
              <Menu
                value={selectedMenu}
                onChange={(event, key) => setSelectedMenu(key)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {menuItems.map(item => (
                  <MenuItem
                    key={item.key}
                    selected={selectedMenu === item.key}
                    onClick={() => setSelectedMenu(item.key)}
                    style={{
                      backgroundColor: selectedMenu === item.key ? globalColors.primary : 'transparent',
                      color: 'white',
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography variant="h6" style={{ width: '30vw', textAlign: 'center', fontSize: '14pt', color: 'white' }}>
              Inventory Management
            </Typography>
            <Box style={{ width: '35vw', textAlign: 'right', fontSize: '12pt', color: 'white' }}>
              User Info
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, height: '94vh' }}>
          {renderContent()}
        </Box>
        <Box component="footer" style={{ backgroundColor: globalColors.secondary, height: '2vh' }}></Box>
      </Box>
    </Container>
  );
};

export default Accounting;