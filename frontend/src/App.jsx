import { LicenseInfo } from '@mui/x-license';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './Router';
import MasterContext from './contexts/MasterContext'; // Import the MasterContext

const App = () => {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';

    // Set your MUI license key here
    LicenseInfo.setLicenseKey('abac83da9a33417ce2059b569341bb8bTz04NzA5NSxFPTE3NDI5MzI2ODEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');
  }, []);

  return (
    <MasterContext>  {/* Wrap everything in MasterContext */}
      <Router>
        <AppRouter />
      </Router>
    </MasterContext>
  );
};

export default App;
