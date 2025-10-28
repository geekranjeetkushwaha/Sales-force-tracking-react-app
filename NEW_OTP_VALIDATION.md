# New OTP Validation Implementation

## Overview

Added support for the new OTP validation endpoint `/dalmiabharat-auth/auth/checkValidUserNewOTP` based on the provided cURL command.

## Files Modified

### 1. **Auth Types** (`src/auth/types.ts`)

- Added `NewOTPValidationPayload` interface
- Added `NewOTPValidationResponse` interface
- Updated `AuthContextType` to include `validateNewOTP` method

### 2. **API Service** (`src/services/api.ts`)

- Added `validateNewOTP` function to `authApi` object
- Implements the exact headers and payload structure from the cURL command
- Includes error handling and mock support for development

### 3. **Endpoints Configuration** (`src/services/endpoints.ts`)

- Added `CHECK_VALID_USER_NEW_OTP` endpoint

### 4. **Device Utils** (`src/utils/deviceUtils.ts`)

- Added `generateOTPTokenId()` function
- Added `buildOTPValidationPayload()` helper function
- Added browser detection utilities

### 5. **Auth Context** (`src/auth/AuthContext.tsx`)

- Added `validateNewOTP` method implementation
- Includes automatic token storage and user authentication on success

## Usage Example

```typescript
import { useAuth } from '../auth/useAuth';
import { buildOTPValidationPayload } from '../utils/deviceUtils';

const { validateNewOTP } = useAuth();

// Method 1: Use helper function (Recommended)
const payload = buildOTPValidationPayload({
  otpCode: '123456',
  mobileNumber: 'user@example.com',
  userId: 'TSO1760521103420',
  // Optional: otpTokenId and referenceId will be auto-generated
});

try {
  const result = await validateNewOTP(payload);
  if (result.success) {
    console.log('OTP validated successfully!');
    // User is automatically logged in and tokens are stored
  }
} catch (error) {
  console.error('OTP validation failed:', error.message);
}

// Method 2: Manual payload construction
const manualPayload = {
  appName: 'TSO',
  appVersion: '9.0.44',
  deviceId: 'generated-device-id',
  gcmId: 'web-specific-gcm-id',
  imei: 'NA',
  otpTokenId: 'generated-uuid',
  code: 'encrypted-otp-code',
  mobileNumber: 'encrypted-mobile-number',
  referenceId: 'encrypted-reference-id',
  userId: 'TSO1760521103420',
  deviceManufacturer: 'Chrome',
  deviceVersionNumber: '119',
  deviceApiLevel: '35',
  deviceOs: 'Web',
  deviceModel: 'Chrome_119',
};

await validateNewOTP(manualPayload);
```

## API Request Details

The implementation replicates the exact cURL command structure:

### Headers

- `user-agent`: Dart/3.7 (dart:io)
- `deviceid`: Device ID
- `mobile-number`: Mobile number
- `appversion`: App version
- `model`: Device model
- `brand`: Device manufacturer
- `x-appname`: TSO
- `platform`: android (web for browser)
- And many more matching the original cURL

### Payload Structure

```json
{
  "appName": "TSO",
  "appVersion": "9.0.44",
  "deviceId": "AP3A.240617.008",
  "gcmId": "cmJ6obBbQqenjogtY9lfJJ:APA91b...",
  "imei": "NA",
  "otpTokenId": "5bb58312-8c37-40dc-ade2-cf4b9fe1362d",
  "code": "tRUV36yFq4Hp64glxmI6sw==~BBANADj5oxenL2VrFwUE0hUo",
  "mobileNumber": "1nxLf4x97Rh16eHRXMuWXA==~BBBD3FakmQeSuFUfOfU4Y4TM",
  "referenceId": "V7pvxTlQIEgu82PWY2RF3A==~BBBuAVCx6F8624vvwewrUSEj",
  "userId": "TSO1760521103420",
  "deviceManufacturer": "OnePlus",
  "deviceVersionNumber": "AP3A.240617.008",
  "deviceApiLevel": "35",
  "deviceOs": "Android",
  "deviceModel": "CPH2551"
}
```

## Response Handling

The API follows Dalmia's standard response format:

- `resp_code`: "DM1002" for success, other codes for errors
- `resp_msg`: Human-readable message
- `resp_body`: Data payload (user info, tokens, etc.)

## Error Codes

Common Dalmia API response codes:

- `DM1002`: Success
- `DM1001`: Invalid credentials/mobile number
- `DM1003`: Invalid OTP
- `DM1004`: Unauthorized user
- `DM1005`: Session expired
- `DM1006`: OTP expired
- `DM1007`: Too many failed attempts

## Development Support

- Includes mock responses for development/testing
- Automatic fallback when network requests fail
- Comprehensive error handling with user-friendly messages

## Integration

The new validation method is fully integrated into the existing auth system:

- Available through `useAuth()` hook
- Automatic token storage and user authentication
- Compatible with existing logout and session management
- Works alongside current OTP verification method

You can choose to use either the existing `verifyOTP` method or the new `validateNewOTP` method based on your requirements.
