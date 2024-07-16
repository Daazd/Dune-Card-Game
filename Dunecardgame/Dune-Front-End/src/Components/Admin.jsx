// src/Components/Game.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Admin = ({ authToken, isAdmin }) => {
  const navigate = useNavigate();

  const handleAdminTask = () => {
    if (!isAdmin) {
      alert('Access denied. Admins only.');
      return;
    }
    // Perform admin tasks
    
  };

  return (
    <Box>
      <Typography variant="h4">Game Board</Typography>
      {isAdmin && (
        <Button variant="contained" onClick={handleAdminTask}>
          Perform Admin Task
        </Button>
      )}
      {/* Game content goes here */}
    </Box>
  );
};

export default Admin;
