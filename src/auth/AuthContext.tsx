import React, { useReducer, useEffect } from 'react';
import type {
  AuthState,
  AuthContextType,
  LoginCredentials,
  User,
  OTPVerificationData,
  LoginResponse,
} from './types';
import { authApi, type ApiError } from '../services/api';
import { AuthContext } from './context';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth token on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Use API service for authentication
      const response = await authApi.login(credentials);

      // Check if OTP is required
      if (response.requiresOTP) {
        dispatch({ type: 'LOGIN_FAILURE' });
        return response;
      }

      // Direct login success (no OTP required)
      if (response.user && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      }

      return response;
    } catch (error: unknown) {
      dispatch({ type: 'LOGIN_FAILURE' });

      // Handle API errors
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        throw new Error(apiError.message);
      }

      throw new Error('Login failed. Please try again.');
    }
  };

  const verifyOTP = async (data: OTPVerificationData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Use API service for OTP verification
      const response = await authApi.verifyOTP(data);

      if (response.user && response.token) {
        // Store auth data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));

        dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      dispatch({ type: 'LOGIN_FAILURE' });

      // Handle API errors
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        throw new Error(apiError.message);
      }

      throw new Error('OTP verification failed. Please try again.');
    }
  };

  const resendOTP = async (email: string): Promise<void> => {
    try {
      await authApi.resendOTP(email);
    } catch (error: unknown) {
      // Handle API errors
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        throw new Error(apiError.message);
      }

      throw new Error('Failed to resend OTP. Please try again.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API
      await authApi.logout();
    } catch {
      console.warn('Logout API failed, but proceeding with local cleanup');
    } finally {
      // Always clear local data regardless of API success/failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    verifyOTP,
    resendOTP,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
