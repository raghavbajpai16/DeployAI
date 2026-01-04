# StudentMentor AI (MYUNIONEAI)

StudentMentor AI is a platform designed to provide personalized AI-driven mentorship and tutoring for students.

## Project Overview

Phase 0 (MVP) focuses on building the core authentication and chat systems, allowing students to interact with an AI tutor on various subjects.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o-mini
- **Infrastructure**: Docker, GitHub Actions

## Getting Started

### Prerequisites

- Docker Desktop
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)

### Environment Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` in the root and configure the variables.
3. Refer to `docs/devops/02_ENVIRONMENT_SETUP.md` for detailed instructions.

### Local Development

#### Using Docker (Recommended)

```bash
docker-compose up -d
```

#### Manual Setup

Refer to the individual `README.md` files in the `backend/` and `frontend/` directories for manual setup steps.

## Documentation

- [Database Schema](docs/database/01_DATABASE_SCHEMA.md)
- [Environment Setup](docs/devops/02_ENVIRONMENT_SETUP.md)
- [Database Operations](docs/database/03_DATABASE_OPERATIONS.md)
- [GitHub Setup](docs/github/04_GITHUB_SETUP.md)
- [Week 2 API Docs](docs/backend/05_WEEK2_API.md)
- [Week 2 UI Docs](docs/frontend/06_WEEK2_UI.md)
- [Week 2 Summary](WEEK_2_SUMMARY.md)
- [Week 3 AI API Docs](docs/backend/07_WEEK3_AI_API.md)
- [Week 3 Status](WEEK_3_STATUS.md)

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.
>>>>>>> 41000a7 (feat: complete week 1 & 2 implementation with premium UI styling)
