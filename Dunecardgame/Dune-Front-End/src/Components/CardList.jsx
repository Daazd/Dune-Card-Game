import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import FlippableCard from './FlippableCard';
import '../App.css';

const CardList = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cards/');
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <Container className="card-list-container" maxWidth={false}>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Link to="/game" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Back to Arena
          </Button>
        </Link>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {cards.map((card) => (
          <Grid item key={card.id}>
            <FlippableCard card={card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CardList;



