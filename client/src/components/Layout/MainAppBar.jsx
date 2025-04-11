import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function MainAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ASUE Financial Platform
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Create Group
        </Button>
        <Button color="inherit" component={Link} to="/groups">
          View Groups
        </Button>
      </Toolbar>
    </AppBar>
  );
}