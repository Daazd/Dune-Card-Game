import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');  // Redirect to the game page
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
        onClick={handleStartGame} 
        sx={{ 
          marginTop: 4,
          backgroundColor: '#328ba8',  // Custom background color
          color: 'white',  // Custom text color
          '&:hover': {
            backgroundColor: '#e64a19'  // Custom hover color
          }
        }}
      >
        Start Game
      </Button>
    </Box>
  );
};

export default Welcome;