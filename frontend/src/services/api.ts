import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/users/signup', data);
    return response.data;
  },

  verifyEmail: async (data: { email: string; verificationCode: string }) => {
    const response = await api.post('/users/verify-email', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/users/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  sendOTP: async (email: string) => {
    const response = await api.post('/users/send-otp', { email });
    return response.data;
  },

  verifyOTP: async (data: { email: string; otp: string }) => {
    const response = await api.post('/users/verify-otp', data);
    return response.data;
  },
};

export const notificationService = {
  createNotification: async (data: {
    japaneseWord: string;
    englishMeaning: string;
    marathiMeaning: string;
    reminderTime: string;
  }) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  updateNotificationStatus: async (id: string, status: 'active' | 'inactive') => {
    const response = await api.patch(`/notifications/${id}/status`, { status });
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default api;
