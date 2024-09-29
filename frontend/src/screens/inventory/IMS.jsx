import { AppBar, Toolbar, Menu, MenuItem, Typography, IconButton, Container, Box } from '@mui/material';
import React, { useState } from 'react';
import InventoryTable from '../../components/inventory/InventoryTable';
import Locations from '../../components/inventory/Locations';
import Suppliers from '../../components/inventory/Suppliers';
import { globalColors } from '../../constants/Styles';
import { useAuth } from '../../contexts/AuthContext';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { key: 'inventory', label: 'Inventory', component: <InventoryTable /> },
  { key: 'stockrooms', label: 'Locations', component: <Locations /> },
  { key: 'suppliers', label: 'Suppliers', component: <Suppliers /> },
  { key: 'admin', label: 'Admin', component: null },
];

const IMS = () => {
  const [selectedMenu, setSelectedMenu] = useState('inventory');
  const { authData } = useAuth();
  const navigate = useNavigate();

  const userInfoDisplay = authData.user ? (
    <div style={{ textAlign: 'right', lineHeight: 'normal', padding: 0 }}>
      <div style={{ margin: 0, fontSize: '12pt', color: 'white', lineHeight: 'normal' }}>
        {`${authData.user.first_name} ${authData.user.last_name}`}
      </div>
      <div style={{ margin: 0, fontSize: 'smaller', color: 'white', lineHeight: 'normal' }}>
        {authData.user.title}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );

  const renderContent = () => {
    const selectedItem = menuItems.find(item => item.key === selectedMenu);
    return selectedItem ? selectedItem.component : null;
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Container disableGutters maxWidth={false} style={{ height: '100vh', width: '100vw' }}>
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
              {userInfoDisplay}
            </Box>
            <IconButton onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto', color: 'white' }}>
              <HomeOutlinedIcon style={{ fontSize: '20px', borderRadius: '50%', border: '2px solid white', padding: '5px' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box style={{ overflowY: 'hidden', height: 'calc(100vh - 7vh)' }}>
          {renderContent()}
        </Box>
        <Box component="footer" style={{ backgroundColor: globalColors.secondary, height: '2vh', zIndex: '1000' }}></Box>
      </Container>
    </div>
  );
};

export default IMS;