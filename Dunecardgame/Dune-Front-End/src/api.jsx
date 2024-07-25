import axios from 'axios';

const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
});

export const getCards = async () => {
  console.log('Fetching cards from:', API_BASE_URL + '/cards/');
  try {
    const response = await axiosInstance.get('cards/');
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
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
    const response = await axiosInstance.get(`decks/${deckName}/cards/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards by deck:', error);
    throw error;
  }
};






