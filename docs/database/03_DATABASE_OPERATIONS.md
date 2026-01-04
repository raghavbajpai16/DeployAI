# Week 1: Database Operations & Scripts
## Status: COMPLETED
## Date: 2025-12-27
## Completed By: Member 3 (Full-Stack Developer/Antigravity)

### MongoDB Initialization Script

Location: `scripts/mongodb-init.js`

```javascript
// Initialize StudentMentorDB with collections and indexes
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
          description: "Bcrypt hashed password"
        },
        googleId: {
          bsonType: "string",
          description: "Google OAuth ID (optional)"
        },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Create conversations collection
db.createCollection("conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "messages", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
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
              type: { enum: ["question", "assignment_help", "exam_prep"] },
              timestamp: { bsonType: "date" }
            }
          }
        },
        summary: { bsonType: "string" },
        keyTopics: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        createdAt: { bsonType: "date" },
        lastMessageAt: { bsonType: "date" },
        isArchived: { bsonType: "bool" }
      }
    }
  }
});

// Create indexes for users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: -1 });

// Create indexes for conversations
db.conversations.createIndex({ userId: 1, lastMessageAt: -1 });
db.conversations.createIndex({ createdAt: -1 });
db.conversations.createIndex({ userId: 1, isArchived: 1 });

print("✓ Database initialized successfully");
print("✓ Collections created: users, conversations");
print("✓ Indexes created");
```

### Database Seeding Script

Location: `scripts/seed-db.js`

```javascript
// Seed database with test data

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/StudentMentorDB';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('StudentMentorDB');

    console.log('🌱 Seeding database...');

    // Create test user
    const hashedPassword = await bcrypt.hash('test@123', 10);
    
    const usersCollection = db.collection('users');
    const userResult = await usersCollection.insertOne({
      email: 'test@example.com',
      passwordHash: hashedPassword,
      googleId: null,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✓ Test user created:', userResult.insertedId);

    // Create test conversation
    const conversationsCollection = db.collection('conversations');
    const convResult = await conversationsCollection.insertOne({
      userId: userResult.insertedId.toString(),
      title: 'Sample DSA Question',
      messages: [
        {
          messageId: 'msg-1',
          role: 'user',
          content: 'Explain binary search',
          subject: 'DSA',
          type: 'question',
          timestamp: new Date()
        },
        {
          messageId: 'msg-2',
          role: 'assistant',
          content: 'Binary search is an efficient algorithm...',
          subject: 'DSA',
          type: 'question',
          timestamp: new Date()
        }
      ],
      summary: 'Discussion about binary search algorithm',
      keyTopics: ['binary search', 'searching algorithms'],
      createdAt: new Date(),
      lastMessageAt: new Date(),
      isArchived: false
    });

    console.log('✓ Test conversation created:', convResult.insertedId);
    console.log('✓ Database seeding complete!');

  } catch (error) {
    console.error('✗ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
```

### Backup Script

Location: `scripts/backup.sh`

```bash
#!/bin/bash

# Database backup script

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/studentmentor_$TIMESTAMP.archive"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get MongoDB connection string from environment
MONGO_URI="${MONGODB_URI:-mongodb://admin:password@localhost:27017/StudentMentorDB}"

echo "📦 Starting backup..."

# Use mongodump to backup
mongodump --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

if [ $? -eq 0 ]; then
  echo "✓ Backup successful: $BACKUP_FILE"
  echo "✓ Size: $(du -h $BACKUP_FILE | cut -f1)"
else
  echo "✗ Backup failed!"
  exit 1
fi
```

### Database Operations Commands

**View Database Size**:
```bash
mongosh "mongodb://admin:password@localhost:27017" --eval "db.stats()"
```

**View All Collections**:
```bash
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.getCollectionNames()"
```

**View User Count**:
```bash
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.users.countDocuments()"
```

**View Indexes**:
```bash
mongosh "mongodb://admin:password@localhost:27017/StudentMentorDB" --eval "db.users.getIndexes()"
```

### Dependencies
- Blocked by: Task 1.1 (Schema Design)
- Blocks: Member 1 (Backend) - needs initialization scripts
- Blocks: All members - need clean development environment

### Testing Checklist
- [ ] MongoDB initialization script runs without errors
- [ ] Collections created with correct validation
- [ ] Indexes created successfully
- [ ] Seeding script inserts test data correctly
- [ ] Backup script creates valid backup files
- [ ] Test data can be queried successfully
