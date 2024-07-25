import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
});

export const getCards = async () => {
  try {
    const response = await axiosInstance.get('cards/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const getDecks = async () => {
  try {
    const response = await axiosInstance.get('decks/');
    return response.data;
  } catch (error) {
    console.error('Error fetching decks:', error);
    throw error;
  }
};

export const getCardsByDeck = async (deckName) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/decks/${deckName}/cards/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards by deck:', error);
    throw error;
  }
};






