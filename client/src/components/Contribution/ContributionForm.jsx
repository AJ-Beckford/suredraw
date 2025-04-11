import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useBlockchain } from '../../contexts/BlockchainContext';

export default function ContributionForm() {
  const [formData, setFormData] = useState({
    groupId: '',
    memberId: '',
    amount: ''
  });
  
  const { contribute } = useBlockchain();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.groupId || !formData.memberId || isNaN(formData.amount)) return;
    
    await contribute({
      groupId: formData.groupId,
      memberId: formData.memberId,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Make Contribution</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Group ID"
          value={formData.groupId}
          onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Member ID"
          value={formData.memberId}
          onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleSubmit}
        >
          Submit Contribution
        </Button>
      </Grid>
    </Grid>
  );
}