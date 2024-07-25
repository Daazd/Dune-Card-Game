import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Box, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import FlippableCard from './FlippableCard';
import '../App.css';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cards/`);
        setCards(response.data);
        setFilteredCards(response.data); // Initialize filteredCards with all cards
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const results = cards.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.allegiance.toLowerCase().includes(searchTerm.toLowerCase()) // Add other fields as needed
    );
    setFilteredCards(results);
  }, [searchTerm, cards]);

  return (
    <Container className="card-list-container" maxWidth={false}>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Link to="/game" style={{ textDecoration: 'none' }}>
          <Button variant="contained"
            sx={{ 
              backgroundColor: '#ff6f00',
            }} >
            Back to Arena
          </Button>
        </Link>
      </Box>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <TextField
          label="Search Cards"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#b87333', // Change the border color
              },
              '&:hover fieldset': {
                borderColor: '#b87333', // Change the border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#b87333', // Change the border color when focused
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white', // Change the label color
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white', // Change the label color when focused
            },
            input: {
              color: 'white', 
            }
          }}
        />
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {filteredCards.map((card) => (
          <Grid item key={card.id}>
            <FlippableCard card={card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CardList;





