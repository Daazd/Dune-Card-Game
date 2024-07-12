import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import Arena from './Components/Arena';
import Welcome from './Components/Welcome';
import './App.css';

const App = () => {
  const initialCards = {
    'Bene Gesserit': [
      {
        name: 'Reverend Mother',
        faction: 'Bene Gesserit',
        attack: 5,
        defense: 3,
        abilities: ['Voice Command', 'Truthsayer'],
        image: 'path/to/reverend-mother.jpg'
      },
      {
        name: 'Sisterhood Acolyte',
        faction: 'Bene Gesserit',
        attack: 2,
        defense: 2,
        abilities: ['Stealth', 'Agility'],
        image: 'path/to/sisterhood-acolyte.jpg'
      }
    ],
    'Fremen': [
      {
        name: 'Stilgar',
        faction: 'Fremen',
        attack: 6,
        defense: 4,
        abilities: ['Desert Ambush', 'Sandwalking'],
        image: 'path/to/stilgar.jpg'
      },
      {
        name: 'Chani',
        faction: 'Fremen',
        attack: 4,
        defense: 3,
        abilities: ['Skilled Fighter', 'Loyalty'],
        image: 'path/to/chani.jpg'
      }
    ],
    'Empire': [
      {
        name: 'Emperor Shaddam IV',
        faction: 'Empire',
        attack: 7,
        defense: 5,
        abilities: ['Imperial Command', 'Treachery'],
        image: 'path/to/emperor-shaddam-iv.jpg'
      },
      {
        name: 'Sardaukar Soldier',
        faction: 'Empire',
        attack: 3,
        defense: 3,
        abilities: ['Elite Training', 'Fearless'],
        image: 'path/to/sardaukar-soldier.jpg'
      }
    ]
  };

  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [activePlayer, setActivePlayer] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetCard, setTargetCard] = useState(null);

  const selectDeck = (player, faction) => {
    if (player === 1) setPlayer1Deck(initialCards[faction]);
    if (player === 2) setPlayer2Deck(initialCards[faction]);
  };

  const playCard = (card) => {
    if (activePlayer === 1 && player1Deck.includes(card)) {
      setSelectedCard(card);
    } else if (activePlayer === 2 && player2Deck.includes(card)) {
      setSelectedCard(card);
    }
  };

  const selectTarget = (card) => {
    if (activePlayer === 1 && player2Deck.includes(card)) {
      setTargetCard(card);
    } else if (activePlayer === 2 && player1Deck.includes(card)) {
      setTargetCard(card);
    }
  };

  const resolveAttack = () => {
    if (selectedCard && targetCard) {
      const attacker = { ...selectedCard };
      const defender = { ...targetCard };

      defender.defense -= attacker.attack;
      if (defender.defense <= 0) {
        if (activePlayer === 1) {
          setPlayer2Deck(player2Deck.filter(card => card !== targetCard));
        } else {
          setPlayer1Deck(player1Deck.filter(card => card !== targetCard));
        }
      }

      setSelectedCard(null);
      setTargetCard(null);
      setActivePlayer(activePlayer === 1 ? 2 : 1);
    }
  };

  const endTurn = () => {
    setSelectedCard(null);
    setTargetCard(null);
    setActivePlayer(activePlayer === 1 ? 2 : 1);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={
          <Container>
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <Typography variant="h2" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Dune Card Game Arena</Typography>
              <Typography variant="h5" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Player {activePlayer}'s Turn</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, background: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'white' }}>Player 1</Typography>
                <Button 
                  onClick={() => selectDeck(1, 'Bene Gesserit')} 
                  sx={{ margin: 1, backgroundColor: '#673ab7', color: 'white', '&:hover': { backgroundColor: '#5e35b1' } }}>
                  Select Bene Gesserit Deck
                </Button>
                <Button 
                  onClick={() => selectDeck(1, 'Fremen')} 
                  sx={{ margin: 1, backgroundColor: '#009688', color: 'white', '&:hover': { backgroundColor: '#00897b' } }}>
                  Select Fremen Deck
                </Button>
                <Button 
                  onClick={() => selectDeck(1, 'Empire')} 
                  sx={{ margin: 1, backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}>
                  Select Empire Deck
                </Button>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'white' }}>Player 2</Typography>
                <Button 
                  onClick={() => selectDeck(2, 'Bene Gesserit')} 
                  sx={{ margin: 1, backgroundColor: '#673ab7', color: 'white', '&:hover': { backgroundColor: '#5e35b1' } }}>
                  Select Bene Gesserit Deck
                </Button>
                <Button 
                  onClick={() => selectDeck(2, 'Fremen')} 
                  sx={{ margin: 1, backgroundColor: '#009688', color: 'white', '&:hover': { backgroundColor: '#00897b' } }}>
                  Select Fremen Deck
                </Button>
                <Button 
                  onClick={() => selectDeck(2, 'Empire')} 
                  sx={{ margin: 1, backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}>
                  Select Empire Deck
                </Button>
              </Box>
            </Box>
            <Arena 
              player1Deck={player1Deck} 
              player2Deck={player2Deck} 
              playCard={playCard} 
              selectTarget={selectTarget}
              selectedCard={selectedCard} 
              targetCard={targetCard} 
              activePlayer={activePlayer}
              selectDeck={selectDeck} 
            />
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
              <Button variant="contained" onClick={resolveAttack} disabled={!selectedCard || !targetCard}>Attack</Button>
              <Button variant="contained" onClick={endTurn} sx={{ marginLeft: 2 }}>End Turn</Button>
            </Box>
          </Container>
        } />
      </Routes>
    </Router>
  );
};

export default App;