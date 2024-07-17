import React, { useState, useEffect } from 'react';
import { Box, Typography, Card as MuiCard, CardContent, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';

const Arena = ({ player1Deck, setPlayer1Deck, player2Deck, setPlayer2Deck, username }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [swapCards, setSwapCards] = useState([]);
  const [selectedSwapCards, setSelectedSwapCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetCard, setTargetCard] = useState(null);
  const [activePlayer, setActivePlayer] = useState(1);

  useEffect(() => {
    if (activePlayer === 2) {
      botPlay();
    }
  }, [activePlayer]);

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
      setPlayer1Deck(newDeck);
    } else {
      setPlayer2Deck(newDeck);
    }

    setSelectedSwapCards([]);
    handleCloseModal();
  };

  const minimax = async (deck1, deck2, depth, isMaximizingPlayer, alpha = -Infinity, beta = Infinity) => {
    if (depth === 0 || deck1.length === 0 || deck2.length === 0) {
      return evaluateDecks(deck1, deck2);
    }
  
    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      for (let card of deck2) {
        const newDeck2 = deck2.filter(c => c !== card);
        const currentEval = await minimax(deck1, newDeck2, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, currentEval);
        alpha = Math.max(alpha, currentEval);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let card of deck1) {
        const newDeck1 = deck1.filter(c => c !== card);
        const currentEval = await minimax(newDeck1, deck2, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, currentEval);
        beta = Math.min(beta, currentEval);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  };
  
  const evaluateDecks = (deck1, deck2) => {
    // Custom evaluation function to assess the advantage of deck1 over deck2
    const deck1Score = deck1.reduce((acc, card) => acc + card.attack + card.defense, 0);
    const deck2Score = deck2.reduce((acc, card) => acc + card.attack + card.defense, 0);
    return deck1Score - deck2Score;
  };
  
  const botPlay = () => {
    if (player2Deck.length > 0) {
      let bestMove;
      let bestValue = -Infinity;
  
      for (let card of player2Deck) {
        const newDeck2 = player2Deck.filter(c => c !== card);
        const moveValue = minimax(player1Deck, newDeck2, 3, false); // depth of 3 for example
  
        if (moveValue > bestValue) {
          bestValue = moveValue;
          bestMove = card;
        }
      }
  
      const bestTargetCard = player1Deck.reduce((bestCard, currentCard) => {
        return evaluateCard(currentCard) > evaluateCard(bestCard) ? currentCard : bestCard;
      });
  
      setTargetCard(bestTargetCard);
      setSelectedCard(bestMove);
      resolveAttack();
    }
  };
  
  const handlePlayCard = (card) => {
    if (selectedCard) {
      setTargetCard(card);
    } else {
      setSelectedCard(card);
    }
  };

  const resolveAttack = () => {
    if (selectedCard && targetCard) {
      const updatedTargetCard = { ...targetCard, defense: targetCard.defense - selectedCard.attack };

      if (updatedTargetCard.defense <= 0) {
        if (activePlayer === 1) {
          setPlayer2Deck(player2Deck.filter(card => card.id !== targetCard.id));
        } else {
          setPlayer1Deck(player1Deck.filter(card => card.id !== targetCard.id));
        }
      } else {
        if (activePlayer === 1) {
          const updatedDeck = player2Deck.map(card => card.id === targetCard.id ? updatedTargetCard : card);
          setPlayer2Deck(updatedDeck);
        } else {
          const updatedDeck = player1Deck.map(card => card.id === targetCard.id ? updatedTargetCard : card);
          setPlayer1Deck(updatedDeck);
        }
      }

      setSelectedCard(null);
      setTargetCard(null);
      setActivePlayer(activePlayer === 1 ? 2 : 1);
    }
  };

  const endTurn = () => {
    setActivePlayer(activePlayer === 1 ? 2 : 1);
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
              onClick={() => player === activePlayer ? handlePlayCard(card) : setTargetCard(card)}
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
            <MuiCard sx={{ width: 180, height: 250, backgroundColor: 'gray', cursor: 'pointer', position: 'relative' }} onClick={() => handleOpenModal(player)}>
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
            <Typography variant="h4" sx={{ color: 'white', marginBottom: 2 }}>{username}</Typography>
            {renderCardRow(player1Deck, 1)}
            <Typography variant="h4" sx={{ color: 'white', marginBottom: 2, marginTop: 4 }}>Bot Player</Typography>
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








