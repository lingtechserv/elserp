import React, { useState } from 'react';
import { Box, Button, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormFiller from '../utils/FormFiller';

const AddCustomerModal = ({ formConfig, isOpen, handleClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{
        position: 'relative',
        width: '80vw',
        maxWidth: '1000px',
        height: '80vh',
        backgroundColor: 'white',
        p: 4,
        overflowY: 'auto',
      }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" sx={{ mb: 4 }}>Add Customer</Typography>
        <FormFiller formConfig={formConfig} />
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
