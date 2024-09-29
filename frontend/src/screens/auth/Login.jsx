import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Button, TextField, Container, Typography, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import axios from 'axios';
import { globalStyles, globalColors } from '../../constants/Styles';
import { useDatabase } from '../../contexts/DatabaseContext';  // Use DatabaseContext for IndexedDB storage
import { useAuth } from '../../contexts/AuthContext'; // Assuming AuthContext is set up for token management

const apiService = {
  async login(values) {
    // Login and return the response
    return axios.post('https://els.lingerfelt.tech/api/login', values, { withCredentials: true });
  },
};

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Access the fetchDatabaseIndex and fetchAllData functions from the DatabaseContext
  const { fetchDatabaseIndex, fetchAllData } = useDatabase();  // Use fetchAllData and fetchDatabaseIndex from context
  
  // Access the auth context for managing the token
  const { updateAuthData, authData } = useAuth();  // Access both update and current authData

  const onFinish = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      email: data.get('email'),
      password: data.get('password'),
    };
  
    setLoading(true);
    setError('');
  
    try {
      console.log("Logging in with values:", values);  // Debugging line
      const response = await apiService.login(values);
      
      // The correct field is 'access_token'
      const token = response.data?.access_token;
  
      if (!token) {
        throw new Error("No token found in login response");
      }
  
      console.log("Received token:", token);  // Debugging line
  
      // Save token using AuthContext or directly in memory
      updateAuthData({ token });
  
      console.log("Token after updating authData:", token);  // Use token directly
  
      // Fetch the data from the database after login
      await fetchDatabaseIndex(); // Fetch the list of tables and store in IndexedDB
      await fetchAllData(); // Fetch all data and store in IndexedDB
  
      console.log('Database info fetched successfully');
      
      // Navigate to dashboard after login and fetching database
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container style={{ ...globalStyles.globalBody, width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100vw',
          maxWidth: 500,
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {loading && <CircularProgress />}
        <Typography component="h1" variant="h5" style={{ color: globalColors.primary, marginBottom: '20px' }}>
          Login
        </Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Box component="form" onSubmit={onFinish} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            InputProps={{
              startAdornment: <PersonOutlineIcon />,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            InputProps={{
              startAdornment: <LockOutlinedIcon />,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: globalColors.primary }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
