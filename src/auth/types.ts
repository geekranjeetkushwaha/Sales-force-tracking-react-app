export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DalmiaLoginPayload {
  appName: string;
  appVersion: string;
  deviceId: string;
  deviceType: string;
  mobileNumber: string; // This will be encrypted
  referenceId: string; // This will be encrypted
}

export interface OTPVerificationData {
  email: string;
  password: string;
  otp: string;
}

export interface LoginResponse {
  requiresOTP?: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  verifyOTP: (data: OTPVerificationData) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}