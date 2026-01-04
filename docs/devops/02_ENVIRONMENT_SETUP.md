# Week 1: Environment Configuration & Setup
## Status: COMPLETED
## Date: 2025-12-27
## Completed By: Member 3 (Full-Stack Developer/Antigravity)

### Environment Variables Guide

#### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/StudentMentorDB
MONGODB_DATABASE=StudentMentorDB
DB_CONNECTION_POOL_SIZE=10

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRY=7d

# OpenAI Configuration (Phase 1)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT=30000

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Service (Phase 2)
SENDGRID_API_KEY=SG.xxxxx

# AWS S3 (Phase 3)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=studentmentor-uploads

# Frontend URLs
FRONTEND_URL=http://localhost:3000
PRODUCTION_URL=https://studentmentor.vercel.app

# Pinecone (Phase 3)
PINECONE_API_KEY=xxxxx
PINECONE_ENVIRONMENT=gcp-starter

# Sentry (Monitoring)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_FILE_PATH=./logs/app.log
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
NEXT_PUBLIC_APP_NAME=StudentMentor AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Docker Setup

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:latest
    container_name: studentmentor-db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: StudentMentorDB
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongodb-init.js:/docker-entrypoint-initdb.d/init.js
    networks:
      - studentmentor-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: studentmentor-api
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/StudentMentorDB
      - NODE_ENV=development
      - PORT=5000
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - studentmentor-network
    command: npm run dev

networks:
  studentmentor-network:
    driver: bridge

volumes:
  mongodb_data:
```

### Setup Instructions

**Local Development (Docker)**:

1. Install Docker Desktop
2. Clone repository
3. Run: `docker-compose up -d`
4. MongoDB available at: `mongodb://admin:password@localhost:27017`
5. Backend available at: `http://localhost:5000`

**Manual Setup**:

1. Install MongoDB Community Edition
2. Install Node.js 20+
3. Copy `.env.example` to `.env`
4. Update environment variables
5. Run: `npm install` in backend folder
6. Run: `npm run dev` to start

### Environment Variable Priority

Development Priority:
1. .env (local overrides)
2. .env.local (local machine)
3. .env.example (defaults)

Production Priority:
1. Platform environment variables (Railway)
2. .env.production (file, not committed)

### Security Notes

**DO NOT commit to GitHub**:
- `.env` files
- API keys and secrets
- Database credentials
- OAuth client secrets

**Use GitHub Secrets** for CI/CD:
- Store all secrets in repository secrets
- Reference in GitHub Actions

### Dependencies
- Blocked by: Nothing
- Blocks: Member 1 (Backend) - needs environment setup
- Blocks: All members - need working dev environment

### Testing Checklist
- [ ] Docker containers start without errors
- [ ] MongoDB accessible from backend
- [ ] All environment variables loaded correctly
- [ ] Backend server starts successfully
- [ ] Database health check passes
