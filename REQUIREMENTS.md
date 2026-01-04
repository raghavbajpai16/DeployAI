# Project Setup & Requirements 🛠️

This document outlines the necessary software, cloud accounts, and environment configurations required to run and develop the **StudentMentor AI** platform.

## 1. Local Software Requirements

Before starting, ensure you have the following installed on your machine:

| Requirement | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | v20.x or higher | Runtime for Backend & Frontend |
| **npm** | v9.x or higher | Package management |
| **Docker Desktop** | Latest | Running local MongoDB and containerized services |
| **Git** | Latest | Version control and collaboration |
| **VS Code** | Latest | Recommended IDE (with ES7+, Tailwind, and TS extensions) |
| **MongoDB Shell (mongosh)** | Latest | Manual database initialization and queries |

---

## 2. Cloud Service Accounts (Cloud Model Focus)

Since we are prioritizing **Cloud Models** for scalability and ease of setup, you will need the following accounts:

### A. Database (MongoDB Atlas)
While Docker runs MongoDB locally, production and shared staging environments require MongoDB Atlas.
- **Provider**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/signup)
- **Tier**: Free M0 Cluster is sufficient for MVP.
- **Setup**: Create a database named `StudentMentorDB` and get your connection string.

### B. AI Engine (OpenAI)
Our project uses cloud LLMs for academic assistance.
- **Provider**: [OpenAI Platform](https://platform.openai.com/)
- **API Key**: Required for the `OPENAI_API_KEY` variable.
- **Model Used**: `gpt-4o-mini` (Cost-effective and fast for student queries).

### C. Authentication (Google Cloud Console)
For future Google OAuth integration.
- **Provider**: [Google Cloud Console](https://console.cloud.google.com/)
- **Setup**: Create a "Web Application" OAuth 2.0 Client ID.

---

## 3. Environment Variables (.env) Requirements

You must create local environment files that are **excluded from Git**.

### Backend (`backend/.env`)
Create this file and fill in your cloud credentials:
```env
# Basic Server
PORT=5000
NODE_ENV=development

# Database (Replace with your Atlas URI)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/StudentMentorDB
MONGODB_DATABASE=StudentMentorDB

# Secrets (Minimum 32 characters recommended)
JWT_SECRET=your_32_character_random_secret_here
JWT_EXPIRY=24h

# AI Integration (Week 3 Requirements)
OPENAI_API_KEY=sk-xxxx...
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=StudentMentor AI
```

---

## 4. Installation & Start Sequence

Follow this order to ensure everything connects properly:

1. **Clone & Install**:
   ```bash
   npm install  # Run in /backend and /frontend separately
   ```

2. **Database Start**:
   - If using Local: `docker-compose up -d`
   - If using Cloud: Ensure your IP is whitelisted in MongoDB Atlas.

3. **Database Setup**:
   ```bash
   mongosh "YOUR_CONNECTION_STRING" < scripts/mongodb-init.js
   ```

4. **Run Development**:
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`

---

## 5. Summary Checklist for New Members
- [ ] Node.js & Docker installed.
- [ ] OpenAI API Key obtained.
- [ ] MongoDB Atlas cluster created (or local Docker running).
- [ ] `.env` files created from `.example` templates.
- [ ] `npm install` completed in both directories.
