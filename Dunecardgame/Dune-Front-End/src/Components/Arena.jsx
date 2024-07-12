import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Card from './Card';

const Arena = ({ player1Deck, player2Deck, playCard, selectTarget, selectedCard, targetCard, activePlayer, selectDeck }) => {
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/images/Dune3.jpg)',  // Ensure this path is correct
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}
    >
      <Typography variant="h2" component="div" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)', marginBottom: 2 }}>
        Dune Card Game Arena
      </Typography>
      <Typography variant="h5" component="div" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)', marginBottom: 4 }}>
        Player {activePlayer}'s Turn
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', padding: 2 }}>
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 2, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', textAlign: 'center', marginBottom: 2 }}>Player 1 Deck</Typography>
          <Button 
            onClick={() => selectDeck(1, 'Bene Gesserit')} 
            sx={{ marginBottom: 2, backgroundColor: '#673ab7', color: 'white', '&:hover': { backgroundColor: '#5e35b1' } }}
          >
            Select Bene Gesserit Deck
          </Button>
          <Button 
            onClick={() => selectDeck(1, 'Fremen')} 
            sx={{ marginBottom: 2, backgroundColor: '#009688', color: 'white', '&:hover': { backgroundColor: '#00897b' } }}
          >
            Select Fremen Deck
          </Button>
          <Button 
            onClick={() => selectDeck(1, 'Empire')} 
            sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}
          >
            Select Empire Deck
          </Button>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
            {player1Deck.map((card, index) => (
              <Card 
                key={index} 
                {...card} 
                onClick={() => activePlayer === 1 ? playCard(card) : selectTarget(card)} 
                selected={card === selectedCard || card === targetCard} 
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 2, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', textAlign: 'center', marginBottom: 2 }}>Player 2 Deck</Typography>
          <Button 
            onClick={() => selectDeck(2, 'Bene Gesserit')} 
            sx={{ marginBottom: 2, backgroundColor: '#673ab7', color: 'white', '&:hover': { backgroundColor: '#5e35b1' } }}
          >
            Select Bene Gesserit Deck
          </Button>
          <Button 
            onClick={() => selectDeck(2, 'Fremen')} 
            sx={{ marginBottom: 2, backgroundColor: '#009688', color: 'white', '&:hover': { backgroundColor: '#00897b' } }}
          >
            Select Fremen Deck
          </Button>
          <Button 
            onClick={() => selectDeck(2, 'Empire')} 
            sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}
          >
            Select Empire Deck
          </Button>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
            {player2Deck.map((card, index) => (
              <Card 
                key={index} 
                {...card} 
                onClick={() => activePlayer === 2 ? playCard(card) : selectTarget(card)} 
                selected={card === selectedCard || card === targetCard} 
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Selected Card</Typography>
        {selectedCard ? <Card {...selectedCard} /> : <Typography sx={{ color: 'white' }}>No card selected</Typography>}
      </Box>
    </Box>
  );
};

export default Arena;


