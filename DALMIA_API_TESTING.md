# Dalmia API Integration Testing Guide

## API Response Structure

The Dalmia API follows a strict response structure where **only `resp_code: 'DM1002'` indicates success**.

### Success Response Structure:
```json
{
  "resp_code": "DM1002",
  "resp_msg": "OTP sent successfully",
  "resp_body": {
    "sessionId": "session123",
    "otpExpiry": 300
  }
}
```

### Error Response Structure:
```json
{
  "resp_code": "DM1004",
  "resp_msg": "You are not authorised to login. Please contact digital support.",
  "resp_body": null
}
```

## Response Codes

| Code   | Description                    | Action                |
|--------|--------------------------------|-----------------------|
| DM1002 | Success                        | Proceed with operation |
| DM1001 | Invalid credentials            | Show error message     |
| DM1003 | Invalid OTP                    | Show error message     |
| DM1004 | Unauthorized user              | Show error message     |
| DM1005 | Session expired                | Redirect to login      |
| DM1006 | OTP expired                    | Show error message     |
| DM1007 | Too many failed attempts       | Show error message     |

## Testing Credentials (Mock API)

### Valid Login Credentials:
- **Email**: `admin@dalmia.com` or `user@dalmia.com`
- **Password**: `password`
- **OTP**: `123456`

### Test Error Scenarios:
- **Unauthorized User**: `unauthorized@test.com` (triggers DM1004)
- **Invalid Credentials**: Any other email/password combination (triggers DM1001)
- **Invalid OTP**: Any OTP other than `123456` (triggers DM1003)

## API Endpoints

### Production Endpoints:
- **Base URL**: `https://mobilityqacloud.dalmiabharat.com`
- **Login OTP**: `/dalmiabharat-auth/auth/login_otp`
- **Verify OTP**: `/dalmiabharat-auth/auth/verify_otp`

### Headers Required:
```json
{
  "Content-Type": "application/json",
  "user-agent": "TSO-Web/1.0.0",
  "x-appname": "TSO",
  "platform": "web",
  "app-name": "TSO",
  "app-version": "1.0.0",
  "deviceid": "generated-device-id",
  "model": "browser-type",
  "brand": "Web Browser"
}
```

## Development vs Production

- **Development Mode**: Uses mock responses that simulate the Dalmia API structure
- **Production Mode**: Makes real API calls to Dalmia endpoints
- **Fallback**: If network errors occur, falls back to mock responses

## Error Handling

All API errors are handled through the toast service (`src/utils/toast.ts`) which:
1. Checks for `dalmiaCode` in the error
2. Maps known codes to user-friendly messages
3. Falls back to the `resp_msg` from the API
4. Displays appropriate Ant Design toast notifications

## Testing the Flow

1. **Start the application**: `npm run dev`
2. **Navigate to login**: Enter credentials
3. **Check console**: API responses are logged for debugging
4. **Verify OTP**: Use `123456` as the test OTP
5. **Test errors**: Try invalid credentials or unauthorized email

## Console Logging

The following are logged for debugging:
- `Mock Login API called with:` - Login attempt details
- `Mock OTP Verify API called with:` - OTP verification details
- `Dalmia Login API Response:` - Real API response structure
- `Dalmia OTP Verify API Response:` - Real OTP verification response