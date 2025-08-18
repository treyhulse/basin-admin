import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getAuthToken, removeAuthToken } from './auth';

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it
      removeAuthToken();
      // Redirect to login if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Generic items API calls
export const itemsAPI = {
  list: async (table: string, params?: {
    limit?: number;
    offset?: number;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
  }) => {
    const response = await api.get(`/items/${table}`, { params });
    return response.data;
  },
  
  get: async (table: string, id: string) => {
    const response = await api.get(`/items/${table}/${id}`);
    return response.data;
  },
  
  create: async (table: string, data: any) => {
    const response = await api.post(`/items/${table}`, data);
    return response.data;
  },
  
  update: async (table: string, id: string, data: any) => {
    const response = await api.put(`/items/${table}/${id}`, data);
    return response.data;
  },
  
  delete: async (table: string, id: string) => {
    const response = await api.delete(`/items/${table}/${id}`);
    return response.data;
  },
};

export default api;


