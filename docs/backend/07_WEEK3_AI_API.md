# Week 3 AI API Documentation

## Status: COMPLETED ✅
## Date: 2026-01-04
## Owner: Member 1 + Member 3

## AI Endpoints

### POST /api/chat/ai
Get a streaming AI response for a conversation.

**Authentication:** Required (Bearer Token)

**Body:**
```json
{
  "conversationId": "658..."
}
```

**Response:**
Server-Sent Events (SSE) stream.

**Data Format:**
- Each chunk: `data: {"content": "..."}\n\n`
- End of stream: `data: [DONE]\n\n`
- Error: `data: {"error": "..."}\n\n`

## Implementation Details

- **Model:** gpt-4o-mini
- **Streaming:** Enabled via OpenAI SDK
- **Storage:** AI responses are appended to the `messages` array in the `conversations` collection upon completion of the stream.
- **System Prompt:** "You are StudentMentor AI, a helpful and knowledgeable academic assistant. Provide clear, accurate, and encouraging help to students."

## Updated Models

### Conversation
AI messages are stored with `role: "assistant"`.

## Testing
Tested with SSE client and frontend `fetch` with `ReadableStream`.
