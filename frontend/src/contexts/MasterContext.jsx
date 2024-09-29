import React from 'react';
import { AuthProvider } from './AuthContext';
import { DatabaseProvider } from './DatabaseContext';
import { FormProvider } from './FormContext';

// MasterContext that wraps all other contexts
const MasterContext = ({ children }) => {
  return (
    <AuthProvider>
      <DatabaseProvider>
      <FormProvider>
        {children}
      </FormProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
};

export default MasterContext;
