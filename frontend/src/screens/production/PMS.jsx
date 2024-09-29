import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import Stack from '@mui/material/Stack';
import { globalColors } from '../../constants/Styles';

import ProductionSchedule from '../../components/production/ProductionSchedule';
import Orders from '../../components/production/Orders';
import Recipes from '../../components/production/Recipes';

const menuItems = [
  { key: 'schedule', label: 'Schedule', component: <ProductionSchedule /> },
  { key: 'orders', label: 'Orders', component: <Orders /> },
  { key: 'recipes', label: 'Recipes', component: <Recipes /> },
  { key: 'report', label: 'Reports', component: null },
  { key: 'admin', label: 'Admin', component: null },
];

const PMS = () => {
  const [selectedTab, setSelectedTab] = useState('schedule');
  const { authData } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderContent = () => {
    const selectedItem = menuItems.find(item => item.key === selectedTab);
    return selectedItem ? selectedItem.component : null;
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <AppBar position="static" sx={{ backgroundColor: globalColors.primary }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tabs value={selectedTab} onChange={handleTabChange} textColor="inherit"
                  indicatorColor="secondary"
                  sx={{
                    '.MuiTabs-indicator': {
                      backgroundColor: globalColors.secondaryDark,
                    },
                  }}
            >
              {menuItems.map(item => (
                <Tab key={item.key} label={item.label} value={item.key} />
              ))}
            </Tabs>
          </Box>
          <Typography variant="h6" component="div" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Production Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {authData.user && (
              <Stack direction="column" alignItems="flex-end" spacing={0}>
                <Typography variant="body1" sx={{ color: 'common.white' }}>
                  {`${authData.user.first_name} ${authData.user.last_name}`}
                </Typography>
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  {authData.user.title}
                </Typography>
              </Stack>
            )}
            <IconButton color="inherit" onClick={() => navigate('/dashboard')} sx={{ ml: 2 }}>
              <HomeIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ 
          overflowY: 'auto', 
          height: 'calc(100vh - 100px)',
          mt: 2,
          width: '98vw',
          minWidth: '98vw'
      }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default PMS;
