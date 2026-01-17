# Week 4: Subject Detection & Classification

## Status: COMPLETED ✅
## Date: 2026-01-18
## Owner: Member 1 + Member 2

## Features Implemented

### 1. AI-Powered Classification
- **Automatic Subject Detection**: Every user message is analyzed via Groq (Llama 3) to identify the academic subject.
- **Intent Classification**: Identifies if the user is asking a question, seeking an explanation, or needing assignment help.
- **Confidence Scoring**: Each classification includes a confidence score (0.0 to 1.0).

### 2. Manual Overrides
- Users can manually select a subject from the UI before sending.
- Users can "Edit" (correct) the detected subject after the message is sent.

### 3. Analytics API
- **Endpoint**: `GET /api/chat/stats`
- Returns a breakdown of subjects and intents used by the student to track learning patterns over time.

## API Specification

### PATCH /api/chat/conversations/:id/messages/:messageId
Updates the metadata (subject/intent) for a specific message.
- **Body**: `{ "subject": "New Subject", "intent": "New Intent" }`

### GET /api/chat/stats
Returns usage statistics.
- **Response**:
```json
{
  "subjects": { "Mathematics": 5, "Science": 2 },
  "intents": { "Question": 6, "Assignment Help": 1 },
  "totalMessages": 7
}
```

## Technical Implementation
- **Classifier**: `backend/src/config/classifier.ts` using Groq with structured JSON output.
- **UI**: `ChatWindow.tsx` includes a new `SUBJECTS` pills selector and hover badges on messages.
