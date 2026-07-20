import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api' 
    : '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// API endpoints
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Comprehensive analysis
  comprehensiveAnalysis: (data) => api.post('/comprehensive-analysis', data),

  // Pest detection
  pestDetection: (data) => api.post('/pest-detection', data),

  // Market prediction
  marketPrediction: (data) => api.post('/market-prediction', data),

  // Performance metrics
  getPerformance: () => api.get('/performance'),

  // Data history
  getDataHistory: (params = {}) => api.get('/data-history', { params }),

  // Individual endpoints
  cropRecommendation: (data) => api.post('/crop-recommendation', data),
  yieldPrediction: (data) => api.post('/yield-prediction', data),
  fertilizerSuggestion: (data) => api.post('/fertilizer-suggestion', data),
  irrigationSchedule: (data) => api.post('/irrigation-schedule', data),
};

export default api;