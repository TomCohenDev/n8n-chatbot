import axios from 'axios';
import { N8N_API_URL, N8N_API_KEY } from './constants';

export const n8nApiClient = axios.create({
  baseURL: N8N_API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(N8N_API_KEY && { 'X-N8N-API-KEY': N8N_API_KEY }),
  },
});

// Add request interceptor for logging
n8nApiClient.interceptors.request.use(
  (config) => {
    console.log(`[n8n API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[n8n API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
n8nApiClient.interceptors.response.use(
  (response) => {
    console.log(`[n8n API] Response:`, response.status);
    return response;
  },
  (error) => {
    console.error('[n8n API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
