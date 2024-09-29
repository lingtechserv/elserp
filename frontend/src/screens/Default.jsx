import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';

const Default = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loadingApi, setLoadingApi] = useState(true);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    axios.get('/api/test-connection')
      .then(response => {
        if (response.status === 200) {
          setApiStatus('success');
          return axios.get('/api/test-db-connection');
        } else {
          setApiStatus('error');
        }
      })
      .then(response => {
        if (response && response.status === 200) {
          setDbStatus('success');
        } else {
          setDbStatus('error');
        }
      })
      .catch(error => {
        setApiStatus('error');
        setDbStatus('error');
      })
      .finally(() => {
        setLoadingApi(false);
        setLoadingDb(false);
      });
  }, []);

  return (
    <Container style={{ textAlign: 'center', padding: '20px' }}>
      <Box component="header" style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}>
        <Typography variant="h1">Welcome to My Home Page</Typography>
      </Box>
      <Box component="main" style={{ margin: '20px 0' }}>
        <Typography variant="body1">This is a simple React home page.</Typography>
        <Typography variant="body1">You can add more content here as needed.</Typography>
        <List>
          <ListItem>
            <ListItemText primary="API Connection" />
            <ListItemIcon>
              {loadingApi ? (
                <CircularProgress size={20} />
              ) : apiStatus === 'success' ? (
                <CheckCircleIcon style={{ color: 'green' }} />
              ) : (
                <ErrorIcon style={{ color: 'red' }} />
              )}
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="Database Connection" />
            <ListItemIcon>
              {loadingDb ? (
                <CircularProgress size={20} />
              ) : dbStatus === 'success' ? (
                <CheckCircleIcon style={{ color: 'green' }} />
              ) : (
                <ErrorIcon style={{ color: 'red' }} />
              )}
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>
      <Box component="footer" style={{ backgroundColor: '#282c34', padding: '10px', color: 'white', position: 'fixed', width: '100%', bottom: '0' }}>
        <Typography variant="body2">&copy; 2024 My Website</Typography>
      </Box>
    </Container>
  );
};

export default Default;