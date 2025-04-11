import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useBlockchain } from '../../contexts/BlockchainContext';

export default function FabSnackbar() {
  const { notification } = useBlockchain();

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={notification?.severity} sx={{ width: '100%' }}>
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}