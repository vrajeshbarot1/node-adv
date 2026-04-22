# Complete Auth & 2FA API Guide

This document contains everything you need to run, test, and manage authentication and Two-Factor Authentication (2FA) in the Task Management App.

**Base URL:** `http://localhost:3000/v1/auth`

---

## 1. User Registration & Login

### Register User
- **Endpoint:** `POST /register`
- **Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

### Standard Login
- **Endpoint:** `POST /login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (If 2FA is OFF):** Returns `token` and `refreshToken`.
- **Response (If 2FA is ON):** Returns `{"mfaRequired": true, "userId": "..."}`.

---

## 2. Two-Factor Authentication (2FA) Guide

### Step 1: Initiation (Setup)
*Requires Bearer Token from Login*
- **Endpoint:** `POST /2fa/setup`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,..."
  }
}
```
*Action: Scan the `qrCode` with Google Authenticator.*

### Step 2: Activation (Verify)
*Requires Bearer Token*
- **Endpoint:** `POST /2fa/verify`
- **Body:**
```json
{
  "token": "123456" 
}
```
*Note: Once this succeeds, 2FA is enabled. You will need it for future logins.*

### Step 3: Logging in with 2FA
1. Call `/login` as usual.
2. If you get `mfaRequired: true`, take the `userId` from the response.
3. Call the 2FA login endpoint:
- **Endpoint:** `POST /login/2fa`
- **Body:**
```json
{
  "userId": "uuid-from-login-step",
  "token": "123456"
}
```

### Step 4: Disabling 2FA
*Requires Bearer Token*
- **Endpoint:** `POST /2fa/disable`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:**
```json
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

---

## 3. Other Routes

### Profile (Protected)
- **Endpoint:** `GET /profile`
- **Headers:** `Authorization: Bearer <access_token>`

### Refresh Token
- **Endpoint:** `POST /refresh`
- **Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

### Google OAuth
- **Endpoint:** `GET /google`
- **Action:** Open in browser to log in via Google.
