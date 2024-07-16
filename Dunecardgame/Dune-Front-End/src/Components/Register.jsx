import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
        email,
      });
      navigate('/login');
    } catch (error) {
      setError('Failed to register');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: 'url(/images/Dune2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography variant="h4" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
        Register
      </Typography>
      <TextField
        label="Username"
        variant="filled"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        variant="filled"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Email"
        variant="filled"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleRegister} sx={{ backgroundColor: '#328ba8', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
