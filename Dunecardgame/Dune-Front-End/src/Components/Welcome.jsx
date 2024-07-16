// src/Components/Welcome.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import AuthModal from './AuthModal';

const Welcome = ({ setAuthToken, setIsAdmin }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      setAuthToken(response.data.token);
      setIsAdmin(response.data.is_admin);
      setLoginOpen(false);
      navigate('/game');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
        email,
      });
      setRegisterOpen(false);
      navigate('/game');
    } catch (error) {
      setError('Failed to register');
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/Dune2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Typography variant="h1" component="div" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
        Welcome to the Dune Card Game
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/game')}
        sx={{
          marginTop: 4,
          backgroundColor: '#328ba8',
          color: 'white',
          '&:hover': {
            backgroundColor: '#e64a19'
          }
        }}
      >
        Start Game
      </Button>
      <IconButton
        onClick={() => setLoginOpen(true)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white'
        }}
      >
        <AccountCircle fontSize="large" />
      </IconButton>
      <AuthModal
        open={loginOpen}
        handleClose={() => setLoginOpen(false)}
        handleSubmit={handleLogin}
        isLogin={true}
        error={error}
        setUsername={setUsername}
        setPassword={setPassword}
      />
      <AuthModal
        open={registerOpen}
        handleClose={() => setRegisterOpen(false)}
        handleSubmit={handleRegister}
        isLogin={false}
        error={error}
        setUsername={setUsername}
        setPassword={setPassword}
        setEmail={setEmail}
      />
      <Button
        variant="contained"
        onClick={() => setRegisterOpen(true)}
        sx={{
          marginTop: 2,
          backgroundColor: '#328ba8',
          color: 'white',
          '&:hover': {
            backgroundColor: '#e64a19'
          }
        }}
      >
        Register
      </Button>
    </Box>
  );
};

export default Welcome;


