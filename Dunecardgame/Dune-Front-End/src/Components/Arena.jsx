import React, { useState } from 'react';
import { Box, Typography, Card as MuiCard, CardContent, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';

const Arena = ({ player1Deck, player2Deck, playCard, selectTarget, selectedCard, targetCard, activePlayer, drawCard, resolveAttack, endTurn }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [swapCards, setSwapCards] = useState([]);
  const [selectedSwapCards, setSelectedSwapCards] = useState([]);
  
  const handleOpenModal = (player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
    setSwapCards(player === 1 ? player1Deck.slice(5, 15) : player2Deck.slice(5, 15));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSelectSwapCard = (card) => {
    setSelectedSwapCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter(c => c !== card);
      } else if (prev.length < 3) {
        return [...prev, card];
      } else {
        return prev;
      }
    });
  };

  const handleConfirmSwap = () => {
    const playerDeck = selectedPlayer === 1 ? player1Deck : player2Deck;
    const newDeck = [...playerDeck];

    selectedSwapCards.forEach((card, index) => {
      newDeck[5 + index] = card;
    });

    if (selectedPlayer === 1) {
      player1Deck = newDeck;
    } else {
      player2Deck = newDeck;
    }

    setSelectedSwapCards([]);
    handleCloseModal();
  };

  const renderCardRow = (deck, player) => {
    const faceUpCards = deck.slice(0, 5);
    const faceDownStack = deck.slice(5);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', width: '100%' }}>
          {faceUpCards.map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => player === activePlayer ? playCard(card) : selectTarget(card)}
              sx={{
                width: 180,
                margin: 1,
                border: selectedCard === card || targetCard === card ? '2px solid red' : 'none',
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={`http://localhost:8000/media/dune_card_images/${card.image_file}`}
                alt={card.name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
            <MuiCard sx={{ width: 180, height: 250, backgroundColor: '#f0f0f0', cursor: 'pointer', position: 'relative' }} onClick={() => handleOpenModal(player)}>
              <CardContent>
                <Typography variant="body2">Deck: {faceDownStack.length} cards</Typography>
              </CardContent>
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {Array.from({ length: Math.min(3, faceDownStack.length) }).map((_, idx) => (
                  <CardMedia
                    key={idx}
                    component="img"
                    image={`http://localhost:8000/media/dune_card_images/House_Card_Back.jpg`}
                    alt="Face Down Card"
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: `${idx * 10}px`,
                      left: `${idx * 10}px`,
                      transform: `rotate(${idx * 2}deg)`,
                    }}
                  />
                ))}
              </Box>
            </MuiCard>
          </Box>
        )}
      </Box>
    );
  };

  const renderSwapModal = () => (
    <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="lg" fullWidth>
      <DialogTitle>Swap Cards</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {swapCards.map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => handleSelectSwapCard(card)}
              sx={{
                width: 180,
                margin: 1,
                border: selectedSwapCards.includes(card) ? '2px solid green' : '1px solid #000',
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={`http://localhost:8000/media/dune_card_images/${card.image_file}`}
                alt={card.name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <CardContent>
                <Typography variant="h6">{card.name}</Typography>
                <Typography variant="body2">Attack: {card.attack}</Typography>
                <Typography variant="body2">Defense: {card.defense}</Typography>
              </CardContent>
            </MuiCard>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">Cancel</Button>
        <Button onClick={handleConfirmSwap} color="primary" disabled={selectedSwapCards.length !== 3}>Confirm Swap</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ padding: 2, backgroundColor: '#282c34', minHeight: '100vh', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
      <Box sx={{ width: '100%', maxWidth: '2000px', marginBottom: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', marginBottom: 2 }}>Player 1</Typography>
            {renderCardRow(player1Deck, 1)}
            <Typography variant="h4" sx={{ color: 'white', marginBottom: 2, marginTop: 4 }}>Player 2</Typography>
            {renderCardRow(player2Deck, 2)}
          </Box>
          <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 4, marginTop: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>Selected Card</Typography>
            {selectedCard ? (
              <MuiCard sx={{ maxWidth: 345, marginBottom: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:8000/media/dune_card_images/${selectedCard.image_file}`}
                  alt={selectedCard.name}
                />
                <CardContent>
                  <Typography variant="h6">{selectedCard.name}</Typography>
                  <Typography variant="body2">Attack: {selectedCard.attack}</Typography>
                  <Typography variant="body2">Defense: {selectedCard.defense}</Typography>
                </CardContent>
              </MuiCard>
            ) : (
              <Typography sx={{ color: 'white', marginBottom: 2 }}>No card selected</Typography>
            )}
            <Button variant="contained" onClick={resolveAttack} disabled={!selectedCard || !targetCard} sx={{ marginBottom: 2 }}>Attack</Button>
            <Button variant="contained" onClick={endTurn} sx={{ marginBottom: 2 }}>End Turn</Button>
            <Link to="/cards">
              <Button variant="contained">View All Cards</Button>
            </Link>
          </Box>
        </Box>
      </Box>
      {renderSwapModal()}
    </Box>
  );
};

export default Arena;




