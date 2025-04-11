import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import ASueTheme from './components/common/ASueTheme';
import CreateGroupForm from './components/GroupManager/CreateGroupForm';
import GroupDashboard from './components/GroupManager/GroupDashboard';
import MainAppBar from './components/Layout/MainAppBar';
import FabSnackbar from './components/common/FabSnackbar';

export default function App() {
  return (
    <ThemeProvider theme={ASueTheme}>
      <CssBaseline />
      <Router>
        <MainAppBar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<CreateGroupForm />} />
            <Route path="/groups" element={<GroupDashboard />} />
          </Routes>
        </Container>
        <FabSnackbar />
      </Router>
    </ThemeProvider>
  );
}