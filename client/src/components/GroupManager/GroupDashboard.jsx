import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import { useBlockchain } from '../../contexts/BlockchainContext';

const columns = [
  { field: 'id', headerName: 'Group ID', flex: 1 },
  { field: 'members', headerName: 'Members', flex: 1, valueGetter: (params) => params.row.members.length },
  { field: 'balance', headerName: 'Escrow Balance', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
];

export default function GroupDashboard() {
  const [groups, setGroups] = useState([]);
  const { api } = useBlockchain();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, []);

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Active Groups
      </Typography>
      <DataGrid
        rows={groups}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
        }}
      />
    </Box>
  );
}