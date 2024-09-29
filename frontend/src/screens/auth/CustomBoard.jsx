import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import { Box, Typography, IconButton, Switch, Popover, Button, FormControlLabel, Checkbox } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const gridCols = 24;
const gridSize = 30;
const gridPercentageWidth = 80;
const gridPercentageHeight = 80;

const availableWidgets = [
  { id: 'widget1', name: 'Widget 1', minW: 2, minH: 2 },
  { id: 'widget2', name: 'Widget 2', minW: 2, minH: 2 },
  { id: 'widget3', name: 'Widget 3', minW: 2, minH: 2 },
];

const CustomBoard = () => {
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [layoutWidth, setLayoutWidth] = useState(window.innerWidth);

  const handleToggleWidget = (widgetId) => {
    if (selectedWidgets.includes(widgetId)) {
      setSelectedWidgets(selectedWidgets.filter((id) => id !== widgetId));
    } else {
      setSelectedWidgets([...selectedWidgets, widgetId]);
    }
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const updateLayoutWidth = () => {
    setLayoutWidth(window.innerWidth * (gridPercentageWidth / 100));
  };

  useEffect(() => {
    window.addEventListener('resize', updateLayoutWidth);
    updateLayoutWidth(); // Call once to initialize
    return () => window.removeEventListener('resize', updateLayoutWidth);
  }, []);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const widgetComponents = {
    widget1: () => <Box>Content for Widget 1</Box>,
    widget2: () => <Box>Content for Widget 2</Box>,
    widget3: () => <Box>Content for Widget 3</Box>,
  };

  const layout = selectedWidgets.map((widgetId, index) => ({
    i: widgetId,
    x: ((index * 4) % gridCols) + 1, // Adjust for spaces
    y: Math.floor(index / 6) * 5 + 1, // Adjust for spaces
    w: 3, // Adjust size to respect gaps
    h: 3,
    minW: availableWidgets.find((widget) => widget.id === widgetId).minW,
    minH: availableWidgets.find((widget) => widget.id === widgetId).minH,
  }));

  const open = Boolean(anchorEl);
  const id = open ? 'widget-popover' : undefined;

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <FormControlLabel
          control={<Switch checked={editMode} onChange={handleEditModeToggle} />}
          label={editMode ? 'Edit Mode' : 'View Mode'}
        />
      </Box>
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'white',
          width: `${gridPercentageWidth}%`, // Set width as a percentage of viewport width
          height: `${gridPercentageHeight}%`, // Set height as a percentage of viewport height
          margin: '0 auto', // Center the grid
          overflow: 'hidden', // Hide any overflow
          '&::before': editMode
            ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
              radial-gradient(circle at ${gridSize / 2}px ${gridSize / 2}px, lightgray 2px, transparent 0)`,
              backgroundSize: `${gridSize}px ${gridSize}px`,
              zIndex: 1,
            }
            : {},
        }}
      >
        {editMode && (
          <IconButton
            color="primary"
            onClick={handlePopoverOpen}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              zIndex: 3, // Ensure the button is above the grid
            }}
          >
            <WidgetsIcon /> Widgets
          </IconButton>
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2 }}>
            {availableWidgets.map((widget) => (
              <FormControlLabel
                key={widget.id}
                control={
                  <Checkbox
                    checked={selectedWidgets.includes(widget.id)}
                    onChange={() => handleToggleWidget(widget.id)}
                    disabled={!editMode}
                  />
                }
                label={widget.name}
              />
            ))}
          </Box>
        </Popover>
        <GridLayout
          className="layout"
          layout={layout}
          cols={gridCols}
          rowHeight={gridSize}
          width={layoutWidth} // Set dynamically calculated width
          isDraggable={editMode}
          isResizable={editMode}
          compactType={null} // No compaction
          preventCollision={true} // Prevent overlapping
          style={{ position: 'relative', zIndex: 2, height: '100%', overflow: 'hidden' }} // Ensure the grid stays within bounds and hide overflow
        >
          {selectedWidgets.map((widgetId) => (
            <Box
              key={widgetId}
              sx={{
                border: '1px solid black',
                p: 1,
                borderRadius: 1,
                bgcolor: 'white',
                zIndex: 2, // Ensure the widgets are above the grid background
                overflow: 'hidden', // Hide any overflow
              }}
            >
              <Typography
                variant="h6"
                className="nonDraggable"
                sx={{ cursor: editMode ? 'move' : 'default' }}
              >
                {availableWidgets.find((widget) => widget.id === widgetId).name}
              </Typography>
              {React.createElement(widgetComponents[widgetId])}
            </Box>
          ))}
        </GridLayout>
      </Box>
    </Box>
  );
};

export default CustomBoard;