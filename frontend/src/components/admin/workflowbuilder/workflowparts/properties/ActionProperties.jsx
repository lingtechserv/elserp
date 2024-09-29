import React from 'react';
import { Button, Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ActionConfiguration from '../../assets/configurations/ActionConfiguration';

const ActionProperties = ({
  selectedShape,
  openActionConfig,
  handleOpenActionConfig,
  handleCancelActionConfig,
  handleSaveActionConfig,
}) => {
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenActionConfig}
        sx={{
          width: '100%',
          height: '40px',
          marginTop: '10px',
          backgroundColor: selectedShape.isCompleted ? 'green' : 'red',
        }}
      >
        {selectedShape.isCompleted ? 'Completed' : 'Configure Action'}
      </Button>
      <Modal
        open={openActionConfig}
        onClose={handleCancelActionConfig}
        aria-labelledby="action-config-modal"
        aria-describedby="modal-to-open-action-config"
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
            onClick={handleCancelActionConfig}
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

          <ActionConfiguration
            config={selectedShape.actionConfig || {}}
            onSave={handleSaveActionConfig}
            onCancel={handleCancelActionConfig}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ActionProperties;
