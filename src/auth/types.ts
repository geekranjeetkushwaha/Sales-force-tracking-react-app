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

export interface NewOTPValidationPayload {
  appName: string;
  appVersion: string;
  deviceId: string;
  gcmId: string;
  imei: string;
  otpTokenId: string;
  code: string;
  mobileNumber: string;
  referenceId: string;
  userId: string;
  deviceManufacturer: string;
  deviceVersionNumber: string;
  deviceApiLevel: string;
  deviceOs: string;
  deviceModel: string;
}

export interface NewOTPValidationResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
  };
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
  validateNewOTP: (payload: NewOTPValidationPayload) => Promise<NewOTPValidationResponse>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}
