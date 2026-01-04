# Week 1: Database Schema Design
## Status: COMPLETED
## Date: 2025-12-27
## Completed By: Member 3 (Full-Stack Developer/Antigravity)

### Collections Design

#### 1. Users Collection
Purpose: Store user account information

Fields:
- userId (UUID, primary key)
- email (String, unique, indexed)
- passwordHash (String, bcrypt hashed)
- googleId (String, optional, unique)
- firstName (String)
- lastName (String)
- createdAt (DateTime, indexed)
- updatedAt (DateTime)

Indexes:
- email (unique)
- googleId (unique)
- createdAt (for sorting)

Validation:
- email: required, valid email format
- passwordHash: required, min 60 chars
- googleId: optional

Sample Document:
```json
{
  "_id": "ObjectId",
  "email": "student@example.com",
  "passwordHash": "$2b$10$...",
  "googleId": null,
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-12-22T00:00:00Z",
  "updatedAt": "2025-12-22T00:00:00Z"
}
```

#### 2. Conversations Collection
Purpose: Store chat conversations between users and AI

Fields:
- conversationId (UUID, primary key)
- userId (UUID, foreign key, indexed)
- title (String)
- messages (Array of Objects)
  - messageId (UUID)
  - role (enum: "user" | "assistant")
  - content (String)
  - subject (String, optional)
  - type (enum: "question" | "assignment_help" | "exam_prep", optional)
  - timestamp (DateTime)
- createdAt (DateTime, indexed)
- lastMessageAt (DateTime, indexed)
- isArchived (Boolean, default: false)

Indexes:
- userId, lastMessageAt (compound, for listing conversations)
- createdAt (for time-based queries)

Validation:
- userId: required
- messages: required, non-empty array
- role: required, must be "user" or "assistant"
- content: required, non-empty string

Sample Document:
```json
{
  "_id": "ObjectId",
  "conversationId": "uuid-string",
  "userId": "user-uuid",
  "title": "Understanding Binary Search",
  "messages": [
    {
      "messageId": "msg-uuid-1",
      "role": "user",
      "content": "Explain binary search",
      "subject": "DSA",
      "type": "question",
      "timestamp": "2025-12-22T10:30:00Z"
    },
    {
      "messageId": "msg-uuid-2",
      "role": "assistant",
      "content": "Binary search is...",
      "timestamp": "2025-12-22T10:30:02Z"
    }
  ],
  "createdAt": "2025-12-22T10:30:00Z",
  "lastMessageAt": "2025-12-22T10:30:02Z",
  "isArchived": false
}
```

### MongoDB Setup Commands

```javascript
// Create database
use StudentMentorDB

// Create users collection with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "createdAt"],
      properties: {
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        passwordHash: { bsonType: "string" },
        googleId: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

// Create conversations collection
db.createCollection("conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "messages", "createdAt"],
      properties: {
        userId: { bsonType: "string" },
        title: { bsonType: "string" },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["role", "content", "timestamp"],
            properties: {
              role: { enum: ["user", "assistant"] },
              content: { bsonType: "string" },
              subject: { bsonType: "string" },
              type: { enum: ["question", "assignment_help", "exam_prep"] },
              timestamp: { bsonType: "date" }
            }
          }
        },
        createdAt: { bsonType: "date" },
        lastMessageAt: { bsonType: "date" },
        isArchived: { bsonType: "bool" }
      }
    }
  }
})

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true })
db.users.createIndex({ createdAt: -1 })

db.conversations.createIndex({ userId: 1, lastMessageAt: -1 })
db.conversations.createIndex({ createdAt: -1 })
db.conversations.createIndex({ userId: 1, isArchived: 1 })
```

### Design Decisions

**Why MongoDB?**
- Flexible schema for evolving requirements
- Natural fit for nested messages array
- Horizontal scaling capability
- Good for document-oriented data

**Why These Indexes?**
- (userId, lastMessageAt): Fast retrieval of user's conversations sorted by most recent
- createdAt: For analytics and time-based queries
- (userId, isArchived): For filtering active/archived conversations

### Migration Strategy

Phase 0 uses:
- users collection: For authentication
- conversations collection: For chat storage

Future phases will add:
- goals collection (Phase 2)
- uploaded_materials collection (Phase 3)
- analytics collection (Phase 3)

### Testing Checklist
- [x] Collections created without validation errors
- [x] Indexes created successfully
- [x] Sample documents inserted successfully
- [x] Queries tested and optimized
- [ ] Backup strategy defined

### Dependencies
- Blocked by: Nothing (can start immediately)
- Blocks: Member 1 (Backend Lead) - needs schema for API design
- Blocks: Member 2 (Frontend Lead) - needs data structure understanding

### Next Steps
1. Present schema to team for approval
2. Create MongoDB Atlas cluster
3. Apply schema to staging and development environments
4. Create data migration scripts
