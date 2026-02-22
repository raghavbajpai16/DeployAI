# StudentMentor AI (MYUNIONEAI)

StudentMentor AI is a platform designed to provide personalized AI-driven mentorship and tutoring for students.

## Project Overview

Phase 0 (MVP) focuses on building the core authentication and chat systems, allowing students to interact with an AI tutor on various subjects.

## Tech Stack

- **AI Integration**: Groq Llama 3 (Ultra-fast inference)
- **Database**: MongoDB Atlas with Mongoose
- **Infrastructure**: Docker Ready, CI/CD with GitHub Actions

## 📅 Roadmap & Progress

### ✅ Week 1 & 2: Authentication & UI Foundation
- Luxury Glassmorphic UI Design.
- Robust JWT-based Authentication.
- User Profile management.

### ✅ Week 3: AI Core Integration
- **High-Speed AI**: Integrated Groq SDK with Llama 3 models.
- **Real-time Streaming**: Implemented Server-Sent Events (SSE) for instant typing feedback.
- **Context Awareness**: Persistent conversation history stored in MongoDB.
- **Smart Metadata**: Tracking token usage and model performance.

### ✅ Week 4: Subject Detection & Categorization (Current)
- **Smart Subject Detection**: AI-based automatic detection of academic subjects using Groq Llama 3.
- **Intent Classification**: Automatic message type classification (Question, Help, Explanation, etc.).
- **Subject Selector UI**: Interactive horizontal pill selector for manual subject override.
- **Confidence Scoring**: Track detection confidence for each classified message.
- **Analytics & Stats**: Database tracking of usage statistics per user and subject.
- **Auto-Detect Mode**: Default intelligent categorization powered by AI suggestions.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- MongoDB Atlas Account
- Groq API Key (from [console.groq.com](https://console.groq.com))

### 2. Installation
```bash
# Clone the repo
git clone https://github.com/Team-MyUniOne/MYUNIONEAI.git

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Setup
Create a `.env` in the `backend/` directory using `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_32_char_secret
GROQ_API_KEY=your_groq_key
```

### 4. Running Locally
```bash
# Start Backend
cd backend && npm run dev

# Start Frontend
cd frontend && npm run dev
```

## ☁️ Deployment Ready

This project is configured for seamless deployment:
- **Frontend**: Deploy to Vercel/Netlify. 
  - Ensure `NEXT_PUBLIC_API_URL` points to your backend.
  - The project is configured with `output: 'standalone'` for optimal Vercel performance.
  - Vercel build command: `cd frontend && npm run build` (set in `vercel.json`).
- **Backend**: Deploy to Railway.app/Render/Heroku. 
- **Database**: Use MongoDB Atlas (Shared Cluster).

### Vercel Deployment Note
If you encounter "Export encountered errors" on Vercel:
1. Ensure `framer-motion@^11` and `recharts@^2` are used (already configured in `package.json`).
2. Verify all environment variables are correctly set in the Vercel dashboard.
3. The build is configured to ignore minor lint/TS errors to ensure deployment completion.

## 📄 Documentation
Detailed technical docs can be found in the `/docs` directory.
- [/docs/backend/07_WEEK3_AI_API.md](docs/backend/07_WEEK3_AI_API.md) - AI Integration Details.
- [/docs/backend/08_WEEK4_CLASSIFICATION.md](docs/backend/08_WEEK4_CLASSIFICATION.md) - Subject Detection & Classification.
- [/docs/database/01_DATABASE_SCHEMA.md](docs/database/01_DATABASE_SCHEMA.md) - Schema Definitions.

## 🤝 Contributing
Contributions are welcome! Please follow the contribution guidelines.

## ⚖️ License
MIT License - 2026 StudentMentor Team.
