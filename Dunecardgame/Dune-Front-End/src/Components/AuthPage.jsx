import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthModal from './AuthModal';

const AuthPage = ({ setAuthToken, setIsAdmin }) => {
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
      console.log('Response Data:', response.data);  
      setAuthToken(response.data.token);
      setIsAdmin(response.data.is_admin);
      setError('');  
      setLoginOpen(false);
      navigate('/game');
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);  // Log the error response or message
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
      navigate('/');
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
      <Typography variant="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)', marginBottom: 4 }}>
        Welcome to the Dune Card Game
      </Typography>
      <Button
        variant="contained"
        onClick={() => setLoginOpen(true)}
        sx={{ backgroundColor: '#328ba8', color: 'white', '&:hover': { backgroundColor: '#e64a19' }, marginBottom: 2 }}
      >
        Login
      </Button>
      <Button
        variant="contained"
        onClick={() => setRegisterOpen(true)}
        sx={{ backgroundColor: '#328ba8', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}
      >
        Register
      </Button>

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
    </Box>
  );
};

export default AuthPage;
