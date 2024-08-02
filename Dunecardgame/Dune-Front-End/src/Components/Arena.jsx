import React, { useState, useEffect } from 'react';
import { Box, Typography, Card as MuiCard, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CottageIcon from '@mui/icons-material/Cottage';
import { MEDIA_URL } from '../api'; 

const Arena = ({
  player1Deck,
  setPlayer1Deck,
  player2Deck,
  setPlayer2Deck,
  playCard,
  selectTarget,
  selectedCard,
  targetCard,
  setTargetCard,
  setSelectedCard,
  activePlayer,
  setActivePlayer,
  drawCard,
  resolveAttack,
  endTurn,
  username
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [swapDeckCards, setSwapDeckCards] = useState([]);
  const [selectedSwapCards, setSelectedSwapCards] = useState([]);
  const [selectedHandCards, setSelectedHandCards] = useState([]);
  const [swapAllowed, setSwapAllowed] = useState({ player1: true, player2: true });
  const navigate = useNavigate();

  useEffect(() => {
    if (activePlayer === 2) {
      botPlay();
      setTimeout(botPlay, 1000); // Give the browser some time to breathe and make the bot's actions more visible
    }
  }, [activePlayer]);

  const handleOpenModal = (player) => {
    if ((player === 1 && swapAllowed.player1) || (player === 2 && swapAllowed.player2)) {
      setSelectedPlayer(player);
      setModalOpen(true);
      const deck = player === 1 ? player1Deck.slice(5, 15) : player2Deck.slice(5, 15);
      setSwapDeckCards(deck);
    }
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

  const handleSelectHandCard = (card) => {
    setSelectedHandCards((prev) => {
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
    if (selectedHandCards.length !== selectedSwapCards.length) {
      return; // Ensure the same number of cards are selected for swapping
    }

    const playerDeck = selectedPlayer === 1 ? player1Deck : player2Deck;
    const newDeck = [...playerDeck];

    selectedHandCards.forEach((handCard, index) => {
      const handCardIndex = newDeck.indexOf(handCard);
      const swapCard = selectedSwapCards[index];
      const swapCardIndex = playerDeck.indexOf(swapCard);

      newDeck[handCardIndex] = swapCard;
      newDeck[swapCardIndex] = handCard;
    });

    if (selectedPlayer === 1) {
      setPlayer1Deck(newDeck);
      setSwapAllowed({ ...swapAllowed, player1: false });
    } else {
      setPlayer2Deck(newDeck);
      setSwapAllowed({ ...swapAllowed, player2: false });
    }

    setSelectedHandCards([]);
    setSelectedSwapCards([]);
    handleCloseModal();
  };

  const botPlay = () => {
    if (player2Deck.length > 0) {
      const botFaceUpCards = player2Deck.slice(0, 5);
      const botCard = botFaceUpCards[Math.floor(Math.random() * botFaceUpCards.length)];
      const playerFaceUpCards = player1Deck.slice(0, 5);
      const targetCard = playerFaceUpCards[Math.floor(Math.random() * playerFaceUpCards.length)];
      
      setSelectedCard(botCard);
      setTargetCard(targetCard);
      
      // Add a delay to make the bot's actions more visible
      setTimeout(() => {
        resolveAttack();
        // End the bot's turn after attacking
        setTimeout(() => {
          setActivePlayer(1);
          setSelectedCard(null);
          setTargetCard(null);
        }, 1000);
      }, 1000);
    } else {
      // If the bot has no cards, end its turn
      setActivePlayer(1);
    }
  };

  const renderCardRow = (deck, player) => {
    const faceUpCards = deck.slice(0, 5);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', width: '100%' }}>
        {faceUpCards.map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => {
                if (activePlayer === 1) {
                  if (player === 1) {
                    playCard(card);
                  } else {
                    selectTarget(card);
                  }
                }
            }}
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
              image={`${MEDIA_URL}dune_card_images/${card.image_file}`}
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
    );
  };

  const renderDeck = (deck, player) => {
    const faceDownStack = deck.slice(5);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
        {faceDownStack.length > 0 && (
          <MuiCard sx={{ width: 180, height: 250, backgroundColor: 'gray', cursor: 'pointer', position: 'relative' }} onClick={() => handleOpenModal(player)}>
            <CardContent>
              <Typography variant="body2">Deck: {faceDownStack.length} cards</Typography>
            </CardContent>
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              {Array.from({ length: Math.min(3, faceDownStack.length) }).map((_, idx) => (
                <CardMedia
                  key={idx}
                  component="img"
                  image={`${MEDIA_URL}dune_card_images/House_Card_Back.jpg`}
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
        )}
      </Box>
    );
  };

  const renderSwapModal = () => (
    <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#3949ab', color: "#e65100" }}>Swap Cards</DialogTitle>
      <DialogContent sx={{ backgroundColor: '#455a64' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {swapDeckCards.map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => handleSelectSwapCard(card)}
              sx={{
                width: 180,
                margin: 1,
                border: selectedSwapCards.includes(card) ? '2px solid blue' : '1px solid #000',
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={`${MEDIA_URL}dune_card_images/${card.image_file}`}
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
          {selectedPlayer === 1 ? player1Deck.slice(0, 5).map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => handleSelectHandCard(card)}
              sx={{
                width: 180,
                margin: 1,
                border: selectedHandCards.includes(card) ? '2px solid green' : '1px solid #000',
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={`${MEDIA_URL}dune_card_images/${card.image_file}`}
                alt={card.name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <CardContent>
                <Typography variant="h6">{card.name}</Typography>
                <Typography variant="body2">Attack: {card.attack}</Typography>
                <Typography variant="body2">Defense: {card.defense}</Typography>
              </CardContent>
            </MuiCard>
          )) : player2Deck.slice(0, 5).map((card, index) => (
            <MuiCard
              key={index}
              onClick={() => handleSelectHandCard(card)}
              sx={{
                width: 180,
                margin: 1,
                border: selectedHandCards.includes(card) ? '2px solid green' : '1px solid #000',
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={`${MEDIA_URL}dune_card_images/${card.image_file}`}
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
      <DialogActions sx={{ backgroundColor: '#3949ab' }}>
        <Button onClick={handleCloseModal} sx={{color: "#e65100" }}>Cancel</Button>
        <Button onClick={handleConfirmSwap} sx={{color: "#e65100" }} disabled={selectedSwapCards.length !== 3 || selectedHandCards.length !== 3}>Confirm Swap</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ padding: 2, backgroundColor: '#282c34', minHeight: '100vh', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
      <Box sx={{ width: '100%', maxWidth: '2000px', marginBottom: 4 }}>
        {/* Player 1 Deck */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
          <Typography variant="h4" sx={{ color: '#e65100', marginBottom: 2 }}>{username}</Typography>
          {renderDeck(player1Deck, 1)}
          {renderCardRow(player1Deck, 1)}
        </Box>

        {/* Selected Card and Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginY: 4 }}>
          <Typography variant="h6" sx={{ color: '#e65100', marginBottom: 2 }}>Selected Card</Typography>
          {selectedCard ? (
            <MuiCard sx={{ color: '#e65100', maxWidth: 345, marginBottom: 2, backgroundColor: 'black' }}>
              <CardMedia
                component="img"
                height="200"
                image={`${MEDIA_URL}dune_card_images/${selectedCard.image_file}`}
                alt={selectedCard.name}
              />
              <CardContent sx={{ color: '#e65100', marginBottom: 2 }}>
                <Typography variant="h6">{selectedCard.name}</Typography>
                <Typography variant="body2">Attack: {selectedCard.attack}</Typography>
                <Typography variant="body2">Defense: {selectedCard.defense}</Typography>
              </CardContent>
            </MuiCard>
          ) : (
            <Typography sx={{ color: '#e65100', marginBottom: 2 }}>No card selected</Typography>
          )}
          <Button variant="contained" onClick={() => {
            resolveAttack();
            // Switch to bot's turn after player attacks
            setTimeout(() => setActivePlayer(2), 1000);
            }} 
            disabled={!selectedCard || !targetCard || activePlayer !== 1} 
            sx={{ marginBottom: 2, backgroundColor: '#673ab7' }}
          >
            Attack
          </Button>
          <Button variant="contained" onClick={endTurn} disabled={activePlayer !== 1} sx={{ marginBottom: 2, backgroundColor: '#673ab7' }}>End Turn</Button>
          <Link to="/cards">
            <Button variant="contained" sx={{ backgroundColor: '#673ab7' }}>View All Cards</Button>
          </Link>
        </Box>

        {/* Player 2 Deck */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
          {renderCardRow(player2Deck, 2, { marginLeft: '-40px' })} {/* Adjust margin to move row slightly left */}
          {renderDeck(player2Deck, 2)}
          <Typography variant="h4" sx={{ color: '#e65100', marginBottom: 2 }}>Bot Player</Typography>
        </Box>
      </Box>

      {renderSwapModal()}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          color: '#673ab7',
          position: 'fixed',
          top: 16,
          right: 16,
        }}
      >
        <CottageIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default Arena;
