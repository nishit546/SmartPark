import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Attaches the current Firebase ID token to every outgoing request
api.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Could not attach auth token:', error.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Centralised error handling: logs, normalises, and re-throws
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (!response) {
      // Network error or server unreachable
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const status = response.status;
    const message = response.data?.message || error.message;

    if (status === 401) {
      // Token expired – clear local auth data and redirect to login
      localStorage.removeItem('smartpark_user_role');
      localStorage.removeItem('smartpark_guest_mode');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    if (status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }

    if (status === 404) {
      return Promise.reject(new Error(message || 'Resource not found.'));
    }

    if (status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(new Error(message || 'An unexpected error occurred.'));
  }
);

export const parkingService = {
  getZones: async () => {
    const response = await api.get('/zones');
    return response.data;
  },
  getZoneById: async (id) => {
    const response = await api.get(`/zones/${id}`);
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  getUserBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/bookings/${id}/status`, statusData);
    return response.data;
  },
};

export const valetService = {
  createValetRequest: async (bookingId) => {
    const response = await api.post('/valet', { bookingId });
    return response.data;
  },
  getValetStatus: async (bookingId) => {
    const response = await api.get(`/valet/${bookingId}`);
    return response.data;
  },
  updateValetStatus: async (bookingId, statusData) => {
    const response = await api.patch(`/valet/${bookingId}/status`, statusData);
    return response.data;
  },
};

export const userService = {
  syncUser: async (userData) => {
    const response = await api.post('/users/sync', userData);
    return response.data;
  },
  getUser: async (firebaseUid) => {
    const response = await api.get(`/users/${firebaseUid}`);
    return response.data;
  },
};

export default api;
