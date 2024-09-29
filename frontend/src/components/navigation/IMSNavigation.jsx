import { Menu, MenuItem, Box } from '@mui/material';
import React, { useState } from 'react';
import { globalColors, globalStyles } from '../../constants/Styles';

const IMSNavigation = ({ onMenuItemSelect }) => {
    const [selectedKey, setSelectedKey] = useState('1');
  
    const handleMenuClick = (event, key) => {
        setSelectedKey(key);
        if (typeof onMenuItemSelect === 'function') {
          onMenuItemSelect(key);
        }
      };
  
  const menuItemStyle = {
    width: '20%',
    color: '#fff',
    fontSize: '14pt',
    textAlign: 'left',
    height: '3vh',
  };

  return (
    <Box
      sx={{
        ...globalStyles.globalBody,
        backgroundColor: globalColors.secondary,
        height: '3vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
      }}
    >
      <Menu
        sx={{
          width: '100%',
          backgroundColor: globalColors.secondary,
          display: 'flex',
          flexDirection: 'row',
        }}
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
      >
        <MenuItem
          value="1"
          sx={{ ...menuItemStyle, backgroundColor: selectedKey === '1' ? globalColors.primary : 'transparent' }}
          onClick={(event) => handleMenuClick(event, '1')}
        >
          Inventory
        </MenuItem>
        <MenuItem
          value="2"
          sx={{ ...menuItemStyle, backgroundColor: selectedKey === '2' ? globalColors.primary : 'transparent' }}
          onClick={(event) => handleMenuClick(event, '2')}
        >
          Stockrooms
        </MenuItem>
        <MenuItem
          value="3"
          sx={{ ...menuItemStyle, backgroundColor: selectedKey === '3' ? globalColors.primary : 'transparent' }}
          onClick={(event) => handleMenuClick(event, '3')}
        >
          Reporting
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default IMSNavigation;