import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid } from '@mui/material';
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
      <Grid container spacing={4} justifyContent="center">
        {cards.map((card) => (
          <Grid item key={card.id} >
            <FlippableCard card={card} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CardList;


