/**
 * Device and Application Utilities
 * Helper functions for device information and app metadata
 */

// Generate a unique device ID for web browsers
export const generateDeviceId = (): string => {
  // Try to get from localStorage first
  let deviceId = localStorage.getItem('device_id');
  
  if (!deviceId) {
    // Generate based on browser fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = canvas.toDataURL();
    const userAgent = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Create a simple hash
    const combined = fingerprint + userAgent + screen + timezone;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    deviceId = 'WEB_' + Math.abs(hash).toString(16).toUpperCase();
    localStorage.setItem('device_id', deviceId);
  }
  
  return deviceId;
};

// Get device type/model information
export const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    if (/iPhone/i.test(userAgent)) return 'iPhone';
    if (/iPad/i.test(userAgent)) return 'iPad';
    if (/Android/i.test(userAgent)) return 'Android Device';
    return 'Mobile Device';
  }
  
  if (/Mac/i.test(userAgent)) return 'Mac';
  if (/Win/i.test(userAgent)) return 'Windows';
  if (/Linux/i.test(userAgent)) return 'Linux';
  
  return 'Web Browser';
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'TSO',
  APP_VERSION: '1.0.0',
  BUILD_VERSION: '1',
  PLATFORM: 'web',
} as const;

// Simple encryption function (for demo purposes - in production use proper encryption)
export const simpleEncrypt = (text: string): string => {
  // This is a basic Base64 encoding with a simple transformation
  // In production, use proper encryption libraries
  const base64 = btoa(text);
  const scrambled = base64.split('').reverse().join('');
  return scrambled + '~TSO_WEB_' + Date.now().toString(36);
};

// Simple decryption function (for demo purposes)
export const simpleDecrypt = (encryptedText: string): string => {
  try {
    const [scrambled] = encryptedText.split('~');
    const base64 = scrambled.split('').reverse().join('');
    return atob(base64);
  } catch {
    return encryptedText; // Return as is if decryption fails
  }
};

// Generate reference ID
export const generateReferenceId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `REF_${timestamp}_${random}`;
};