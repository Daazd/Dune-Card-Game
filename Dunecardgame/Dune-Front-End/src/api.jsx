import axios from 'axios';

// export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dune-backen.onrender.com/api';
// export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'https://dune-backen.onrender.com/media/';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000/media/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Increased timeout to 5000ms or 5 seconds
  withCredentials: true,
});

console.log('API_BASE_URL:', API_BASE_URL);
console.log('MEDIA_URL:', MEDIA_URL);

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
  console.log('Fetching decks from:', API_BASE_URL + '/decks/');
  try {
    const response = await axiosInstance.get('decks/');
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching decks:', error);
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

export const getCardsByDeck = async (deckName) => {
  console.log(`Fetching cards for deck: ${deckName} from: ${API_BASE_URL}/decks/${deckName}/cards/`);
  try {
    const response = await axiosInstance.get(`decks/${deckName}/cards/`);
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards for deck ${deckName}:`, error);
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

export const startDemo = async (type) => {
    setDemoState(type);
    setAlerts([]);
    
    try {
        await fetch('/api/simulation/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type })
        });
        
        // Start SSE connection for real-time updates
        const eventSource = new EventSource('/api/events/');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setRealtimeData(prev => [...prev.slice(-19), data]);
        };
        
        // Cleanup
        return () => eventSource.close();
    } catch (error) {
        console.error('Failed to start simulation:', error);
    }
};

export default axiosInstance;




