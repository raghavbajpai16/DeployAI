# Week 1: Sample Schema Queries

This document contains sample MongoDB queries to test the schema and perform common operations.

## User Operations

### 1. Create a User
```javascript
db.users.insertOne({
  email: "test@example.com",
  passwordHash: "$2b$10$e0MYzXy5...", // Example bcrypt hash
  firstName: "Test",
  lastName: "User",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### 2. Find User by Email
```javascript
db.users.findOne({ email: "test@example.com" });
```

### 3. Update User Profile
```javascript
db.users.updateOne(
  { email: "test@example.com" },
  { 
    $set: { 
      firstName: "UpdatedName",
      updatedAt: new Date()
    } 
  }
);
```

## Conversation Operations

### 1. Create a Conversation
```javascript
db.conversations.insertOne({
  userId: "user-uuid-123",
  title: "Getting Started with React",
  messages: [
    {
      role: "user",
      content: "How do I start a React project?",
      timestamp: new Date()
    },
    {
      role: "assistant",
      content: "You can use `npx create-next-app`...",
      timestamp: new Date()
    }
  ],
  createdAt: new Date(),
  lastMessageAt: new Date(),
  isArchived: false
});
```

### 2. Get User's Latest Conversations
```javascript
db.conversations.find({ userId: "user-uuid-123" })
  .sort({ lastMessageAt: -1 })
  .limit(10);
```

### 3. Add a Message to a Conversation
```javascript
db.conversations.updateOne(
  { userId: "user-uuid-123", title: "Getting Started with React" },
  {
    $push: {
      messages: {
        role: "user",
        content: "That sounds great!",
        timestamp: new Date()
      }
    },
    $set: { lastMessageAt: new Date() }
  }
);
```

### 4. Archive a Conversation
```javascript
db.conversations.updateOne(
  { _id: ObjectId("...") },
  { $set: { isArchived: true } }
);
```
