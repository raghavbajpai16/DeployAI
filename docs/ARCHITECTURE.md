# StudentMentor AI - Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌──────────────┬──────────────┬─────────────────────┐  │
│  │  Landing     │  Auth Pages  │  Chat Interface     │  │
│  │  (/)         │  (/login)    │  (/chat)            │  │
│  └──────────────┴──────────────┴─────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend API (Express)                   │
│  ┌──────────────┬──────────────┬─────────────────────┐  │
│  │  Auth API    │  Chat API    │  Middleware         │  │
│  │  (register,  │  (send msg,  │  (JWT, CORS,      │  │
│  │   login)     │   get chats)  │   validation)       │  │
│  └──────────────┴──────────────┴─────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐   ┌──────────┐
    │ MongoDB │    │ OpenAI   │   │ External │
    │         │    │(Week 3+) │   │ Services │
    │         │    └──────────┘   │(Week 7+) │
    └─────────┘                   └──────────┘
```

## Technology Stack

### Frontend
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- React Hooks

### Backend
- Express.js
- Node.js 20+
- TypeScript
- JWT Authentication
- Mongoose (MongoDB)

### Database
- MongoDB 7.0+
- Mongoose ODM
- Indexes for performance

### Infrastructure
- Docker & Docker Compose
- MongoDB Atlas (production)
- Vercel (frontend deployment)
- Railway/Render (backend deployment)

## Data Flow

**Week 1 (Current):**
1. User registers → Stored in MongoDB
2. User logs in → JWT token returned
3. User sends message → Stored in conversations collection
4. Message retrieved from DB → Displayed in UI

**Week 3+:**
1. User sends message
2. Backend receives message
3. Message sent to OpenAI API
4. AI response returned
5. Both messages stored in DB
6. Displayed to user

## Security Layers

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ CORS validation
- ✅ Input validation
- ✅ Environment variables (no secrets in code)
- 🔄 Rate limiting (Week 2)
- 🔄 OAuth integration (Week 6)
- 🔄 SSL/TLS in production (Week 11)
