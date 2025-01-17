import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

const SecurityEnhancedLogin = ({ setAuthToken, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [keyboardPattern, setKeyboardPattern] = useState([]);
  const [startTime, setStartTime] = useState(null);
  
  const recordKeyTiming = (event) => {
    if (!startTime) setStartTime(Date.now());
    setKeyboardPattern(prev => [...prev, {
      key: event.key,
      time: Date.now() - startTime
    }]);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        username,
        password,
        keyboardPattern: JSON.stringify(keyboardPattern)
      });

      setAuthToken(response.data.token);
      setIsAdmin(response.data.is_admin);
      navigate('/game');
    } catch (error) {
      if (error.response?.status === 429) {
        setBlocked(true);
        setError('Account temporarily blocked due to suspicious activity');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 4,
      }}
    >
      {blocked && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Account temporarily blocked. Please try again later or contact support.
        </Alert>
      )}
      
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={recordKeyTiming}
        disabled={blocked}
      />
      
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={recordKeyTiming}
        disabled={blocked}
      />
      
      {error && <Typography color="error">{error}</Typography>}
      
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={blocked}
        sx={{
          backgroundColor: '#328ba8',
          '&:hover': { backgroundColor: '#e64a19' }
        }}
      >
        Login
      </Button>
    </Box>
  );
};

export default SecurityEnhancedLogin;