import React from 'react';
import { AppBar, Toolbar, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

const CustomToolbar = ({ connectMode, handleConnectModeToggle, lineType, handleLineTypeChange }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Workflow Builder
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexGrow: 1,
            width: '300px',
          }}
        >
          {connectMode && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                p: 0.5,
                borderRadius: 1,
                mr: 2,
              }}
            >
              <ToggleButtonGroup
                size="small"
                value={lineType}
                exclusive
                onChange={handleLineTypeChange}
                aria-label="line type"
              >
                <ToggleButton value="solid" sx={{ fontSize: '0.8rem' }}>
                  Solid
                </ToggleButton>
                <ToggleButton value="dotted" sx={{ fontSize: '0.8rem' }}>
                  Dotted
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
          <ToggleButtonGroup
            size="small"
            value={connectMode ? 'connect' : 'none'}
            exclusive
            onChange={handleConnectModeToggle}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              p: 0.5,
            }}
          >
            <ToggleButton value="connect" sx={{ fontSize: '0.8rem' }}>
              Connect
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
