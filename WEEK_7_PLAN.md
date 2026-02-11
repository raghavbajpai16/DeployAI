# Week 7 Plan - Authentication & Social Features

## 🎯 OBJECTIVES
- Implement Google OAuth for seamless login
- Create a User Profile page
- Allow users to share conversations publicly
- Enhance the authentication UI with social login buttons

## 📅 TASKS checklist

### 1. Backend: Google OAuth Setup
- [x] Install dependencies (`passport`, `passport-google-oauth20`)
- [x] Configure Passport strategy in `backend/src/config/passport.ts`
- [x] Update `User` model to include `googleId` and `avatar`
- [x] Create auth routes for Google login (`/auth/google`, `/auth/google/callback`)
- [x] Update `authController` to handle OAuth users

### 2. Frontend: Auth UI Updates
- [x] Add "Sign in with Google" button to Login and Register pages
- [x] Handle OAuth redirect and token storage
- [x] Update `useAuth` hook to support social login (Handled via callback route)

### 3. Frontend: User Profile Page
- [x] Create `/profile` page
- [x] Display user info (name, email, avatar, join date)
- [ ] Add "Edit Profile" functionality (optional for now)
- [ ] Show user stats summary on profile

### 4. Feature: Public Conversations
- [x] Update `Conversation` model with `isPublic` flag
- [x] Create API endpoint to toggle public status
- [x] Create public view page for conversations (`/share/:id`)
- [x] Add "Share" button to chat interface

## 🧪 TESTING STRATEGY
- **OAuth:** Verify login flow, user creation, and token generation.
- **Profile:** Ensure user data loads correctly.
- **Sharing:** Verify public links work for unauthenticated users (if intended) or require auth.

## 📝 NOTES
- Need Google Cloud Console credentials (Client ID, Client Secret).
- Ensure existing email/password users can link Google account (or handle duplicates gracefully).
