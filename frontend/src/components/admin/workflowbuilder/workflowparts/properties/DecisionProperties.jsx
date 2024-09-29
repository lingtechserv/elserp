import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DecisionConfiguration from '../../assets/configurations/DecisionConfiguration'; // Ensure this path is correct

const DecisionProperties = ({ selectedShape, setShapes, shapes }) => {
  const [openDecisionConfig, setOpenDecisionConfig] = useState(false);
  const [currentDecisionConfig, setCurrentDecisionConfig] = useState(selectedShape?.decisionConfig || {});

  useEffect(() => {
    if (selectedShape) {
      setCurrentDecisionConfig(selectedShape.decisionConfig || {});
    }
  }, [selectedShape]);

  const handleOpenDecisionConfig = () => {
    setOpenDecisionConfig(true);
  };

  const handleSaveDecisionConfig = (config) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === selectedShape.id ? { ...shape, decisionConfig: config, isCompleted: true } : shape
    );
    setShapes(updatedShapes);
    setOpenDecisionConfig(false);
  };

  const handleCancelDecisionConfig = () => {
    setOpenDecisionConfig(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Render Decision Configuration Button */}
      <Button
        variant="contained"
        onClick={handleOpenDecisionConfig}
        sx={{
          width: '100%',
          height: '40px',
          marginTop: '10px',
          backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
        }}
      >
        {selectedShape.isCompleted ? 'Completed' : 'Configure Decision'}
      </Button>

      {/* Modal for Decision Configuration */}
      <Modal
        open={openDecisionConfig}
        onClose={handleCancelDecisionConfig}
        aria-labelledby="decision-config-modal"
        aria-describedby="modal-to-open-decision-config"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCancelDecisionConfig}
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

          {/* Render the DecisionConfiguration component */}
          <DecisionConfiguration
            config={currentDecisionConfig}
            onSave={handleSaveDecisionConfig}
            onCancel={handleCancelDecisionConfig}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default DecisionProperties;
