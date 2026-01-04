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
