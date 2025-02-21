import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Typography, Select, MenuItem } from '@mui/material';
import Arena from './Components/Arena';
import Welcome from './Components/Welcome';
import CardList from './Components/CardList';
import Login from './Components/Login';
import Register from './Components/Register';
import Account from './Components/Account';
import UnifiedSecurityDashboard from './Components/UnifiedSecurityDashboard';
import MLModelVisualization from './Components/MLModelVisualization';
import AuthPage from './Components/AuthPage';
import { getCards, getDecks, getCardsByDeck } from './api';
import './App.css';
import axios from 'axios';
import axiosInstance from './api';
import { API_BASE_URL } from './api'; 
import { IconButton } from '@mui/material';
import CottageIcon from '@mui/icons-material/Cottage';
import Layout from './Components/Layout';
import { Navigate } from 'react-router-dom';


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
  const [authToken, setAuthToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

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
          const response = await axios.get(`${API_BASE_URL}/decks/${selectedDeck}/cards/`);
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

  const drawCard = (player) => {
    if (player === 1 && player1Deck.length > 8) {
      setPlayer1Deck([...player1Deck.slice(1), player1Deck[8]]);
    } else if (player === 2 && player2Deck.length > 8) {
      setPlayer2Deck([...player2Deck.slice(1), player2Deck[8]]);
    }
  };

  const resolveAttack = () => {
    if (selectedCard && targetCard) {
      targetCard.defense -= selectedCard.attack;
      if (targetCard.defense <= 0) {
        if (activePlayer === 1) {
          setPlayer2Deck(player2Deck.filter(card => card !== targetCard));
        } else {
          setPlayer1Deck(player1Deck.filter(card => card !== targetCard));
        }
      }
      setActivePlayer(activePlayer === 1 ? 2 : 1);
      setSelectedCard(null);
      setTargetCard(null);
    }
  };

  const endTurn = () => {
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    setSelectedCard(null);
    setTargetCard(null);
  
    if (activePlayer === 1) {
      setTimeout(botPlay, 1000); // Trigger bot play after a short delay
    }
  };

  const ProtectedRoute = ({ children, authToken, isAdmin }) => {
    if (!authToken || !isAdmin) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };

  return (
    <Layout>
        <Routes>
        <Route path="/" element={<Welcome setAuthToken={setAuthToken} setIsAdmin={setIsAdmin} authToken={authToken} isAdmin={isAdmin} setUsername={setUsername} />} />
          <Route path="/auth" element={<AuthPage setAuthToken={setAuthToken} setIsAdmin={setIsAdmin} setUsername={setUsername} />} />
          <Route path="/account" element={<Account authToken={authToken} />} />
          <Route path="/security-dashboard" 
                element={
                  <ProtectedRoute authToken={authToken} isAdmin={isAdmin}>
                    <Box sx={{ height: '100vh', bgcolor: 'background.dark' }}>
                      <UnifiedSecurityDashboard />
                    </Box>
                  </ProtectedRoute>
          } />
          <Route path="/game" element={
            <Container>
              <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                <Typography variant="h2" sx={{ color: '#e65100', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Dune Card Game Arena</Typography>
                <Typography variant="h5" sx={{ color: '#e65100', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Player {activePlayer}'s Turn</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, background: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: '#e65100' }}>Player 1</Typography>
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
                  <Typography variant="h4" sx={{ color: '#e65100' }}>Player 2</Typography>
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
                setPlayer1Deck={setPlayer1Deck} 
                player2Deck={player2Deck}
                setPlayer2Deck={setPlayer2Deck} 
                playCard={playCard} 
                selectTarget={selectTarget}
                username="Player 1"
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                setTargetCard={setTargetCard}  
                targetCard={targetCard} 
                activePlayer={activePlayer}
                setActivePlayer={setActivePlayer}
                drawCard={drawCard} 
                resolveAttack={resolveAttack}
                endTurn={endTurn}
              />
            </Container>
          } />
          <Route path="/cards" element={<CardList />} />
        </Routes>
    </Layout>
  );
};

export default App;


