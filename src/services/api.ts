import axios, { type AxiosResponse } from 'axios';
import type {
  LoginCredentials,
  User,
  OTPVerificationData,
  DalmiaLoginPayload,
} from '../auth/types';
import { API_CONFIG, AUTH_ENDPOINTS } from './endpoints';
import {
  generateDeviceId,
  getDeviceType,
  APP_CONFIG,
  simpleEncrypt,
  generateReferenceId,
} from '../utils/deviceUtils';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token and device information
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['access-token'] = token;
      config.headers['x-access-token'] = token;
    }

    // Add device information to all requests
    const deviceId = generateDeviceId();
    config.headers['deviceid'] = deviceId;
    config.headers['model'] = getDeviceType();
    config.headers['brand'] = 'Web Browser';
    config.headers['buildversion'] = APP_CONFIG.BUILD_VERSION;
    config.headers['appversion'] = APP_CONFIG.APP_VERSION;

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
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
  user?: User;
  token?: string;
  message?: string;
  requiresOTP?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

// Dalmia API Response Structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DalmiaApiResponse<T = any> {
  resp_code: string; // Only 'DM1002' indicates success
  resp_msg: string; // Human readable message
  resp_body: T | null; // Data payload (null for errors)
}

/**
 * Check if Dalmia API response is successful
 * @param response - Dalmia API response object
 * @returns true only if resp_code is exactly 'DM1002'
 */
export const isDalmiaSuccess = (response: DalmiaApiResponse): boolean => {
  return response.resp_code === 'DM1002';
};

/**
 * Dalmia API Response Codes:
 * - DM1002: Success
 * - DM1001: Invalid credentials/mobile number
 * - DM1003: Invalid OTP
 * - DM1004: Unauthorized user
 * - DM1005: Session expired
 * - DM1006: OTP expired
 * - DM1007: Too many failed attempts
 */

// Authentication API calls
export const authApi = {
  // Login user with OTP (Dalmia API structure)
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Prepare Dalmia API payload
      const deviceId = generateDeviceId();
      const referenceId = generateReferenceId();

      // Create the payload structure as per Dalmia API
      const payload: DalmiaLoginPayload = {
        appName: APP_CONFIG.APP_NAME,
        appVersion: APP_CONFIG.APP_VERSION,
        deviceId: deviceId,
        deviceType: getDeviceType(),
        mobileNumber: simpleEncrypt(credentials.email), // Using email as mobile number for web
        referenceId: simpleEncrypt(referenceId),
      };

      // Additional headers specific to the login request
      const config = {
        headers: {
          'mobile-number': '',
          usertype: 'null',
          'x-referenceid': '',
          locationaccuracytype: '',
          'reference-id': '',
          referenceid: '',
        },
      };

      const response: AxiosResponse<DalmiaApiResponse> = await api.post(
        AUTH_ENDPOINTS.LOGIN_OTP,
        payload,
        config
      );

      console.log('Dalmia Login API Response:', response.data);

      // Parse Dalmia API response structure - ONLY DM1002 is success
      if (response.data) {
        if (response.data.resp_code === 'DM1002') {
          // Success - DM1002 response code
          return {
            requiresOTP: true,
            message: response.data.resp_msg || 'OTP sent successfully',
          };
        } else {
          // Any other resp_code is treated as error
          throw {
            message: response.data.resp_msg || 'Login failed',
            status: response.status || 400,
            dalmiaCode: response.data.resp_code,
          } as ApiError & { dalmiaCode: string };
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      // For development/demo purposes, simulate API response
      const isNetworkError =
        error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK';
      if (import.meta.env.DEV || isNetworkError) {
        console.log('Using mock API for development');
        return mockLogin(credentials);
      }

      // Handle Dalmia API errors - if resp_code is not DM1002, show resp_msg as error
      const hasApiError =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'resp_code' in error.response.data;
      if (hasApiError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiErr = error as any;
        throw {
          message: apiErr.response.data.resp_msg || 'Login failed',
          status: apiErr.response.status || 400,
          dalmiaCode: apiErr.response.data.resp_code,
        } as ApiError & { dalmiaCode: string };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      throw {
        message: err?.message || 'Login failed',
        status: err?.response?.status || 500,
      } as ApiError;
    }
  },

  // Verify OTP and complete login
  verifyOTP: async (data: OTPVerificationData): Promise<LoginResponse> => {
    try {
      // Prepare Dalmia OTP verification payload
      const deviceId = generateDeviceId();
      const referenceId = generateReferenceId();

      const payload = {
        appName: APP_CONFIG.APP_NAME,
        appVersion: APP_CONFIG.APP_VERSION,
        deviceId: deviceId,
        deviceType: getDeviceType(),
        mobileNumber: simpleEncrypt(data.email),
        referenceId: simpleEncrypt(referenceId),
        otp: data.otp,
      };

      const response: AxiosResponse<DalmiaApiResponse> = await api.post(
        AUTH_ENDPOINTS.VERIFY_OTP,
        payload
      );

      console.log('Dalmia OTP Verify API Response:', response.data);

      // Parse Dalmia API response structure - ONLY DM1002 is success
      if (response.data) {
        if (response.data.resp_code === 'DM1002' && response.data.resp_body) {
          // Success - DM1002 response code with user data
          const userData = response.data.resp_body;
          return {
            user: {
              id: userData.userId || userData.id || '1',
              name: userData.userName || userData.name || 'User',
              email: data.email,
              role: userData.userRole || userData.role || 'user',
            },
            token: userData.accessToken || userData.token,
            message: response.data.resp_msg || 'OTP verified successfully',
          };
        } else {
          // Any other resp_code is treated as error
          throw {
            message: response.data.resp_msg || 'OTP verification failed',
            status: response.status || 400,
            dalmiaCode: response.data.resp_code,
          } as ApiError & { dalmiaCode: string };
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      // For development/demo purposes, simulate API response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      if (import.meta.env.DEV || apiError?.code === 'ERR_NETWORK') {
        console.log('Using mock OTP verification for development');
        return mockVerifyOTP(data);
      }

      // Handle Dalmia API errors
      if (apiError?.response?.data?.resp_code) {
        throw {
          message: apiError.response.data.resp_msg || 'OTP verification failed',
          status: apiError.response.status || 400,
          dalmiaCode: apiError.response.data.resp_code,
        } as ApiError & { dalmiaCode: string };
      }

      throw {
        message: apiError?.message || 'OTP verification failed',
        status: apiError?.response?.status || 400,
      } as ApiError;
    }
  },

  // Resend OTP (use the same login endpoint)
  resendOTP: async (email: string): Promise<void> => {
    try {
      // Use the same login endpoint to resend OTP
      const deviceId = generateDeviceId();
      const referenceId = generateReferenceId();

      const payload: DalmiaLoginPayload = {
        appName: APP_CONFIG.APP_NAME,
        appVersion: APP_CONFIG.APP_VERSION,
        deviceId: deviceId,
        deviceType: getDeviceType(),
        mobileNumber: simpleEncrypt(email),
        referenceId: simpleEncrypt(referenceId),
      };

      const response: AxiosResponse<DalmiaApiResponse> = await api.post(
        AUTH_ENDPOINTS.LOGIN_OTP,
        payload
      );

      console.log('Dalmia Resend OTP API Response:', response.data);

      // Check Dalmia response - ONLY DM1002 is success
      if (response.data && response.data.resp_code !== 'DM1002') {
        throw {
          message: response.data.resp_msg || 'Failed to resend OTP',
          status: response.status || 400,
          dalmiaCode: response.data.resp_code,
        } as ApiError & { dalmiaCode: string };
      }
    } catch (error) {
      // For development/demo purposes, simulate API response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      if (import.meta.env.DEV || apiError?.code === 'ERR_NETWORK') {
        console.log('Using mock resend OTP for development');
        return mockResendOTP(email);
      }

      // Handle Dalmia API errors
      if (apiError?.response?.data?.resp_code) {
        throw {
          message: apiError.response.data.resp_msg || 'Failed to resend OTP',
          status: apiError.response.status || 400,
          dalmiaCode: apiError.response.data.resp_code,
        } as ApiError & { dalmiaCode: string };
      }

      throw {
        message: apiError?.message || 'Failed to resend OTP',
        status: apiError?.response?.status || 400,
      } as ApiError;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch {
      // Even if logout fails on server, we still clear local data
      console.warn('Logout API call failed, but clearing local data');
    }
  },

  // Verify token
  verifyToken: async (): Promise<User> => {
    try {
      const response: AxiosResponse<{ user: User }> = await api.get(AUTH_ENDPOINTS.VERIFY_TOKEN);
      return response.data.user;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Token verification failed',
        status: apiError?.response?.status || 401,
      } as ApiError;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as any;
      throw {
        message: apiError?.response?.data?.message || 'Token refresh failed',
        status: apiError?.response?.status || 401,
      } as ApiError;
    }
  },
};

// Mock functions for development/demo purposes that simulate Dalmia API structure
const mockLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Mock Login API called with:', credentials);

  // Mock different scenarios for testing Dalmia API responses
  if (credentials.email === 'unauthorized@test.com' || credentials.email === 'blocked@dalmia.com') {
    // Simulate DM1004 error response structure
    const mockDalmiaErrorResponse = {
      resp_code: 'DM1004',
      resp_msg: 'You are not authorised to login. Please contact digital support.',
      resp_body: null,
    };

    throw {
      message: mockDalmiaErrorResponse.resp_msg,
      status: 401,
      dalmiaCode: mockDalmiaErrorResponse.resp_code,
    } as ApiError & { dalmiaCode: string };
  }

  if (credentials.email === 'inactive@dalmia.com') {
    // Simulate another error response for testing
    const mockDalmiaErrorResponse = {
      resp_code: 'DM1006',
      resp_msg: 'Your account is temporarily inactive. Please contact HR department.',
      resp_body: null,
    };

    throw {
      message: mockDalmiaErrorResponse.resp_msg,
      status: 403,
      dalmiaCode: mockDalmiaErrorResponse.resp_code,
    } as ApiError & { dalmiaCode: string };
  }

  // Mock authentication logic - success case
  if (
    (credentials.email === 'admin@dalmia.com' || credentials.email === 'user@dalmia.com') &&
    credentials.password === 'password'
  ) {
    // Simulate DM1002 success response structure
    const mockDalmiaSuccessResponse = {
      resp_code: 'DM1002',
      resp_msg: 'OTP sent successfully to your registered mobile number.',
      resp_body: {
        sessionId: 'mock-session-' + Date.now(),
        otpExpiry: 300, // 5 minutes
      },
    };

    return {
      requiresOTP: true,
      message: mockDalmiaSuccessResponse.resp_msg,
    };
  } else {
    // Simulate DM1001 invalid credentials response
    const mockDalmiaErrorResponse = {
      resp_code: 'DM1001',
      resp_msg: 'Invalid mobile number or password. Please try again.',
      resp_body: null,
    };

    throw {
      message: mockDalmiaErrorResponse.resp_msg,
      status: 401,
      dalmiaCode: mockDalmiaErrorResponse.resp_code,
    } as ApiError & { dalmiaCode: string };
  }
};

const mockVerifyOTP = async (data: OTPVerificationData): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log('Mock OTP Verify API called with:', { email: data.email, otp: data.otp });

  // Check if OTP is correct (demo OTP: 123456)
  if (data.otp !== '123456') {
    // Simulate DM1003 invalid OTP response structure
    const mockDalmiaErrorResponse = {
      resp_code: 'DM1003',
      resp_msg: 'Invalid OTP. Please enter the correct 6-digit OTP.',
      resp_body: null,
    };

    throw {
      message: mockDalmiaErrorResponse.resp_msg,
      status: 400,
      dalmiaCode: mockDalmiaErrorResponse.resp_code,
    } as ApiError & { dalmiaCode: string };
  }

  // Verify credentials again and return user data
  if (data.email === 'admin@dalmia.com' && data.password === 'password') {
    // Simulate DM1002 success response structure
    const mockDalmiaSuccessResponse = {
      resp_code: 'DM1002',
      resp_msg: 'Login successful! Welcome back, Admin.',
      resp_body: {
        userId: '1',
        userName: 'Admin User',
        userRole: 'admin',
        accessToken: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        permissions: ['read', 'write', 'admin'],
      },
    };

    return {
      user: {
        id: mockDalmiaSuccessResponse.resp_body.userId,
        name: mockDalmiaSuccessResponse.resp_body.userName,
        email: data.email,
        role: mockDalmiaSuccessResponse.resp_body.userRole,
      },
      token: mockDalmiaSuccessResponse.resp_body.accessToken,
      message: mockDalmiaSuccessResponse.resp_msg,
    };
  } else if (data.email === 'user@dalmia.com' && data.password === 'password') {
    // Simulate DM1002 success response structure
    const mockDalmiaSuccessResponse = {
      resp_code: 'DM1002',
      resp_msg: 'Login successful! Welcome back.',
      resp_body: {
        userId: '2',
        userName: 'Regular User',
        userRole: 'user',
        accessToken: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        permissions: ['read'],
      },
    };

    return {
      user: {
        id: mockDalmiaSuccessResponse.resp_body.userId,
        name: mockDalmiaSuccessResponse.resp_body.userName,
        email: data.email,
        role: mockDalmiaSuccessResponse.resp_body.userRole,
      },
      token: mockDalmiaSuccessResponse.resp_body.accessToken,
      message: mockDalmiaSuccessResponse.resp_msg,
    };
  } else {
    // Simulate DM1005 session expired response
    const mockDalmiaErrorResponse = {
      resp_code: 'DM1005',
      resp_msg: 'Session expired. Please login again.',
      resp_body: null,
    };

    throw {
      message: mockDalmiaErrorResponse.resp_msg,
      status: 401,
      dalmiaCode: mockDalmiaErrorResponse.resp_code,
    } as ApiError & { dalmiaCode: string };
  }
};

const mockResendOTP = async (email: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Mock Resend OTP API called for:', email);

  // Check if email is valid
  if (email !== 'admin@dalmia.com' && email !== 'user@dalmia.com') {
    // Simulate DM1001 invalid user response structure
    const mockDalmiaErrorResponse = {
      resp_code: 'DM1001',
      resp_msg: 'Invalid user. Please check your registered mobile number.',
      resp_body: null,
    };

    throw {
      message: mockDalmiaErrorResponse.resp_msg,
      status: 400,
      dalmiaCode: mockDalmiaErrorResponse.resp_code,
    } as ApiError & { dalmiaCode: string };
  }

  // Simulate DM1002 success response structure for resend
  const mockDalmiaSuccessResponse = {
    resp_code: 'DM1002',
    resp_msg: 'OTP resent successfully to your registered mobile number.',
    resp_body: {
      sessionId: 'mock-session-resend-' + Date.now(),
      otpExpiry: 300, // 5 minutes
    },
  };

  console.log('Mock Resend OTP Success:', mockDalmiaSuccessResponse);
};

export default api;
