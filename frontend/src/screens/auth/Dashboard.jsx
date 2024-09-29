import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Container, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton, AppBar, CssBaseline, Button, Tooltip, Badge, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ProductionIcon from '@mui/icons-material/PrecisionManufacturing';
import RetailIcon from '@mui/icons-material/Store';
import SalesIcon from '@mui/icons-material/PointOfSale';
import VendorIcon from '@mui/icons-material/LocalShipping';
import AccountingIcon from '@mui/icons-material/AccountBalance';
import ReportsIcon from '@mui/icons-material/Assessment';
import DesignIcon from '@mui/icons-material/Brush';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { globalStyles, globalColors } from '../../constants/Styles';
import { useAuth } from '../../contexts/AuthContext';
import InventoryTable from '../../components/inventory/InventoryTable';
import Locations from '../../components/inventory/Locations';
import Suppliers from '../../components/inventory/Suppliers';
import ProductionSchedule from '../../components/production/ProductionSchedule';
import Orders from '../../components/production/Orders';
import Recipes from '../../components/production/Recipes';
import CustomBoard from './CustomBoard';
import Crm from '../../components/sales/Crm';
import SalesOrders from '../../components/sales/SalesOrders';
import DashboardModule from '../../components/accounting/Dashboard';
import Contacts from '../../components/accounting/Contacts';
import SalesAdmin from '../../components/admin/SalesAdmin';

const drawerWidth = 240;
const topNavItems = {
  dashboard: [],
  inventory: ['Inventory', 'Locations', 'Suppliers'],
  production: ['Schedule', 'Orders', 'Recipes'],
  retail: [],
  vendor: [],
  accounting: ['Dashboard', 'Contacts'],
  reports: [],
  sales: ['Customers', 'Orders', 'Reports', 'Admin'],
  design: [],
};

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
  width: '100vw', // Take the full width
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: globalColors.primary,
}));

const DrawerStyled = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Start drawer closed
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [topNavSelection, setTopNavSelection] = useState(null);
  const navigate = useNavigate();
  const { authData } = useAuth();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('/api/inventory/all', { withCredentials: true });
        console.log('Inventory Data:', response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setTopNavSelection(topNavItems[section][0] || null);
    setDrawerOpen(false); // Close drawer after click
  };

  const handleTopNavSelect = (item) => {
    setTopNavSelection(item);
  };

  const dashboardCards = [
    { title: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
    { title: 'Inventory', icon: <InventoryIcon />, section: 'inventory' },
    { title: 'Production', icon: <ProductionIcon />, section: 'production' },
    { title: 'Retail', icon: <RetailIcon />, section: 'retail' },
    { title: 'Vendor', icon: <VendorIcon />, section: 'vendor' },
    { title: 'Accounting', icon: <AccountingIcon />, section: 'accounting' },
    { title: 'Reports', icon: <ReportsIcon />, section: 'reports' },
    { title: 'Sales', icon: <SalesIcon />, section: 'sales' },
    { title: 'Design TeamX', icon: <DesignIcon />, section: 'design' },
  ];

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

  // List of sections that should have a red badge
  const sectionsWithBadges = ['Retail', 'Vendor', 'Accounting', 'Reports', 'Sales', 'Design TeamX'];

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginRight: 5 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 0 }}>
            {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
          </Typography>
          <Box sx={{ flexGrow: 1, ml: 2, display: 'flex', alignItems: 'center' }}> 
            {topNavItems[currentSection].map((item, index) => (
              <React.Fragment key={index}>
                <Button color="inherit" onClick={() => handleTopNavSelect(item)}>
                  {item}
                </Button>
                {index < topNavItems[currentSection].length - 1 && (
                  <Divider orientation="vertical" flexItem sx={{ height: '50%', mx: 1, borderColor: 'white' }} />
                )}
              </React.Fragment>
            ))}
          </Box>
          <Box style={{ width: '35vw', textAlign: 'right', fontSize: '12pt', color: 'white' }}>
              {userInfoDisplay}
          </Box>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled
        open={drawerOpen}
        onClose={handleDrawerToggle}
        variant="temporary" // Set variant to temporary for overlay behavior
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
      >
        <Toolbar />
        <List>
          {dashboardCards.map((card, index) => (
            <Tooltip title={card.title} placement="right" key={card.title}>
              <ListItem button onClick={() => handleSectionChange(card.section)}>
                <ListItemIcon>
                  {sectionsWithBadges.includes(card.title) ? (
                    <Badge variant="dot" color="error">
                      {card.icon}
                    </Badge>
                  ) : (
                    card.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={card.title} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </DrawerStyled>
      <Main>
        <Toolbar />
        {currentSection === 'dashboard' && <CustomBoard />}
        {currentSection === 'inventory' && topNavSelection === 'Inventory' && <InventoryTable />}
        {currentSection === 'inventory' && topNavSelection === 'Locations' && <Locations />}
        {currentSection === 'inventory' && topNavSelection === 'Suppliers' && <Suppliers />}
        {currentSection === 'production' && topNavSelection === 'Schedule' && <ProductionSchedule />}
        {currentSection === 'production' && topNavSelection === 'Orders' && <Orders />}
        {currentSection === 'production' && topNavSelection === 'Recipes' && <Recipes />}
        {currentSection === 'sales' && topNavSelection === 'Customers' && <Crm />}
        {currentSection === 'sales' && topNavSelection === 'Orders' && <SalesOrders />}
        {currentSection === 'sales' && topNavSelection === 'Admin' && <SalesAdmin />}
        {currentSection === 'accounting' && topNavSelection === 'Dashboard' && <DashboardModule />}
        {currentSection === 'accounting' && topNavSelection === 'Contacts' && <Contacts />}
      </Main>
    </div>
  );
};

export default Dashboard;