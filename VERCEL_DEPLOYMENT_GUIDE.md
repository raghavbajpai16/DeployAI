# 🚀 Vercel Deployment Guide — StudentMentor AI

> **Complete guide to deploy this monorepo (frontend + backend) FREE on Vercel.**
> A senior DevOps engineer wrote this specifically for this project's structure.

---

## 📁 Final Project Structure (After Modifications)

```
AI_Internship/                    ← ROOT (imported into Vercel)
├── vercel.json                   ← ✅ NEW — Vercel config (routing)
├── package.json                  ← ✅ NEW — Root deps for serverless functions
├── .gitignore                    ← existing (keeps .env out of Git)
│
├── api/                          ← ✅ NEW — Vercel Serverless Functions
│   ├── auth/
│   │   └── [...path].js          ← handles /api/auth/* (register, login, me, google)
│   ├── chat/
│   │   └── [...path].js          ← handles /api/chat/* (message, ai, conversations)
│   ├── goals/
│   │   └── [...path].js          ← handles /api/goals/* (CRUD + progress)
│   ├── analytics/
│   │   └── [...path].js          ← handles /api/analytics/dashboard
│   └── lib/
│       ├── db.js                 ← shared MongoDB connection (cached)
│       └── auth.js               ← shared JWT verify helper
│
├── frontend/                     ← Next.js App (unchanged structure)
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   └── api.ts                ← ✅ MODIFIED — relative /api path in production
│   ├── next.config.js
│   └── package.json
│
└── backend/                      ← Keep for local development only
    └── src/
        └── server.ts             ← Still works locally (unchanged)
```

---

## 🔧 What Was Changed & Why

| File | Change | Reason |
|------|--------|--------|
| `vercel.json` (root) | Created new | Tells Vercel: build frontend, route `/api/*` to functions |
| `package.json` (root) | Created new | Vercel needs backend deps at root to run serverless functions |
| `api/auth/[...path].js` | Created new | Serverless version of `backend/src/routes/auth.ts` |
| `api/chat/[...path].js` | Created new | Serverless version of `backend/src/routes/chat.ts` |
| `api/goals/[...path].js` | Created new | Serverless version of `backend/src/routes/goal.ts` |
| `api/analytics/[...path].js` | Created new | Serverless version of `backend/src/routes/analytics.ts` |
| `frontend/lib/api.ts` | Line 1 modified | Uses `/api` relative path in production instead of `localhost:5000` |
| `backend/` | UNTOUCHED | Still works for local development with `npm run dev` |

---

## ⚙️ Step-by-Step Vercel Deployment

### Step 1: Push Changes to GitHub

```bash
# From your project root (c:\AI_Internship)
git add .
git commit -m "feat: add Vercel serverless API functions for deployment"
git push origin main
```

> ⚠️ **BEFORE PUSHING**: Make sure `.env` and `.env.local` are in `.gitignore` (they are — already verified). **NEVER commit your `.env` file.**

---

### Step 2: Set Up Your Vercel Project

1. Go to **[vercel.com](https://vercel.com)** → your imported project
2. Click **Settings** tab
3. Go to **General** → **Build & Development Settings**

Set these values:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Root Directory** | *(leave blank / use `.`)* |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Output Directory** | `frontend/.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | `18.x` |

---

### Step 3: Add Environment Variables in Vercel

Go to **Settings → Environment Variables** and add ALL of these:

#### 🔴 Required — App Will Break Without These

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://rvbajpai16:...@cluster0.lwpdxzr.mongodb.net/` | Your Atlas URI |
| `MONGODB_DATABASE` | `StudentMentor-AI` | |
| `JWT_SECRET` | `1244edbc73de672f...` | Your secret from `.env` |
| `JWT_EXPIRY` | `24h` | |
| `GROQ_API_KEY` | `gsk_LufKKv4q...` | Your Groq key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | |
| `NODE_ENV` | `production` | |

#### 🟡 Required — For OAuth & CORS

| Variable | Value | Notes |
|----------|-------|-------|
| `GOOGLE_CLIENT_ID` | `566869102308-...apps.googleusercontent.com` | |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-V2k2v...` | |
| `FRONTEND_URL` | `https://YOUR-PROJECT.vercel.app` | Your Vercel URL |
| `PRODUCTION_URL` | `https://YOUR-PROJECT.vercel.app` | Same URL |
| `CORS_ORIGIN` | `https://YOUR-PROJECT.vercel.app` | Same URL |

#### 🟢 Optional

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | Your OpenAI key (fallback) |
| `JWT_REFRESH_SECRET` | Your refresh secret |

> 💡 **Tip**: Set all variables to apply to **Production**, **Preview**, and **Development** environments.

---

### Step 4: Update Google OAuth Callback URL

Your Google OAuth callback must use your **Vercel production URL**.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Click your OAuth 2.0 Client
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR-PROJECT.vercel.app/api/auth/google/callback
   ```
5. Save changes

---

### Step 5: Update MongoDB Atlas Network Access

Your Atlas cluster must allow connections from Vercel's servers:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Network Access → Add IP Address**
3. Click **"Allow Access from Anywhere"** → Add `0.0.0.0/0`
4. Click **Confirm**

> ⚠️ This is required because Vercel serverless functions use dynamic IPs. This is standard practice for Vercel + Atlas deployments.

---

### Step 6: Deploy

1. Go to your Vercel project dashboard
2. Click **"Redeploy"** (or push to `main` to trigger auto-deploy)
3. Watch the build logs in **Deployments** tab

**Expected build output:**
```
Running build command: cd frontend && npm install && npm run build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
Build completed in Xs
```

---

### Step 7: Verify Deployment

Test these URLs after deployment (replace with your Vercel URL):

```bash
# Health check — should return JSON
curl https://YOUR-PROJECT.vercel.app/api/auth/me

# Should return: {"error":"No token provided"}  ← That means it's working!

# Test register
curl -X POST https://YOUR-PROJECT.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'
```

---

## 🌐 How the Architecture Works on Vercel

```
Browser Request
      │
      ▼
Vercel Edge (your-project.vercel.app)
      │
      ├─ /api/auth/*  ──► api/auth/[...path].js  (serverless function)
      │                         │
      ├─ /api/chat/*  ──► api/chat/[...path].js  │── MongoDB Atlas
      │                                           │── Groq API
      ├─ /api/goals/* ──► api/goals/[...path].js │
      │
      └─ /* (everything else) ──► Next.js Frontend (static + SSR)
```

**Key difference from traditional Express:**
- ❌ No persistent server running 24/7
- ✅ Functions spin up on-demand, handle request, shut down
- ✅ MongoDB connection is **cached** per function instance to avoid cold start overhead
- ✅ Free tier: 100GB bandwidth/month, 100K function invocations/month

---

## 🐛 Common Issues & Fixes

### Issue: Build fails with "Cannot find module"

**Fix**: Make sure `package.json` at root has all backend dependencies listed. Run:
```bash
cd C:\AI_Internship
npm install  # installs root package.json deps
```

### Issue: API returns 404

**Fix**: Check `vercel.json` rewrites are correct. Verify the file exists at `/api/auth/[...path].js`.

### Issue: CORS errors in browser

**Fix**: Set `FRONTEND_URL` env var in Vercel to your exact production URL (`https://your-project.vercel.app`). No trailing slash.

### Issue: MongoDB connection timeout

**Fix**: 
1. Check `MONGODB_URI` is set correctly in Vercel env vars
2. Make sure Atlas network access allows `0.0.0.0/0`
3. Check connection string includes `?appName=Cluster0` at the end

### Issue: Streaming (AI responses) not working

**Note**: Vercel Serverless Functions have a **10-second timeout** on the free tier. Long AI streams may hit this. To fix:
- Keep `max_tokens` reasonable (< 2000)
- Or upgrade to Vercel Pro (60s timeout)

### Issue: Google OAuth redirect error

**Fix**: Make sure the callback URL in Google Console exactly matches:
```
https://YOUR-PROJECT.vercel.app/api/auth/google/callback
```

---

## 💻 Local Development (Unchanged)

Your local dev setup still works exactly as before:

```bash
# Terminal 1 — Backend (Express on :5000)
cd backend
npm run dev

# Terminal 2 — Frontend (Next.js on :3000)  
cd frontend
npm run dev
```

The frontend's `api.ts` automatically uses `http://localhost:5000/api` when `NODE_ENV !== 'production'`.

---

## 📊 Vercel Free Tier Limits

| Resource | Free Tier Limit | Your Usage Estimate |
|----------|----------------|---------------------|
| Bandwidth | 100 GB/month | ✅ Fine for a student project |
| Serverless Invocations | 100,000/month | ✅ Fine for development |
| Function Execution Time | 10 sec max | ⚠️ Watch for long AI streams |
| Build Minutes | 6,000 min/month | ✅ Fine |
| Deployments | Unlimited | ✅ |
| Custom Domains | 1 domain | ✅ |

---

## 🔐 Security Checklist Before Going Live

- [ ] `.env` and `.env.local` are in `.gitignore` ✅ (already done)
- [ ] All secrets are set as Vercel Environment Variables, not in code
- [ ] `JWT_SECRET` is a long random string (yours is ✅)
- [ ] MongoDB Atlas has a strong password (rotate the one in `.env` if ever exposed)
- [ ] Google OAuth callback URL updated to production URL
- [ ] `CORS_ORIGIN` set to your exact Vercel domain

---

## 📋 Quick Reference — All API Endpoints

| Method | Endpoint | Auth Required |
|--------|----------|--------------|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| GET | `/api/auth/me` | ✅ Bearer |
| GET | `/api/auth/google` | ❌ |
| GET | `/api/auth/google/callback` | ❌ |
| POST | `/api/chat/message` | ✅ Bearer |
| POST | `/api/chat/ai` | ✅ Bearer |
| GET | `/api/chat/conversations` | ✅ Bearer |
| GET | `/api/chat/conversations/:id` | ✅ Bearer |
| POST | `/api/chat/conversations/:id/public` | ✅ Bearer |
| PATCH | `/api/chat/conversations/:id/messages/:msgId` | ✅ Bearer |
| GET | `/api/chat/stats` | ✅ Bearer |
| GET | `/api/chat/public/:id` | ❌ |
| POST | `/api/goals` | ✅ Bearer |
| GET | `/api/goals` | ✅ Bearer |
| PATCH | `/api/goals/:id` | ✅ Bearer |
| DELETE | `/api/goals/:id` | ✅ Bearer |
| PATCH | `/api/goals/:id/progress` | ✅ Bearer |
| GET | `/api/analytics/dashboard` | ✅ Bearer |
