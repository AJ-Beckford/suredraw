import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useBlockchain } from '../../contexts/BlockchainContext';

export default function CreateGroupForm() {
  const [formData, setFormData] = useState({
    groupId: '',
    lifetime: '2592000000',
    payoutSchedule: '{"frequency":"monthly","schedule":[]}'
  });
  
  const { createGroup } = useBlockchain();

  const validateSchedule = (schedule) => {
    try {
      JSON.parse(schedule);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSchedule(formData.payoutSchedule)) return;
    await createGroup(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Group ID"
        variant="outlined"
        margin="normal"
        value={formData.groupId}
        onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Lifetime Duration</InputLabel>
        <Select
          value={formData.lifetime}
          onChange={(e) => setFormData({ ...formData, lifetime: e.target.value })}
        >
          <MenuItem value="2592000000">30 Days</MenuItem>
          <MenuItem value="5184000000">60 Days</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Payout Schedule (JSON)"
        variant="outlined"
        margin="normal"
        value={formData.payoutSchedule}
        onChange={(e) => setFormData({ ...formData, payoutSchedule: e.target.value })}
        error={!validateSchedule(formData.payoutSchedule)}
        helperText={!validateSchedule(formData.payoutSchedule) && "Invalid JSON format"}
      />

      <Button 
        type="submit" 
        variant="contained" 
        size="large" 
        sx={{ mt: 2 }}
      >
        Create Group
      </Button>
    </Box>
  );
}