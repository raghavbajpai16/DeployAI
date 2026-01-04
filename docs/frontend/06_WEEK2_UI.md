# Week 2 Frontend UI Documentation

## Status: COMPLETED ✅
## Date: 2026-01-03
## Owner: Member 2

## Pages Structure

### / (Landing Page)
- Hero section with sign-in/sign-up CTA
- Features overview
- Gradient background

**Route:** `app/page.tsx`
**Props:** None
**Navigation:** → /login or /register

### /login (Login Page)
- Email + password form
- Form validation
- Error handling
- Link to /register

**Route:** `app/(auth)/login/page.tsx`
**Protected:** No (redirects to /chat if already authenticated)
**Navigation:** → /chat on success or /register

### /register (Register Page)
- Email + password + name form
- Form validation
- Error handling
- Link to /login

**Route:** `app/(auth)/register/page.tsx`
**Protected:** No (redirects to /chat if already authenticated)
**Navigation:** → /chat on success or /login

### /chat (Chat Page)
- Chat window component
- Conversations sidebar
- User header with logout
- Requires authentication

**Route:** `app/chat/page.tsx`
**Protected:** YES (redirects to /login if no token)
**Navigation:** → /login on logout

## Components

### AuthForm
Location: `components/AuthForm.tsx`
- Reusable for login/register
- Form validation
- Loading state
- Error messages
- Props: `type` ('login' | 'register'), `onSuccess` callback

### ChatWindow
Location: `components/ChatWindow.tsx`
- Message display
- Message input
- Auto-scroll to bottom
- Loading spinner
- Props: `token`, optional `conversationId`

## API Integration

All calls through `lib/api.ts`:
```typescript
const response = await apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

## State Management
- **localStorage**: accessToken, user
- **useState**: Form inputs, messages, loading
- **useEffect**: Auth checks, data loading
- **useRouter**: Navigation

## Styling
- **Tailwind CSS**
- **Mobile responsive**
- **Light & dark combinations**
- **Smooth transitions**

## Key Files
```
app/layout.tsx          - Global metadata
app/page.tsx            - Landing page
app/(auth)/login/       - Login flow
app/(auth)/register/    - Register flow
app/chat/page.tsx       - Chat page
components/AuthForm.tsx - Auth component
components/ChatWindow.  - Chat UI
lib/api.ts              - API utilities
```

## Testing Locally
1. `npm run dev` → http://localhost:3000
2. Click "Sign Up" → fill form → submit
3. Should redirect to /chat
4. Type message → send
5. Message appears in UI instantly

## Next Steps (Week 3)
- Integrate OpenAI for AI responses
- Add subject selector
- Improve UI/UX
- Add conversation switching

## Blocking Issues
None. Frontend ready for Week 3 integration.
