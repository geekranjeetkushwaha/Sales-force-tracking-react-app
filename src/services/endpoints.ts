/**
 * API Endpoints Configuration
 * Centralized location for all API endpoint constants
 */

// Base API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://mobilityqacloud.dalmiabharat.com',
  TIMEOUT: 15000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'user-agent': 'TSO-Web/1.0.0',
    'x-appname': 'TSO',
    platform: 'web',
    'app-name': 'TSO',
    'app-version': '1.0.0',
    accept: '*/*',
    'accept-encoding': 'gzip',
  },
} as const;

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN_OTP: '/dalmiabharat-auth/auth/login_otp',
  VERIFY_OTP: '/dalmiabharat-auth/auth/verify_otp',
  CHECK_VALID_USER_NEW_OTP: '/dalmiabharat-auth/auth/checkValidUserNewOTP',
  LOGOUT: '/dalmiabharat-auth/auth/logout',
  REFRESH_TOKEN: '/dalmiabharat-auth/auth/refresh',
  // Legacy endpoints (if needed)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_TOKEN: '/auth/verify',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  RESEND_OTP: '/auth/resend-otp',
} as const;

// User management endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  GET_USERS: '/user/list',
  GET_USER_BY_ID: (id: string) => `/user/${id}`,
  DELETE_USER: (id: string) => `/user/${id}`,
} as const;

// Counter/Customer endpoints
export const COUNTER_ENDPOINTS = {
  GET_ALL: '/counters',
  GET_BY_ID: (id: string) => `/counters/${id}`,
  CREATE: '/counters',
  UPDATE: (id: string) => `/counters/${id}`,
  DELETE: (id: string) => `/counters/${id}`,
  SEARCH: '/counters/search',
  GET_BY_TERRITORY: (territoryId: string) => `/counters/territory/${territoryId}`,
} as const;

// Visit management endpoints
export const VISIT_ENDPOINTS = {
  GET_ALL: '/visits',
  GET_BY_ID: (id: string) => `/visits/${id}`,
  CREATE: '/visits',
  UPDATE: (id: string) => `/visits/${id}`,
  DELETE: (id: string) => `/visits/${id}`,
  START_VISIT: '/visits/start',
  END_VISIT: (id: string) => `/visits/${id}/end`,
  GET_CURRENT_VISITS: '/visits/current',
  GET_VISITS_BY_DATE: (date: string) => `/visits/date/${date}`,
  GET_VISITS_BY_USER: (userId: string) => `/visits/user/${userId}`,
  GET_VISITS_BY_COUNTER: (counterId: string) => `/visits/counter/${counterId}`,
} as const;

// PJP (Permanent Journey Plan) endpoints
export const PJP_ENDPOINTS = {
  GET_ALL: '/pjp',
  GET_BY_ID: (id: string) => `/pjp/${id}`,
  CREATE: '/pjp',
  UPDATE: (id: string) => `/pjp/${id}`,
  DELETE: (id: string) => `/pjp/${id}`,
  GET_BY_DATE: (date: string) => `/pjp/date/${date}`,
  GET_BY_USER: (userId: string) => `/pjp/user/${userId}`,
  GET_CURRENT_MONTH: '/pjp/current-month',
} as const;

// Territory endpoints
export const TERRITORY_ENDPOINTS = {
  GET_ALL: '/territories',
  GET_BY_ID: (id: string) => `/territories/${id}`,
  GET_BY_USER: (userId: string) => `/territories/user/${userId}`,
  GET_COUNTERS: (territoryId: string) => `/territories/${territoryId}/counters`,
} as const;

// Site management endpoints
export const SITE_ENDPOINTS = {
  GET_ALL: '/sites',
  GET_BY_ID: (id: string) => `/sites/${id}`,
  CREATE: '/sites',
  UPDATE: (id: string) => `/sites/${id}`,
  DELETE: (id: string) => `/sites/${id}`,
  GET_BY_COUNTER: (counterId: string) => `/sites/counter/${counterId}`,
  GET_BY_TYPE: (type: string) => `/sites/type/${type}`,
} as const;

// Reports endpoints
export const REPORT_ENDPOINTS = {
  VISIT_SUMMARY: '/reports/visits/summary',
  VISIT_DETAILS: '/reports/visits/details',
  COUNTER_PERFORMANCE: '/reports/counters/performance',
  USER_PERFORMANCE: '/reports/users/performance',
  TERRITORY_SUMMARY: '/reports/territories/summary',
  EXPORT_VISITS: '/reports/visits/export',
  EXPORT_COUNTERS: '/reports/counters/export',
} as const;

// File upload endpoints
export const UPLOAD_ENDPOINTS = {
  PROFILE_IMAGE: '/upload/profile-image',
  VISIT_IMAGES: '/upload/visit-images',
  DOCUMENTS: '/upload/documents',
  BULK_IMPORT: '/upload/bulk-import',
} as const;

// Notification endpoints
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  GET_UNREAD: '/notifications/unread',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/mark-all-read',
  DELETE: (id: string) => `/notifications/${id}`,
} as const;

// Settings endpoints
export const SETTINGS_ENDPOINTS = {
  GET_APP_SETTINGS: '/settings/app',
  UPDATE_APP_SETTINGS: '/settings/app',
  GET_USER_PREFERENCES: '/settings/user-preferences',
  UPDATE_USER_PREFERENCES: '/settings/user-preferences',
} as const;

// Utility function to build complete URL
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Utility function to build URL with query parameters
export const buildUrlWithParams = (
  endpoint: string,
  params: Record<string, string | number>
): string => {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
};

// Export all endpoints as a single object for convenience
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  COUNTER: COUNTER_ENDPOINTS,
  VISIT: VISIT_ENDPOINTS,
  PJP: PJP_ENDPOINTS,
  TERRITORY: TERRITORY_ENDPOINTS,
  SITE: SITE_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
} as const;
