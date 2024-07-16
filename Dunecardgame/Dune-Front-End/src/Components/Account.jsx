import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Account = ({ authToken }) => {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        setUserData(response.data);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [authToken]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:8000/api/user/', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
      }, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      setMessage('User details updated successfully');
    } catch (error) {
      console.error('Error updating user details:', error);
      setMessage('Failed to update user details');
    }
  };

  return (
    <Box sx={{ background: 'gray', padding: 4 }}>
      <Typography variant="h4">Account Information</Typography>
      <TextField
        label="Username"
        variant="filled"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        sx={{ marginBottom: 2 }}
        fullWidth
      />
      <TextField
        label="Email"
        variant="filled"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        sx={{ marginBottom: 2 }}
        fullWidth
      />
      <TextField
        label="New Password"
        type="password"
        variant="filled"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ marginBottom: 2 }}
        fullWidth
      />
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}  // Use navigate function to go to the welcome page
        sx={{ backgroundColor: '#328ba8', color: 'white', '&:hover': { backgroundColor: '#e64a19' }}}
      >
        Back to Home 
      </Button>
      <Button variant="contained" onClick={handleUpdate} sx={{ backgroundColor: '#328ba8', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}>
        Update Details
      </Button>
      {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default Account;

