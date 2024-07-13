import React from 'react';
import { Box, Typography, Card as MuiCard, CardContent, CardMedia } from '@mui/material';

const Arena = ({ player1Deck, player2Deck, playCard, selectTarget, selectedCard, targetCard, activePlayer }) => {
  const renderCardStack = (deck, player) => {
    const faceUpCards = deck.slice(0, 6);
    const faceDownStack = deck.length > 6 ? deck.slice(6) : [];

    return (
      <Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {faceUpCards.map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => player === activePlayer ? playCard(card) : selectTarget(card)}
              sx={{
                width: 150,
                margin: 1,
                border: selectedCard === card || targetCard === card ? '2px solid red' : 'none'
              }}
            >
              <CardMedia
                component="img"
                image={card.image_file}
                alt={card.name}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography variant="h6">{card.name}</Typography>
                <Typography variant="body2">Attack: {card.attack}</Typography>
                <Typography variant="body2">Defense: {card.defense}</Typography>
              </CardContent>
            </MuiCard>
          ))}
        </Box>
        {faceDownStack.length > 0 && (
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <MuiCard sx={{ width: 150, margin: 'auto', backgroundColor: '#f0f0f0' }}>
              <CardContent>
                <Typography variant="body2">Face Down Cards: {faceDownStack.length}</Typography>
              </CardContent>
            </MuiCard>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Player 1 Deck</Typography>
          {renderCardStack(player1Deck, 1)}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Player 2 Deck</Typography>
          {renderCardStack(player2Deck, 2)}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Selected Card</Typography>
        {selectedCard ? (
          <MuiCard>
            <CardMedia
              component="img"
              image={selectedCard.image_file}
              alt={selectedCard.name}
              sx={{ height: 200 }}
            />
            <CardContent>
              <Typography variant="h6">{selectedCard.name}</Typography>
              <Typography variant="body2">Attack: {selectedCard.attack}</Typography>
              <Typography variant="body2">Defense: {selectedCard.defense}</Typography>
            </CardContent>
          </MuiCard>
        ) : (
          <Typography sx={{ color: 'white' }}>No card selected</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Arena;









