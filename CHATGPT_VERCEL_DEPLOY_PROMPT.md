# 🤖 ChatGPT Deployment Prompt — StudentMentor AI on Vercel

> **HOW TO USE THIS FILE:**
> Copy the entire block inside the ╔═══╗ box below and paste it into ChatGPT.
> It gives ChatGPT 100% context about your project so it can answer precisely.

---

╔══════════════════════════════════════════════════════════════════════════════╗
║                  PASTE THIS ENTIRE BLOCK INTO CHATGPT                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

```
You are a senior DevOps engineer helping me deploy my full-stack project to Vercel.
Here is the COMPLETE context of my project. Please answer my deployment questions
based exactly on this structure — do not make assumptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT: StudentMentor AI
GITHUB REPO: https://github.com/raghavbajpai16/MYUNIONEAI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────
1. REPOSITORY FOLDER STRUCTURE
──────────────────────────────────────

MYUNIONEAI/                          ← Root (this is imported into Vercel)
├── vercel.json                      ← Vercel config (see Section 3)
├── package.json                     ← Root deps for serverless functions
├── .gitignore                       ← .env files are excluded
│
├── api/                             ← Vercel Serverless Functions (Node.js)
│   ├── auth/
│   │   └── [...path].js             ← handles /api/auth/* (Express app exported)
│   ├── chat/
│   │   └── [...path].js             ← handles /api/chat/* (Express + Groq AI)
│   ├── goals/
│   │   └── [...path].js             ← handles /api/goals/*
│   ├── analytics/
│   │   └── [...path].js             ← handles /api/analytics/dashboard
│   └── lib/
│       ├── db.js                    ← cached MongoDB connection
│       └── auth.js                  ← JWT verify helper
│
├── frontend/                        ← Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx                 ← Landing page
│   │   ├── layout.tsx
│   │   ├── (auth)/                  ← login/register
│   │   ├── chat/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── goals/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── share/[id]/page.tsx      ← Public conversation viewer
│   │   └── auth/google/callback/page.tsx  ← Google OAuth handler
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   └── AuthForm.tsx
│   ├── lib/
│   │   └── api.ts                   ← Central API client
│   ├── next.config.js
│   └── package.json                 ← Frontend-only deps
│
└── backend/                         ← LOCAL DEV ONLY (Express server)
    └── src/
        └── server.ts                ← NOT used by Vercel


──────────────────────────────────────
2. HOW THE ARCHITECTURE WORKS
──────────────────────────────────────

- Frontend = Next.js 14, deployed to Vercel as a standard Next.js app
- Backend = Converted from Express to Vercel Serverless Functions in /api/
- Each api/*.js file exports: `export default app` (Express app as handler)
- MongoDB connection is cached using global._mongooseCache pattern
- JWT authentication is done manually (no session, Bearer tokens in headers)
- Groq AI (llama-3.3-70b-versatile) is used for chat via OpenAI-compatible SDK
- Google OAuth uses Passport.js with callbackURL pointing to production domain

Frontend API calls:
- In PRODUCTION: uses relative path `/api` (same Vercel domain)
- In LOCAL DEV:  uses `http://localhost:5000/api`

Pattern used in all frontend files:
  const API_BASE = process.env.NODE_ENV === 'production'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');


──────────────────────────────────────
3. vercel.json (ROOT LEVEL)
──────────────────────────────────────

{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 10
    }
  },
  "rewrites": [
    { "source": "/api/auth/:path*",      "destination": "/api/auth/:path*" },
    { "source": "/api/chat/:path*",      "destination": "/api/chat/:path*" },
    { "source": "/api/goals/:path*",     "destination": "/api/goals/:path*" },
    { "source": "/api/analytics/:path*", "destination": "/api/analytics/:path*" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin",      "value": "*" },
        { "key": "Access-Control-Allow-Methods",     "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers",     "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
      ]
    }
  ]
}


──────────────────────────────────────
4. ROOT package.json
──────────────────────────────────────

{
  "name": "studentmentor-ai",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "cd frontend && npm install && npm run build"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "groq-sdk": "^0.37.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.0",
    "openai": "^6.15.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "uuid": "^9.0.1"
  },
  "engines": { "node": ">=18.x" }
}


──────────────────────────────────────
5. EXAMPLE SERVERLESS FUNCTION (api/auth/[...path].js)
──────────────────────────────────────

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ── Cached DB connection (CRITICAL for serverless)
let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DATABASE || 'StudentMentor-AI',
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ── Express app handles all matching requests
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.post('/api/auth/register', async (req, res) => {
  await connectDB();
  // ... handler logic
});

// ── Vercel calls this as the handler
export default app;


──────────────────────────────────────
6. ENVIRONMENT VARIABLES NEEDED IN VERCEL DASHBOARD
──────────────────────────────────────

These must be added under: Vercel Dashboard → Project → Settings → Environment Variables

REQUIRED:
  MONGODB_URI          = mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
  MONGODB_DATABASE     = StudentMentor-AI
  JWT_SECRET           = (long random string, min 32 chars)
  JWT_EXPIRY           = 24h
  GROQ_API_KEY         = gsk_xxxxxxxxxxxxx
  GROQ_MODEL           = llama-3.3-70b-versatile
  NODE_ENV             = production

FOR CORS + OAUTH:
  FRONTEND_URL         = https://YOUR-PROJECT.vercel.app
  PRODUCTION_URL       = https://YOUR-PROJECT.vercel.app
  CORS_ORIGIN          = https://YOUR-PROJECT.vercel.app
  GOOGLE_CLIENT_ID     = xxxxx.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx

OPTIONAL:
  OPENAI_API_KEY       = sk-proj-xxxxx
  JWT_REFRESH_SECRET   = (another long random string)

NOTE: Do NOT add NEXT_PUBLIC_API_URL in production — the code uses relative /api automatically.


──────────────────────────────────────
7. VERCEL DASHBOARD SETTINGS
──────────────────────────────────────

Setting              → Value
─────────────────────────────────────
Framework Preset     → Next.js
Root Directory       → . (leave blank / use repo root)
Build Command        → cd frontend && npm install && npm run build
Output Directory     → frontend/.next
Install Command      → npm install
Node.js Version      → 18.x


──────────────────────────────────────
8. EXTERNAL SERVICES THAT NEED UPDATING
──────────────────────────────────────

A) MongoDB Atlas:
   - Network Access → Add IP: 0.0.0.0/0 (Allow from Anywhere)
   - This is required because Vercel uses dynamic IPs

B) Google Cloud Console:
   - APIs & Services → Credentials → Your OAuth Client
   - Authorized redirect URIs → ADD:
     https://YOUR-PROJECT.vercel.app/api/auth/google/callback

C) Groq API:
   - No changes needed, just ensure GROQ_API_KEY is set in Vercel


──────────────────────────────────────
9. ALL API ENDPOINTS
──────────────────────────────────────

AUTH:
  POST  /api/auth/register
  POST  /api/auth/login
  GET   /api/auth/me              ← requires Bearer token
  GET   /api/auth/google
  GET   /api/auth/google/callback

CHAT:
  POST  /api/chat/message         ← requires Bearer token
  POST  /api/chat/ai              ← requires Bearer token (SSE streaming)
  GET   /api/chat/conversations   ← requires Bearer token
  GET   /api/chat/conversations/:id
  POST  /api/chat/conversations/:id/public
  PATCH /api/chat/conversations/:id/messages/:messageId
  GET   /api/chat/stats
  GET   /api/chat/public/:id      ← public, no auth

GOALS:
  POST  /api/goals                ← requires Bearer token
  GET   /api/goals
  PATCH /api/goals/:id
  DELETE /api/goals/:id
  PATCH /api/goals/:id/progress

ANALYTICS:
  GET   /api/analytics/dashboard  ← requires Bearer token


──────────────────────────────────────
10. KNOWN LIMITATIONS ON VERCEL FREE TIER
──────────────────────────────────────

- Serverless function timeout: 10 seconds max (set in vercel.json)
- AI streaming (SSE) may be cut off for very long responses
- No persistent WebSocket connections
- 100GB bandwidth/month
- 100,000 function invocations/month
- MongoDB Atlas free tier: 512MB storage


──────────────────────────────────────
11. WHAT HAS ALREADY BEEN DONE
──────────────────────────────────────

✅ Express server converted to Vercel serverless functions in /api/
✅ No app.listen() anywhere in /api/ folder
✅ MongoDB connection cached with global._mongooseCache
✅ All frontend files use relative /api in production
✅ vercel.json configured with Node18, maxDuration:10, CORS headers
✅ Root package.json contains all backend dependencies
✅ Google OAuth callback uses /api/auth/google/callback
✅ .env files are gitignored / not committed
✅ Frontend build passes (exit code 0) — tested locally
✅ useSearchParams wrapped in Suspense (Next.js 14 requirement)
✅ Code pushed to: https://github.com/raghavbajpai16/MYUNIONEAI

──────────────────────────────────────
MY QUESTION FOR YOU:
──────────────────────────────────────

[REPLACE THIS LINE WITH YOUR SPECIFIC QUESTION]

Examples of questions you can ask:
- "What exact steps do I follow in the Vercel dashboard after importing the repo?"
- "Why is my build failing with error [paste error]?"
- "My /api/auth/login returns 404. How do I debug it?"
- "How do I set up environment variables for preview deployments vs production?"
- "Google OAuth redirect is failing. What do I check?"
- "My AI chat stream is timing out. How do I fix it within free tier limits?"
```

╔══════════════════════════════════════════════════════════════════════════════╗
║                        END OF CHATGPT PROMPT                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

---

## 📋 Pre-Built Questions You Can Ask ChatGPT

After pasting the prompt above, replace the last line with any of these:

### 🔴 If build fails
```
My Vercel build is failing with this error: [PASTE ERROR HERE]
Based on my project structure above, what is the fix?
```

### 🔴 If API returns 404
```
My /api/auth/login endpoint returns 404 in production on Vercel.
Local dev works fine. Based on my project structure, what could cause this?
```

### 🔴 If Google OAuth fails
```
After clicking "Sign in with Google", I get redirected back with ?error=auth_failed.
The callback URL I set in Google Console is: https://myproject.vercel.app/api/auth/google/callback
What should I check based on my project structure?
```

### 🔴 If MongoDB connection fails
```
My API functions return 500 errors. The logs show: MongooseServerSelectionError
My MONGODB_URI is set in Vercel environment variables.
What are all the things I should check?
```

### 🔴 If AI streaming cuts off
```
The AI streaming response (/api/chat/ai) cuts off after ~10 seconds in production.
My maxDuration is set to 10 in vercel.json. What are my options on the free tier?
```

### 🟡 For step-by-step walkthrough
```
I've already imported my repo at https://github.com/raghavbajpai16/MYUNIONEAI into Vercel.
Walk me through exactly what to do next in the Vercel dashboard, step by step,
based on the settings in Section 7 above.
```

### 🟡 For environment variables
```
List ALL environment variables I need to add in the Vercel dashboard,
explain what each one does, and tell me which ones are required vs optional.
Base your answer on Section 6 above.
```

### 🟡 For preview vs production deployments
```
I want different environment variables for Preview deployments (feature branches)
vs Production deployment (main branch). How do I set this up in Vercel?
Which of my variables from Section 6 should differ between environments?
```

---

## ⚡ Quick Reference Card

| What you need | Where to find it |
|---------------|-----------------|
| GitHub repo URL | `https://github.com/raghavbajpai16/MYUNIONEAI` |
| Build command | `cd frontend && npm install && npm run build` |
| Output directory | `frontend/.next` |
| Install command | `npm install` |
| Node version | `18.x` |
| API base path | `/api` (relative, same domain on Vercel) |
| MongoDB setting | Atlas → Network Access → `0.0.0.0/0` |
| Google OAuth callback | `https://YOUR-APP.vercel.app/api/auth/google/callback` |
| Build test status | ✅ Passes locally (exit code 0) |
