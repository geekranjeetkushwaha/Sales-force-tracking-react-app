import axios, { AxiosResponse } from 'axios';
import type { LoginCredentials, User } from '../auth/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Authentication API calls
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // For development/demo purposes, simulate API response
      if (process.env.NODE_ENV === 'development') {
        return mockLogin(credentials);
      }
      throw {
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status || 500,
      } as ApiError;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we still clear local data
      console.warn('Logout API call failed, but clearing local data');
    }
  },

  // Verify token
  verifyToken: async (): Promise<User> => {
    try {
      const response: AxiosResponse<{ user: User }> = await api.get('/auth/verify');
      return response.data.user;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Token verification failed',
        status: error.response?.status || 401,
      } as ApiError;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Token refresh failed',
        status: error.response?.status || 401,
      } as ApiError;
    }
  },
};

// Mock login for development/demo purposes
const mockLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock authentication logic
  if (credentials.email === 'admin@dalmia.com' && credentials.password === 'password') {
    return {
      user: {
        id: '1',
        name: 'Admin User',
        email: credentials.email,
        role: 'admin'
      },
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Login successful'
    };
  } else if (credentials.email === 'user@dalmia.com' && credentials.password === 'password') {
    return {
      user: {
        id: '2',
        name: 'Regular User',
        email: credentials.email,
        role: 'user'
      },
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Login successful'
    };
  } else {
    throw {
      message: 'Invalid email or password',
      status: 401,
    } as ApiError;
  }
};

export default api;