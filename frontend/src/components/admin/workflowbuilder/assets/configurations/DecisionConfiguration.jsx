import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Toolbar,
  AppBar,
  MenuItem,
  Select,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { globalColors } from '../../../../../constants/Styles';

const DecisionConfiguration = ({ config, onSave, onCancel }) => {
  const [condition, setCondition] = useState(config.condition || '');
  const [trueAction, setTrueAction] = useState(config.trueAction || '');
  const [falseAction, setFalseAction] = useState(config.falseAction || '');

  const handleSave = () => {
    onSave({
      condition,
      trueAction,
      falseAction,
    });
  };

  return (
    <Modal
      open={true}
      onClose={onCancel}
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
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: globalColors.primary,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: '100%',
            left: 0,
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Decision Configuration
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onCancel}
              sx={{
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
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: '56px', width: '100%' }}>
          <Typography variant="h6">Configure Decision</Typography>
          <TextField
            label="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Select
            label="True Action"
            value={trueAction}
            onChange={(e) => setTrueAction(e.target.value)}
            fullWidth
            margin="normal"
          >
            {/* Options for true action can be dynamically loaded based on the context */}
            <MenuItem value="Action1">Action 1</MenuItem>
            <MenuItem value="Action2">Action 2</MenuItem>
          </Select>
          <Select
            label="False Action"
            value={falseAction}
            onChange={(e) => setFalseAction(e.target.value)}
            fullWidth
            margin="normal"
          >
            {/* Options for false action can be dynamically loaded based on the context */}
            <MenuItem value="Action3">Action 3</MenuItem>
            <MenuItem value="Action4">Action 4</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onCancel} variant="outlined" color="secondary" sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DecisionConfiguration;
