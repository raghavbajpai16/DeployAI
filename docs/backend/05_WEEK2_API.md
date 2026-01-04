# Week 2 Backend API Documentation

## Status: COMPLETED ✅
## Date: 2026-01-03
## Owner: Member 1 + Member 3

## Base URL
- Development: http://localhost:5000/api
- Production: [Will be updated Week 12]

## Authentication Endpoints

### POST /auth/register
Create new user account

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc..."
}
```

### POST /auth/login
Authenticate existing user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):** Same as register

### GET /auth/me
Get current authenticated user

**Headers:** `Authorization: Bearer <accessToken>`
**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Chat Endpoints

### POST /chat/message
Send a message

**Headers:** `Authorization: Bearer <accessToken>`
**Body:**
```json
{
  "content": "Explain quicksort algorithm",
  "subject": "DSA"
}
```

**Response (200):**
```json
{
  "success": true,
  "conversation": {
    "id": "conv_id",
    "title": "Conversation...",
    "message": { ... },
    "totalMessages": 1
  }
}
```

### GET /chat/conversations
List user's conversations

**Headers:** `Authorization: Bearer <accessToken>`
**Response (200):**
```json
[
  {
    "id": "conv_id",
    "title": "Conversation Topic",
    "lastMessageAt": "2025-12-24T...",
    "createdAt": "2025-12-24T...",
    "messageCount": 5
  }
]
```
