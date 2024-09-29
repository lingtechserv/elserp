import { AppBar, Toolbar, Menu, MenuItem, Typography, Container, Box } from '@mui/material';
import React, { useState } from 'react';
import { globalColors } from '../../constants/Styles';

const menuItems = [
  { key: 'inventory', label: 'Inventory', component: null },
  { key: 'stockrooms', label: 'Stockrooms', component: null },
  { key: 'suppliers', label: 'Suppliers', component: null },
  { key: 'admin', label: 'Admin', component: null },
];

const Retail = () => {
  const [selectedMenu, setSelectedMenu] = useState('inventory');

  const renderContent = () => {
    const selectedItem = menuItems.find(item => item.key === selectedMenu);
    return selectedItem ? selectedItem.component : null;
  };

  return (
    <div style={{ height: '100vh' }}>
      <Container disableGutters maxWidth={false} style={{ height: '100vh' }}>
        <AppBar position="static" style={{ backgroundColor: globalColors.secondary }}>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5vh' }}>
            <Box>
              <Menu
                value={selectedMenu}
                onChange={(_, value) => setSelectedMenu(value)}
                style={{ backgroundColor: 'transparent', width: '35%', fontSize: '12pt', height: '3vh', display: 'flex', alignItems: 'center' }}
              >
                {menuItems.map(item => (
                  <MenuItem
                    key={item.key}
                    selected={selectedMenu === item.key}
                    onClick={() => setSelectedMenu(item.key)}
                    style={{ color: 'white', ...(selectedMenu === item.key ? { backgroundColor: globalColors.primary } : {}) }}
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
        <Box style={{ height: '94vh' }}>
          {renderContent()}
        </Box>
        <Box component="footer" style={{ backgroundColor: globalColors.secondary, height: '2vh' }}></Box>
      </Container>
    </div>
  );
};

export default Retail;