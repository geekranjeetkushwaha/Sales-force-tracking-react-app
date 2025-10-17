/**
 * Toast Notification Service
 * Centralized service for showing consistent toast messages using Ant Design
 * Note: For components inside App context, use App.useApp() hook instead
 */

import { App } from 'antd';

export interface ToastOptions {
  duration?: number;
  key?: string;
  onClose?: () => void;
}

// Hook for using toast service within App context
export const useToast = () => {
  const { message } = App.useApp();
  
  return {
    success: (content: string, options?: ToastOptions) => {
      message.success({
        content,
        duration: 3,
        ...options,
      });
    },
    error: (content: string, options?: ToastOptions) => {
      message.error({
        content,
        duration: 5, // Show errors longer
        ...options,
      });
    },
    warning: (content: string, options?: ToastOptions) => {
      message.warning({
        content,
        duration: 4,
        ...options,
      });
    },
    info: (content: string, options?: ToastOptions) => {
      message.info({
        content,
        duration: 3,
        ...options,
      });
    },
    loading: (content: string, options?: ToastOptions) => {
      return message.loading({
        content,
        duration: 0, // Don't auto hide loading messages
        ...options,
      });
    },
  };
};

// Legacy class-based service for backward compatibility
class ToastService {
  // Success message
  success(content: string, options?: ToastOptions): void {
    console.warn('Using legacy toast service. Consider using useToast hook instead.');
    // Fallback to console in case App context is not available
    console.log('Success:', content);
  }

  // Error message
  error(content: string, options?: ToastOptions): void {
    console.warn('Using legacy toast service. Consider using useToast hook instead.');
    // Fallback to console in case App context is not available
    console.error('Error:', content);
  }

  // Warning message
  warning(content: string, options?: ToastOptions): void {
    console.warn('Using legacy toast service. Consider using useToast hook instead.');
    console.warn('Warning:', content);
  }

  // Info message
  info(content: string, options?: ToastOptions): void {
    console.warn('Using legacy toast service. Consider using useToast hook instead.');
    console.info('Info:', content);
  }

  // Loading message
  loading(content: string, options?: ToastOptions): () => void {
    console.warn('Using legacy toast service. Consider using useToast hook instead.');
    console.log('Loading:', content);
    return () => {};
  }

  // Destroy all messages
  destroy(): void {
    console.log('Destroy all messages');
  }

  // Destroy specific message by key
  destroyByKey(key: string): void {
    console.log('Destroy message by key:', key);
  }

    // Handle Dalmia API errors specifically - Always use resp_msg if available
  handleDalmiaError(error: any): void {
    let errorMessage = 'An error occurred. Please try again.';
    
    // Always prioritize the actual error message from API (resp_msg)
    if (error.message) {
      errorMessage = error.message; // This contains the resp_msg from Dalmia API
    } else if (error.dalmiaCode) {
      // Fallback messages only if resp_msg is not available
      switch (error.dalmiaCode) {
        case 'DM1004':
          errorMessage = 'You are not authorised to login. Please contact digital support.';
          break;
        case 'DM1001':
          errorMessage = 'Invalid credentials. Please check your email and password.';
          break;
        case 'DM1003':
          errorMessage = 'Invalid OTP. Please try again.';
          break;
        case 'DM1005':
          errorMessage = 'Session expired. Please login again.';
          break;
        case 'DM1006':
          errorMessage = 'Account inactive. Please contact support.';
          break;
        default:
          errorMessage = 'Unknown error occurred. Please try again.';
      }
    }

    console.log('Showing Dalmia API error toast:', {
      dalmiaCode: error.dalmiaCode,
      message: errorMessage,
      originalError: error
    });

    this.error(errorMessage, { duration: 6 }); // Show error for longer duration
  }

  // Handle successful Dalmia responses
  handleDalmiaSuccess(message: string): void {
    this.success(message);
  }
}

// Export singleton instance
export const toast = new ToastService();

// Export individual methods for convenience
export const showSuccess = (content: string, options?: ToastOptions) => toast.success(content, options);
export const showError = (content: string, options?: ToastOptions) => toast.error(content, options);
export const showWarning = (content: string, options?: ToastOptions) => toast.warning(content, options);
export const showInfo = (content: string, options?: ToastOptions) => toast.info(content, options);
export const showLoading = (content: string, options?: ToastOptions) => toast.loading(content, options);
export const handleApiError = (error: any) => toast.handleDalmiaError(error);
export const handleApiSuccess = (message: string) => toast.handleDalmiaSuccess(message);

export default toast;