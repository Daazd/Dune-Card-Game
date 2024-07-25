import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import AuthModal from './AuthModal';

const Welcome = ({ setAuthToken, setIsAdmin, authToken, isAdmin }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_MEDIA_URL}/api/login/`, {
        username,
        password,
      });

      console.log('Response Data:', response.data);  // Log the response data for debugging
      setAuthToken(response.data.token);
      setIsAdmin(response.data.is_admin);
      setError('');  // Clear any previous error
      setLoginOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);  // Log the error response or message
      setError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_MEDIA_URL}/api/register/`, {
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

  const handleAdminClick = () => {
    window.location.href = `${process.env.REACT_APP_MEDIA_URL}/admin/`;
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
      <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => setLoginOpen(true)}
          sx={{
            color: 'white',
            marginRight: isAdmin ? 2 : 0
          }}
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        {isAdmin && (
          <IconButton
            onClick={handleAdminClick}
            sx={{
              color: 'white',
            }}
          >
            <AdminPanelSettings fontSize="large" />
          </IconButton>
        )}
        {authToken && (
          <IconButton
            onClick={() => navigate('/account')}
            sx={{
              color: 'white',
              marginLeft: 2,
            }}
          >
            <PersonIcon fontSize="large" />
          </IconButton>
        )}
      </Box>
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
