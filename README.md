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

### ✅ Week 3: AI Core Integration (Current)
- **High-Speed AI**: Integrated Groq SDK with Llama 3 models.
- **Real-time Streaming**: Implemented Server-Sent Events (SSE) for instant typing feedback.
- **Context Awareness**: Persistent conversation history stored in MongoDB.
- **Smart Metadata**: Tracking token usage and model performance.

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
- **Frontend**: Deploy to Vercel/Netlify. Ensure `NEXT_PUBLIC_API_URL` points to your backend.
- **Backend**: Deploy to Railway.app/Render/Heroku. 
- **Database**: Use MongoDB Atlas (Shared Cluster).

## 📄 Documentation
Detailed technical docs can be found in the `/docs` directory.
- [/docs/backend/07_WEEK3_AI_API.md](docs/backend/07_WEEK3_AI_API.md) - AI Integration Details.
- [/docs/database/01_DATABASE_SCHEMA.md](docs/database/01_DATABASE_SCHEMA.md) - Schema Definitions.

## 🤝 Contributing
Contributions are welcome! Please follow the contribution guidelines.

## ⚖️ License
MIT License - 2026 StudentMentor Team.
