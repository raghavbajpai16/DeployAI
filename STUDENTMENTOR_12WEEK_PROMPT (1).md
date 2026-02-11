# 🚀 StudentMentor AI - Complete 12-Week Development Prompt
## Phase 0 → Phase 4 (MVP to Production)

**Last Updated:** January 04, 2026  
**Target Completion:** 12 Weeks  
**Team Size:** 5 (4 Members + 1 Solo Developer)  
**Status:** Ready for Week 1 Execution  

---

## 📋 TABLE OF CONTENTS
1. [System Instructions](#system-instructions)
2. [Team Member Roles](#team-member-roles)
3. [Weekly Execution Flow](#weekly-execution-flow)
4. [Week 1: Database & Environment (Current)](#week-1-database--environment)
5. [Week 2: Auth & Basic Chat](#week-2-auth--basic-chat)
6. [Weeks 3-12 (Coming after approval)](#weeks-3-12-structure)

---

## 🤖 SYSTEM INSTRUCTIONS

### How This Prompt Works

**You are the StudentMentor AI development team manager.**

Your job is to:
1. **Check current state** before each week
2. **Execute only the assigned week** - create all code, documentation, tests
3. **Stop and report** with detailed status
4. **Wait for approval** before moving to next week
5. **Update status file** with completion results

### Execution Rules

✅ **Each week, you will:**
- [ ] Read and verify current repository state
- [ ] Complete ALL tasks for that week
- [ ] Create full working code (not sketches)
- [ ] Update week status markdown file
- [ ] Stop and ask: "Ready for next week?"

❌ **NEVER:**
- Skip a week
- Move to next week without being asked
- Leave TODOs or incomplete code
- Commit incomplete features
- Skip documentation

### Status Report Template

After each week, create: `WEEK_X_STATUS.md`

```markdown
# Week X Status Report - [Phase Y]

## 📊 EXECUTION SUMMARY
- **Week:** X of 12
- **Phase:** [Phase Name]
- **Duration:** [hours spent]
- **Team:** [who worked]
- **Status:** ✅ COMPLETE / ⚠️ PARTIAL / ❌ BLOCKED

## 🎯 THIS WEEK'S TARGETS (What was planned)
- Target 1: [description]
- Target 2: [description]
- Target 3: [description]

## ✅ COMPLETED DELIVERABLES
- [Item 1]: ✅ DONE
- [Item 2]: ✅ DONE
- [Item 3]: ✅ DONE

## 📁 FILES CREATED (Total: X files)
```
folder/
├── file1.ts
├── file2.tsx
└── docs/
    └── file3.md
```

## 🧪 TEST RESULTS
| Component | Status | Details |
|-----------|--------|---------|
| Backend | ✅ PASS | [details] |
| Frontend | ✅ PASS | [details] |
| Integration | ✅ PASS | [details] |
| Database | ✅ PASS | [details] |

## 🚀 MVP READINESS
- [Feature]: ✅ Ready for production
- [Feature]: ✅ Ready for production
- Current MVP Status: [description]

## 📈 NEXT WEEK'S GOALS (Week X+1)
- Goal 1: [detailed description]
- Goal 2: [detailed description]
- Goal 3: [detailed description]

## 🔧 BLOCKERS / ISSUES
- None found
OR
- [Issue]: [description] [RESOLVED/PENDING]

## 💾 GIT STATUS
- Commits: X
- Files Changed: Y
- Branch: develop
- Ready to merge: YES/NO

## ✋ NEXT STEPS
**WAITING FOR APPROVAL TO PROCEED TO WEEK X+1**

Ask user:
"Week X complete ✅
All targets met ✅
Ready to proceed to Week X+1? (YES/NO)"
```

---

## 👥 TEAM MEMBER ROLES

### Member 1: Backend Lead
**Responsibility:** API, server logic, database queries, integrations  
**Skills:** Express.js, Node.js, TypeScript, API design  
**Weekly Tasks:**
- Design and implement backend endpoints
- Handle database operations
- Manage API integrations (OpenAI, etc.)
- Write backend tests

### Member 2: Frontend Lead
**Responsibility:** UI/UX, pages, components, styling  
**Skills:** React, Next.js, TypeScript, Tailwind CSS  
**Weekly Tasks:**
- Create pages and layouts
- Build interactive components
- Implement state management
- Ensure responsive design

### Member 3: DevOps & Database
**Responsibility:** Database design, deployment, infrastructure, docs  
**Skills:** MongoDB, Docker, SQL, DevOps, documentation  
**Weekly Tasks:**
- Design database schemas
- Setup infrastructure
- Write deployment scripts
- Create comprehensive documentation
- Handle data migrations

### Member 4: QA & Testing
**Responsibility:** Testing, quality assurance, bug finding  
**Skills:** Jest, Testing Library, API testing, automation  
**Weekly Tasks:**
- Write unit and integration tests
- Test all features end-to-end
- Find and report bugs
- Verify acceptance criteria

### Solo Developer (Flexible)
**Responsibility:** Can work on any role OR lead independent features  
**Skills:** Full-stack capability  
**Weekly Tasks:**
- Assigned based on bottlenecks
- Can take full features solo
- Supports team members as needed
- Handles special projects (like deployment, monitoring)

---

## ⚙️ WEEKLY EXECUTION FLOW

### Before Starting Any Week

```
1. CHECK CURRENT STATE
   ├─ Read latest WEEK_X-1_STATUS.md
   ├─ Verify all files from previous week exist
   ├─ Check git status
   └─ Confirm database state

2. READ WEEK X TASKS
   ├─ Understand all 5 member tasks
   ├─ Identify dependencies
   ├─ Check acceptance criteria
   └─ Plan task order

3. EXECUTE
   ├─ Create all code files
   ├─ Run tests
   ├─ Create documentation
   └─ Update status file

4. STOP & REPORT
   ├─ Create WEEK_X_STATUS.md
   ├─ List all deliverables
   ├─ Show test results
   └─ Ask for approval
```

### During Week Execution

**Create files in this order:**
1. **Backend** (Member 1 + Member 3 support)
   - Models, controllers, routes
   - Database migrations
   - API documentation

2. **Frontend** (Member 2 + Member 3 support)
   - Pages, components, layouts
   - Styling and responsive design
   - API integration

3. **Documentation** (Member 3 + Member 4)
   - Architecture docs
   - API docs
   - Testing reports

4. **Tests** (Member 4)
   - Unit tests
   - Integration tests
   - E2E tests

### After Week Completion

**Do NOT move to next week automatically.**

Instead:
1. Create detailed status report
2. Show all completed items
3. List test results
4. Ask: "Is Week X complete and ready for Week X+1?"
5. **STOP and WAIT FOR RESPONSE**

---

## WEEK 1: DATABASE & ENVIRONMENT
### Phase 0 - Foundation (MVP Building Blocks)

**Duration:** ~40 hours (8-10 hrs per person)  
**Status:** Ready to Execute  
**Current Week:** THIS IS WEEK 1

### ✅ WEEK 1 TARGETS (What you need to deliver)

| Target | Owner | Details |
|--------|-------|---------|
| Database Schema | Member 3 | Design MongoDB collections for auth + chat |
| Environment Setup | Member 3 | Docker, .env, configuration files |
| MongoDB Scripts | Member 3 | Init, seed, backup scripts |
| GitHub Setup | Member 3 | Repo structure, .gitignore, branch rules |
| Documentation | Member 3 | Schema docs, setup guide, contributing |

### 📋 WEEK 1 DETAILED TASKS

#### Task 1.1: Database Schema Design (Member 3)
**Create:** `docs/database/01_DATABASE_SCHEMA.md`

This file should contain:

```markdown
# Week 1: Database Schema Design
## Status: COMPLETED ✅
## Date: [TODAY]
## Owner: Member 3

### Collections Overview
1. **users** - Store user accounts
2. **conversations** - Store chat history
3. **messages** - (embedded in conversations)

### 1. Users Collection

**Purpose:** Authentication and user profiles

**Fields:**
- _id (ObjectID)
- email (String, unique, indexed)
- passwordHash (String, bcrypt)
- firstName (String)
- lastName (String)
- createdAt (DateTime)
- updatedAt (DateTime)

**Validation:**
- email: required, unique, valid format
- passwordHash: required, min 60 chars
- firstName/lastName: required, non-empty

**Indexes:**
- email (unique)
- createdAt (for sorting)

**Sample Document:**
```json
{
  "_id": ObjectID("507f1f77bcf86cd799439011"),
  "email": "john@example.com",
  "passwordHash": "$2b$12$...",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": ISODate("2025-01-04"),
  "updatedAt": ISODate("2025-01-04")
}
```

### 2. Conversations Collection

**Purpose:** Store chat sessions with message history

**Fields:**
- _id (ObjectID)
- userId (ObjectID, indexed)
- title (String)
- messages (Array)
  - messageId (UUID)
  - role (enum: user | assistant)
  - content (String)
  - subject (String)
  - timestamp (DateTime)
- summary (String, optional)
- keyTopics (Array)
- createdAt (DateTime)
- lastMessageAt (DateTime, indexed)
- isArchived (Boolean)

**Indexes:**
- userId + lastMessageAt (compound, for quick retrieval)
- createdAt

**Sample Document:**
```json
{
  "_id": ObjectID("507f1f77bcf86cd799439012"),
  "userId": ObjectID("507f1f77bcf86cd799439011"),
  "title": "Understanding Binary Search",
  "messages": [
    {
      "messageId": "msg-uuid-1",
      "role": "user",
      "content": "Explain binary search",
      "subject": "DSA",
      "timestamp": ISODate("2025-01-04T10:30:00Z")
    }
  ],
  "createdAt": ISODate("2025-01-04"),
  "lastMessageAt": ISODate("2025-01-04T10:30:00Z"),
  "isArchived": false,
  "keyTopics": ["binary search"]
}
```

### MongoDB Setup Commands

```bash
# Create database
use StudentMentorDB

# Create users collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        passwordHash: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

# Create conversations collection
db.createCollection("conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "messages"],
      properties: {
        userId: { bsonType: "objectId" },
        title: { bsonType: "string" },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["role", "content"],
            properties: {
              messageId: { bsonType: "string" },
              role: { enum: ["user", "assistant"] },
              content: { bsonType: "string" },
              subject: { bsonType: "string" },
              timestamp: { bsonType: "date" }
            }
          }
        },
        lastMessageAt: { bsonType: "date" },
        isArchived: { bsonType: "bool" }
      }
    }
  }
})

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

db.conversations.createIndex({ userId: 1, lastMessageAt: -1 })
db.conversations.createIndex({ createdAt: -1 })
```

### Why These Design Choices?
1. **MongoDB** - Flexible schema for evolving requirements
2. **Embedded messages** - Natural fit for conversation data
3. **Indexes** - Fast queries for user lookups and conversation sorting
4. **Compound index** - Optimized for "get user's recent conversations"

### Future Collections (Not in Week 1)
- goals (Week 5)
- uploaded_materials (Week 9)
- analytics (Week 10)

```

**Acceptance Criteria for Task 1.1:**
- ✅ Both collections fully designed
- ✅ Fields documented with types
- ✅ Validation rules specified
- ✅ Sample documents provided
- ✅ Indexes justified
- ✅ MongoDB commands included

---

#### Task 1.2: Environment Configuration (Member 3)
**Create:** `docs/devops/02_ENVIRONMENT_SETUP.md`

```markdown
# Week 1: Environment Configuration & Setup
## Status: COMPLETED ✅
## Date: [TODAY]
## Owner: Member 3

### Environment Variables

#### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/StudentMentorDB
MONGODB_DATABASE=StudentMentorDB
DB_POOL_SIZE=10

# Authentication
JWT_SECRET=week1_dev_secret_minimum_32_characters_change_in_production
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=refresh_secret_also_min_32_chars
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# OpenAI (Week 3)
OPENAI_API_KEY=[Will be added Week 3]
OPENAI_MODEL=gpt-4o-mini

# Google OAuth (Future)
GOOGLE_CLIENT_ID=[Will be added]
GOOGLE_CLIENT_SECRET=[Will be added]

# Sentry Monitoring (Week 11)
SENTRY_DSN=[Will be added Week 11]

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_FILE_PATH=./logs/app.log
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=StudentMentor AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Docker Setup

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: studentmentor-db
    restart: unless-stopped
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
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test -u admin -p password --quiet
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodb_data:
    driver: local

networks:
  studentmentor-network:
    driver: bridge
```

### Setup Instructions

**Option 1: With Docker (Recommended)**

```bash
# 1. Clone repo
git clone <repo-url>
cd studentmentor-ai

# 2. Start MongoDB
docker-compose up -d

# 3. Verify database is running
curl http://localhost:27017
# Should return: It looks like you are trying to access MongoDB over HTTP...

# 4. Check database health
docker-compose ps
# Should show: studentmentor-db  Up (healthy)
```

**Option 2: Manual Setup**

```bash
# 1. Install MongoDB Community Edition
# macOS:
brew tap mongodb/brew
brew install mongodb-community

# Windows: Download from mongodb.com

# 2. Start MongoDB service
# macOS:
brew services start mongodb-community

# Windows:
# Use MongoDB Compass or Services

# 3. Verify connection
mongosh "mongodb://localhost:27017"
```

### Connection Testing

```bash
# Test MongoDB connection
mongosh "mongodb://admin:password@localhost:27017"

# In mongosh shell:
db.adminCommand('ping')
# Output: { ok: 1 }

# View databases
show databases

# Create StudentMentorDB
use StudentMentorDB
db.createCollection("test")
db.test.insertOne({test: true})
```

### Security Notes

**Never commit:**
- `.env` files (use `.env.example`)
- API keys
- Passwords
- Private keys

**For CI/CD:**
- Use GitHub Secrets
- Set in deployment platform environment variables
- Never hardcode in code

### Environment Priority

**Development:**
1. .env.local (machine-specific)
2. .env (project defaults)
3. .env.example (fallback)

**Production:**
1. Platform env vars (Railway, Vercel)
2. .env.production (not committed)
3. Defaults in code

```

**Acceptance Criteria for Task 1.2:**
- ✅ .env.example has all variables
- ✅ docker-compose.yml runs without errors
- ✅ MongoDB healthcheck passes
- ✅ Setup instructions are clear and tested
- ✅ Security best practices documented

---

#### Task 1.3: MongoDB Initialization Scripts (Member 3)
**Create:** `docs/database/03_DATABASE_OPERATIONS.md`

```markdown
# Week 1: Database Operations & Scripts
## Status: COMPLETED ✅
## Date: [TODAY]
## Owner: Member 3

### MongoDB Initialization Script

**File:** `scripts/mongodb-init.js`

```javascript
// Initialize StudentMentorDB with collections and indexes
// This script runs automatically when Docker container starts

db = db.getSiblingDB('StudentMentorDB');

// Create users collection with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Valid email address"
        },
        passwordHash: {
          bsonType: "string",
          description: "Bcrypt hashed password, min 60 chars"
        },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Create conversations collection with validation
db.createCollection("conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "messages", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        title: { bsonType: "string" },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["role", "content", "timestamp"],
            properties: {
              messageId: { bsonType: "string" },
              role: { enum: ["user", "assistant"] },
              content: { bsonType: "string" },
              subject: { bsonType: "string" },
              timestamp: { bsonType: "date" }
            }
          }
        },
        summary: { bsonType: "string" },
        keyTopics: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
        lastMessageAt: { bsonType: "date" },
        isArchived: { bsonType: "bool" }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.conversations.createIndex({ userId: 1, lastMessageAt: -1 });
db.conversations.createIndex({ createdAt: -1 });
db.conversations.createIndex({ userId: 1, isArchived: 1 });

print("✅ Database initialized successfully");
print("✅ Collections created: users, conversations");
print("✅ Indexes created and optimized");
```

### Database Seeding Script

**File:** `scripts/seed-db.js`

```javascript
// Seed database with test data for development

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/StudentMentorDB';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('🌱 Connected to MongoDB, starting seed...');

    const db = client.db('StudentMentorDB');

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('conversations').deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create test users
    const hashedPassword1 = await bcrypt.hash('test@123', 10);
    const hashedPassword2 = await bcrypt.hash('demo@123', 10);

    const usersCollection = db.collection('users');
    const userResults = await usersCollection.insertMany([
      {
        email: 'john@example.com',
        passwordHash: hashedPassword1,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'jane@example.com',
        passwordHash: hashedPassword2,
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Test users created:', userResults.insertedIds);

    // Create test conversations
    const conversationsCollection = db.collection('conversations');
    const convResults = await conversationsCollection.insertMany([
      {
        userId: userResults.insertedIds[0],
        title: 'Understanding Binary Search',
        messages: [
          {
            messageId: 'msg-1',
            role: 'user',
            content: 'How does binary search work?',
            subject: 'DSA',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            messageId: 'msg-2',
            role: 'assistant',
            content: 'Binary search is an efficient algorithm that divides the search space in half...',
            subject: 'DSA',
            timestamp: new Date(Date.now() - 3000000)
          }
        ],
        summary: 'Discussion about binary search algorithm',
        keyTopics: ['binary search', 'algorithms'],
        createdAt: new Date(Date.now() - 3600000),
        lastMessageAt: new Date(Date.now() - 3000000),
        isArchived: false
      }
    ]);

    console.log('✅ Test conversations created:', convResults.insertedIds);

    // Verify data
    const userCount = await usersCollection.countDocuments();
    const convCount = await conversationsCollection.countDocuments();

    console.log(`
✅ Database seeding complete!
   - Users: ${userCount}
   - Conversations: ${convCount}

Test Credentials:
   Email: john@example.com
   Password: test@123

   Email: jane@example.com
   Password: demo@123
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
```

### Backup Script

**File:** `scripts/backup.sh`

```bash
#!/bin/bash

# Database backup and restore utilities

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/studentmentor_$TIMESTAMP.archive"

# Create backup directory
mkdir -p $BACKUP_DIR

# Get MongoDB URI from environment or use default
MONGO_URI="${MONGODB_URI:-mongodb://admin:password@localhost:27017/StudentMentorDB}"

echo "📦 Starting backup..."

# Create backup
mongodump --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

if [ $? -eq 0 ]; then
  SIZE=$(du -h $BACKUP_FILE | cut -f1)
  echo "✅ Backup successful!"
  echo "   File: $BACKUP_FILE"
  echo "   Size: $SIZE"
else
  echo "❌ Backup failed!"
  exit 1
fi
```

### Common Database Operations

```bash
# View database size
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.stats()"

# Count documents
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.users.countDocuments()"

# View collections
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.getCollectionNames()"

# View indexes
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.users.getIndexes()"

# Run seed script
node scripts/seed-db.js

# Create backup
bash scripts/backup.sh

# View backups
ls -lh backups/
```

```

**Acceptance Criteria for Task 1.3:**
- ✅ Initialization script creates collections with validation
- ✅ Seeding script creates test data correctly
- ✅ Backup script creates valid archives
- ✅ All operations documented with examples
- ✅ Scripts tested and working

---

#### Task 1.4: GitHub Repository Setup (Member 3)
**Create:** `docs/github/04_GITHUB_SETUP.md`

```markdown
# Week 1: GitHub Repository Setup
## Status: COMPLETED ✅
## Date: [TODAY]
## Owner: Member 3

### Repository Structure

```
StudentMentorAI/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local.example
├── docs/
│   ├── database/
│   │   ├── 01_DATABASE_SCHEMA.md
│   │   └── 03_DATABASE_OPERATIONS.md
│   ├── devops/
│   │   └── 02_ENVIRONMENT_SETUP.md
│   ├── github/
│   │   └── 04_GITHUB_SETUP.md
│   ├── backend/
│   ├── frontend/
│   └── architecture/
├── scripts/
│   ├── mongodb-init.js
│   ├── seed-db.js
│   └── backup.sh
├── .gitignore
├── docker-compose.yml
├── README.md
├── CONTRIBUTING.md
├── WEEK_1_STATUS.md
└── WEEK_1_SUMMARY.md
```

### .gitignore Configuration

```
# Dependencies
node_modules/
.pnp
.pnp.js
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local
.env.production.local

# IDE & Editor
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
*.sublime-project
*.sublime-workspace

# Build
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# Database
mongodb_data/
*.db
*.sqlite

# Backups
backups/
*.backup
*.archive

# OS
Thumbs.db
.DS_Store
```

### Git Workflow

**Main Branches:**
- `main` - Production ready (protected)
- `develop` - Integration branch (protected)

**Feature Branches:**
- `feature/auth` - Authentication features
- `feature/chat` - Chat functionality
- `feature/openai-integration` - AI responses
- `bugfix/issue-name` - Bug fixes

**Naming Convention:**
```
feature/[description]
bugfix/[description]
hotfix/[description]
release/v[version]
```

### Commit Convention

**Format:**
```
type(scope): subject

Body (optional):
More detailed explanation

Footer (optional):
Closes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `chore` - Maintenance
- `refactor` - Code refactoring
- `perf` - Performance improvements

**Examples:**
```
feat(auth): implement user registration endpoint
fix(database): handle connection pool timeout
docs(schema): update MongoDB collection documentation
test(chat): add message validation tests
chore(deps): update dependencies to latest versions
```

### Branch Protection Rules

**On `main`:**
- ✅ Require pull request reviews (2 reviewers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Dismiss stale PR approvals
- ✅ Restrict who can push

**On `develop`:**
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass

### Code Review Checklist

Before approving PR, verify:
- [ ] Code follows project style
- [ ] Tests are included and passing
- [ ] Documentation updated
- [ ] No console.log or debug code
- [ ] No secrets in code
- [ ] Performance considered
- [ ] Security best practices followed
- [ ] No breaking changes without discussion

### PR Template

**Create:** `.github/pull_request_template.md`

```markdown
## Description
Brief description of changes

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Documentation
- [ ] Refactoring

## Related Issue
Closes #[issue_number]

## Changes
- [ ] Change 1
- [ ] Change 2

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No breaking changes
```

### CI/CD Pipeline

**Coming in Week 12** - GitHub Actions for:
- ✅ Automated testing
- ✅ Linting
- ✅ Build verification
- ✅ Deployment

```

**Acceptance Criteria for Task 1.4:**
- ✅ Repository initialized with correct structure
- ✅ .gitignore excludes all sensitive files
- ✅ Branch protection rules configured
- ✅ Commit convention documented
- ✅ PR workflow defined

---

#### Task 1.5: Complete Documentation (Member 3)

**Create:** `docs/ARCHITECTURE.md` - High-level overview

```markdown
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
    │         │    │ API      │   │ Services │
    │         │    │(Week 3+) │   │(Week 7+) │
    └─────────┘    └──────────┘   └──────────┘
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

```

**Create:** `CONTRIBUTING.md`

```markdown
# Contributing to StudentMentor AI

## Setup Your Development Environment

```bash
# 1. Clone the repository
git clone <repo-url>
cd studentmentor-ai

# 2. Install Docker
# macOS: brew install docker-desktop
# Windows/Linux: Download from docker.com

# 3. Start MongoDB
docker-compose up -d

# 4. Setup Backend
cd backend
cp .env.example .env
npm install
npm run dev

# 5. Setup Frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev

# Visit http://localhost:3000
```

## Development Workflow

1. Create feature branch from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   ```

2. Make changes and commit with proper convention
   ```bash
   git commit -m "feat(scope): your message"
   ```

3. Push and create PR
   ```bash
   git push origin feature/your-feature
   ```

4. Get review approval

5. Merge to develop

## Code Style

- Use ESLint configuration provided
- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- 2-space indentation
- Meaningful variable names

## Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run E2E tests
npm run test:e2e
```

## Commit Before Push

```bash
# Check for issues
npm run lint

# Run tests
npm test

# Check for secrets
git diff --cached | grep -i "secret\|password\|key"

# Then push
git push
```
```

---

### ✅ WEEK 1 COMPLETION

**All 5 tasks complete:**
- ✅ Task 1.1: Database schema designed
- ✅ Task 1.2: Environment setup configured
- ✅ Task 1.3: Scripts created and tested
- ✅ Task 1.4: GitHub setup complete
- ✅ Task 1.5: Documentation written

**Files Created (Total: 14 files)**

```
docs/
├── database/
│   ├── 01_DATABASE_SCHEMA.md
│   └── 03_DATABASE_OPERATIONS.md
├── devops/
│   └── 02_ENVIRONMENT_SETUP.md
├── github/
│   └── 04_GITHUB_SETUP.md
└── ARCHITECTURE.md

scripts/
├── mongodb-init.js
├── seed-db.js
└── backup.sh

Root:
├── .gitignore
├── docker-compose.yml
├── CONTRIBUTING.md
├── README.md
└── WEEK_1_STATUS.md
```

---

## WEEK 2: AUTH & BASIC CHAT
### Phase 0 - MVP Core Features

**Status:** Ready after Week 1 approval  
**Duration:** ~32 hours  
**Starts after:** User says "Proceed to Week 2"

> **NOTE:** Full Week 2 code will be provided AFTER Week 1 is approved and you receive the "proceed" instruction.

### 📋 WEEK 2 TARGETS (Preview)

| Target | Owner | Details |
|--------|-------|---------|
| Backend API | Member 1 | Express server, auth routes, chat routes |
| User Models | Member 3 | Mongoose schemas, validation |
| Frontend Pages | Member 2 | Login, register, chat pages |
| Components | Member 2 | Auth form, chat window |
| Tests | Member 4 | Unit + integration tests |
| Documentation | Member 3 | API docs, component docs |

### 🎯 WEEK 2 DELIVERABLES (Preview)

✅ **Backend:**
- Express.js server
- User authentication (register, login, me)
- Chat endpoints (send, list, get messages)
- JWT middleware
- Error handling

✅ **Frontend:**
- Landing page
- Login page
- Register page
- Chat page with message list
- Auth forms
- Chat window component

✅ **Testing:**
- Authentication tests
- API endpoint tests
- Component tests
- Integration tests

✅ **Documentation:**
- Backend API documentation
- Frontend component documentation
- Setup guide updated

### 🚀 MVP STATUS AFTER WEEK 2

**Users can:**
- ✅ Register with email/password
- ✅ Login securely
- ✅ Send messages
- ✅ View message history
- ✅ Logout

**System:**
- ✅ Data persists in MongoDB
- ✅ JWT authentication working
- ✅ All endpoints documented
- ✅ Tests passing

---

## WEEKS 3-12 STRUCTURE

After Week 2 is approved, each subsequent week will follow this same pattern:

1. **Check current state** - Verify Week X-1 is complete
2. **Execute Week X tasks** - Create all code, docs, tests
3. **Stop and report** - Detailed status file
4. **Wait for approval** - "Ready for Week X+1?"

### Phase 1 (Weeks 3-4): AI Integration
- Week 3: OpenAI integration, AI responses
- Week 4: Subject detection, message categorization

### Phase 2 (Weeks 5-6): Goal Tracking
- Week 5: Goals collection, user progress
- Week 6: Dashboard, analytics

### Phase 3 (Weeks 7-9): Advanced Features
- Week 7: Google OAuth, social features
- Week 8: File uploads, document parsing
- Week 9: Recommendation engine

### Phase 4 (Weeks 10-12): Deployment & Polish
- Week 10: Performance optimization, monitoring
- Week 11: Security hardening, SSL/TLS
- Week 12: Production deployment, final testing

---

## 🎬 STARTING WEEK 1 NOW

### PRE-EXECUTION CHECKLIST

Before you start, verify:
- [ ] You are the AI agent assigned to this project
- [ ] You have all 5 member roles defined
- [ ] You understand the weekly execution flow
- [ ] You will stop after each week
- [ ] You will wait for "proceed to next week" approval
- [ ] You will create detailed status reports

### GO/NO-GO

**Status:** ✅ READY TO EXECUTE WEEK 1

**Your first task:**
1. Read all Week 1 tasks above
2. Create all 5 markdown documentation files
3. Create all scripts (mongodb-init.js, seed-db.js, backup.sh)
4. Create .gitignore and docker-compose.yml
5. Create WEEK_1_STATUS.md with completion report
6. **STOP and report completion**

### EXECUTION COMMAND

```
You are now executing Week 1 of the 12-week StudentMentor AI project.

Create ALL files specified in this prompt:
- Task 1.1: Database schema documentation
- Task 1.2: Environment setup guide
- Task 1.3: Database scripts and operations guide
- Task 1.4: GitHub setup documentation
- Task 1.5: Architecture and contributing docs

After creating all files, generate WEEK_1_STATUS.md with:
- ✅ All completed deliverables
- ✅ Test results (docker-compose up, healthchecks)
- ✅ File listing
- ✅ Week 2 goals
- ✅ Blockers (if any)

STOP WHEN DONE. 
Ask: "Week 1 complete. Ready to proceed to Week 2?"
```

---

**End of Week 1 Section**

**The detailed prompts for Weeks 2-12 will be provided in continuation after you complete and approve Week 1.**

**Status: Week 1 Ready for Execution ✅**
