import React, { useState } from 'react';
import { Box, Typography, TextField, Popover, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SketchPicker } from 'react-color';

// Import individual shape property components
import ActionProperties from './properties/ActionProperties';
import DecisionProperties from './properties/DecisionProperties';
import InputOutputConfiguration from './properties/InputOutputConfiguration'; // Import InputOutputConfiguration component
import FormBuilder from '../../formbulder/FormBuilder'; // Import FormBuilder component

const Properties = ({
  drawerWidth,
  selectedShape,
  handlePropertyChange,
  handleColorBoxClick,
  openColorPopover,
  colorPopoverAnchorEl,
  handleColorPopoverClose,
  handleColorChange,
  handleOpenFormBuilder,
  handleCloseFormBuilder,
  openFormBuilder,
  handleFormCompletion,
  // Props for action configuration
  openActionConfig,
  handleOpenActionConfig,
  handleCancelActionConfig,
  handleSaveActionConfig,
  // Props for decision configuration
  openDecisionConfig,
  handleOpenDecisionConfig,
  handleCancelDecisionConfig,
  handleSaveDecisionConfig,
  // Props for Input/Output configuration
  openInputOutputConfig,
  handleOpenInputOutputConfig,
  handleCancelInputOutputConfig,
  handleSaveInputOutputConfig,
}) => {
  console.log('Selected Shape:', selectedShape); // Debugging to ensure the shape is being passed correctly

  // Mapping for dynamically rendering the specific shape properties component
  const shapePropertiesComponents = {
    Action: (
      <ActionProperties
        selectedShape={selectedShape}
        openActionConfig={openActionConfig}
        handleOpenActionConfig={handleOpenActionConfig}
        handleCancelActionConfig={handleCancelActionConfig}
        handleSaveActionConfig={handleSaveActionConfig}
      />
    ),
    Decision: (
      <DecisionProperties
        selectedShape={selectedShape}
        openDecisionConfig={openDecisionConfig}
        handleOpenDecisionConfig={handleOpenDecisionConfig}
        handleCancelDecisionConfig={handleCancelDecisionConfig}
        handleSaveDecisionConfig={handleSaveDecisionConfig}
      />
    ),
    'Input/Output': (
      <InputOutputConfiguration
        config={selectedShape.ioConfig || {}}
        onSave={handleSaveInputOutputConfig}
        onCancel={handleCancelInputOutputConfig}
      />
    ),
    // Add other shape properties components here
  };

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', padding: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Properties
        </Typography>
        {selectedShape && Object.keys(selectedShape).length > 0 ? (
          <Box sx={{ padding: 2 }}>
            {/* Common Properties for all shapes */}
            <TextField
              label="Title"
              value={selectedShape.label || ''}
              onChange={(e) => handlePropertyChange('label')(e)}
              fullWidth
              margin="normal"
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <Typography variant="subtitle1" sx={{ marginRight: '8px' }}>
                Color
              </Typography>
              <Box
                sx={{
                  width: '40px',
                  height: '20px',
                  backgroundColor: selectedShape.bgColor || '#ffffff',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                }}
                onClick={handleColorBoxClick}
              />
            </Box>
            <Popover
              open={openColorPopover}
              anchorEl={colorPopoverAnchorEl}
              onClose={handleColorPopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <SketchPicker
                color={selectedShape.bgColor || '#ffffff'}
                onChangeComplete={handleColorChange}
              />
            </Popover>

            {/* Shape-specific properties */}
            {shapePropertiesComponents[selectedShape.name] || null}

            {/* Additional modals for configuration */}
            {selectedShape.name === 'Document' && (
              <>
                <Button
                  variant="contained"
                  onClick={handleOpenFormBuilder}
                  sx={{
                    width: '100%',
                    height: '40px',
                    marginTop: '10px',
                    backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
                  }}
                >
                  {selectedShape.isCompleted ? 'Completed' : 'Open Form'}
                </Button>
                <Modal
                  open={openFormBuilder}
                  onClose={handleCloseFormBuilder}
                  aria-labelledby="form-builder-modal"
                  aria-describedby="modal-to-open-form-builder"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      overflow: 'auto',
                    }}
                  >
                    <IconButton
                      aria-label="close"
                      onClick={handleCloseFormBuilder}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1300,
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Form Builder Component */}
                    <FormBuilder onCompletion={handleFormCompletion} />
                  </Box>
                </Modal>
              </>
            )}
          </Box>
        ) : (
          <Typography variant="body1" sx={{ padding: 2 }}>
            Select a shape to see its properties.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Properties;
