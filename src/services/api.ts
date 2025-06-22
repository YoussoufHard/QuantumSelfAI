import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Configuration des API keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;
const PICA_API_KEY = import.meta.env.VITE_PICA_API_KEY;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quantum-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la connexion
      localStorage.removeItem('quantum-auth-token');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export { 
  api, 
  GEMINI_API_KEY, 
  ELEVENLABS_API_KEY, 
  TAVUS_API_KEY, 
  PICA_API_KEY,
  STRIPE_PUBLISHABLE_KEY 
};