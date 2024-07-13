// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Box, Typography, Select, MenuItem, Button } from '@mui/material';
import Arena from './Components/Arena';
import Welcome from './Components/Welcome';
import CardList from './Components/CardList';
import { getCards, getDecks, getCardsByDeck } from './api';
import './App.css';
import axios from 'axios';

const App = () => {
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [activePlayer, setActivePlayer] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetCard, setTargetCard] = useState(null);
  const [faction1, setFaction1] = useState('');
  const [faction2, setFaction2] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cardData = await getCards();
        setCards(cardData);
        const deckData = await getDecks();
        setDecks(deckData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchCardsByDeck = async () => {
      if (selectedDeck) {
        try {
          const response = await axios.get(`http://localhost:8000/api/decks/${selectedDeck}/cards/`);
          setCards(response.data);
        } catch (error) {
          console.error('Error fetching cards by deck:', error);
        }
      }
    };

    fetchCardsByDeck();
  }, [selectedDeck]);

  const handleChange = (event) => {
    setSelectedDeck(event.target.value);
  };

  const selectDeck = async (player, deckName) => {
    try {
      const selectedDeckCards = await getCardsByDeck(deckName);
      if (player === 1) setPlayer1Deck(selectedDeckCards);
      if (player === 2) setPlayer2Deck(selectedDeckCards);
    } catch (error) {
      console.error('Error fetching deck data:', error);
    }
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

      defender.resistance -= attacker.command;
      if (defender.resistance <= 0) {
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
                <Select
                  value={faction1}
                  onChange={(e) => {
                    setFaction1(e.target.value);
                    selectDeck(1, e.target.value);
                  }}
                  displayEmpty
                  sx={{ margin: 1, backgroundColor: '#673ab7', color: 'white' }}
                >
                  <MenuItem value="" disabled>Select Deck</MenuItem>
                  {decks.map(deck => (
                    <MenuItem key={deck} value={deck}>{deck}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'white' }}>Player 2</Typography>
                <Select
                  value={faction2}
                  onChange={(e) => {
                    setFaction2(e.target.value);
                    selectDeck(2, e.target.value);
                  }}
                  displayEmpty
                  sx={{ margin: 1, backgroundColor: '#673ab7', color: 'white' }}
                >
                  <MenuItem value="" disabled>Select Deck</MenuItem>
                  {decks.map(deck => (
                    <MenuItem key={deck} value={deck}>{deck}</MenuItem>
                  ))}
                </Select>
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
              <Link to="/cards">
                <Button variant="contained" sx={{ marginLeft: 2 }}>View All Cards</Button>
              </Link>
            </Box>
          </Container>
        } />
        <Route path="/cards" element={<CardList />} />
      </Routes>
    </Router>
  );
};

export default App;