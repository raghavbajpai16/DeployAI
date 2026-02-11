# 🔐 Google OAuth Setup Guide

Follow these steps to generate the **Client ID** and **Client Secret** needed for "Sign in with Google".

## 1. Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. Click the **Project dropdown** (top left) and select **"New Project"**.
4. Name it `StudentMentor-AI` (or any name you prefer) and click **Create**.
5. Once created, select the project from the notification or dropdown.

## 2. Configure OAuth Consent Screen
1. In the left sidebar, navigate to **APIs & Services** > **OAuth consent screen**.
2. Select **External** (unless you have a Google Workspace organization, then Internal is safer but External works for testing).
3. Click **Create**.
4. **App Information**:
   - **App Name**: `StudentMentor AI`
   - **User Support Email**: Select your email.
5. **Developer Contact Information**: Enter your email again.
6. Click **Save and Continue**.
7. **Scopes**: You can skip this (click Save and Continue).
8. **Test Users**:
   - Click **+ ADD USERS**.
   - Enter your own email address (and any others you want to test with).
   - *Note: While in "Testing" mode, only these users can log in.*
9. Click **Save and Continue**.

## 3. Create Credentials
1. In the left sidebar, click **Credentials**.
2. Click **+ CREATE CREDENTIALS** (top) > **OAuth client ID**.
3. **Application Type**: Select **Web application**.
4. **Name**: `StudentMentor Web Client`.
5. **Authorized JavaScript Origins**:
   - Click **+ ADD URI**.
   - Enter: `http://localhost:3000` (Frontend)
   - Click **+ ADD URI**.
   - Enter: `http://localhost:5000` (Backend)
6. **Authorized Redirect URIs**:
   - Click **+ ADD URI**.
   - Enter: `http://localhost:5000/api/auth/google/callback`
   - *Note: This must MATCH EXACTLY what is in your backend code.*
7. Click **Create**.

## 4. Copy Credentials to `.env`
1. A popup will appear with your **Your Client ID** and **Your Client Secret**.
2. Copy these values.
3. Open `c:\AI_Internship\backend\.env`.
4. Update the Google OAuth section:

```env
GOOGLE_CLIENT_ID=your_pasted_client_id_here
GOOGLE_CLIENT_SECRET=your_pasted_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## 5. Restart Backend
1. Stop your running backend server (Ctrl+C).
2. Run `npm run dev` again to load the new environment variables.

---

### ⚠️ Troubleshooting
- **Error 400: redirect_uri_mismatch**:
  - Check that the URL in the error screen matches EXACTLY what you entered in the Cloud Console under "Authorized Redirect URIs".
- **Access Blocked: App has not completed the Google verification process**:
  - This is expected in development. Click "Advanced" > "Go to StudentMentor AI (unsafe)" to proceed.
