# Refactoring Summary: n8n Webhook Backend

## ✅ Refactoring Complete!

The application has been successfully refactored to use n8n as the backend instead of direct Claude API integration.

## 🔄 What Changed

### Removed Files

- ❌ `src/lib/claude.ts` - Direct Claude SDK integration
- ❌ `src/lib/prompts.ts` - AI system prompts
- ❌ `src/app/api/chat/route.ts` - Next.js API route
- ❌ `@anthropic-ai/sdk` npm package

### Added Files

- ✅ `n8n-workflow.json` - Complete n8n workflow (import this!)
- ✅ `N8N_BACKEND.md` - Comprehensive integration guide
- ✅ `REFACTORING_SUMMARY.md` - This file

### Modified Files

- 🔧 `src/lib/constants.ts` - Added `N8N_WEBHOOK_URL`, removed `ANTHROPIC_API_KEY`
- 🔧 `src/lib/utils.ts` - Added `extractWorkflowJson()` function
- 🔧 `src/features/chat/api/index.ts` - Now calls n8n webhook instead of `/api/chat`
- 🔧 `src/components/chat/message-bubble.tsx` - Import from `utils` instead of `claude`
- 🔧 `.env.local.example` - Added `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- 🔧 `.env.local` - Added webhook URL configuration
- 🔧 `README.md` - Updated setup instructions
- 🔧 `ARCHITECTURE.md` - Updated architecture diagrams
- 🔧 `CHANGELOG.md` - Documented all changes

## 🚀 Next Steps to Get Running

### 1. Import the n8n Workflow

```bash
# In n8n web interface (http://localhost:5678):
1. Go to Workflows
2. Click "Import from File"
3. Select n8n-workflow.json
4. Workflow will be imported
```

### 2. Configure Claude API in n8n

```bash
# In n8n:
1. Go to Credentials
2. Add new "Anthropic API" credential
3. Enter your Anthropic API key
4. Save
5. In the workflow, assign this credential to "Call Claude API" node
```

### 3. Activate the Workflow

```bash
# In n8n:
1. Open the imported workflow
2. Click the "Active" toggle (top right)
3. Workflow is now live
```

### 4. Get the Webhook URL

```bash
# In n8n:
1. Click the "Webhook" node in the workflow
2. Copy the "Production Webhook URL"
   Example: http://localhost:5678/webhook/905cacc5-0de7-4197-91d3-00bcdc522298
```

### 5. Update Environment Variables

Edit `.env.local`:

```env
# n8n Configuration
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_n8n_api_key_here

# n8n Webhook URL (IMPORTANT - must start with NEXT_PUBLIC_)
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/YOUR_WEBHOOK_ID_HERE
```

### 6. Start the App

```bash
npm run dev
```

### 7. Test It!

1. Open http://localhost:3000
2. Send a message: "Create a simple webhook workflow"
3. The request goes to n8n → n8n calls Claude → Response comes back

## 🏗️ New Architecture

```
┌──────────────────────┐
│  User Browser        │
│  http://localhost:3000│
└──────────┬───────────┘
           │
           │ POST message
           ▼
┌──────────────────────────────┐
│  Next.js Frontend (Static)   │
│  - UI Components             │
│  - State Management          │
│  - Workflow Validation       │
└──────────┬───────────────────┘
           │
           │ HTTP POST
           │ to N8N_WEBHOOK_URL
           ▼
┌──────────────────────────────┐
│  n8n Workflow                │
│  - Webhook Trigger           │
│  - Extract Request Data      │
│  - Call Claude API           │
│  - Format Response           │
│  - Return to Frontend        │
└──────────────────────────────┘
           │
           │ Anthropic API Call
           ▼
┌──────────────────────────────┐
│  Claude AI (Anthropic)       │
└──────────────────────────────┘
```

## ✨ Benefits

### 1. **No Backend in Next.js**

- Next.js is now purely a static frontend
- Can be deployed to any static hosting (Vercel, Netlify, S3, etc.)
- No server-side runtime needed

### 2. **Flexible AI Logic**

- Change AI behavior by editing the n8n workflow
- No need to redeploy the frontend
- Visual workflow editor makes changes easy

### 3. **Security**

- Anthropic API key only stored in n8n
- Not exposed to Next.js environment
- Webhook can be secured with additional authentication

### 4. **Reusability**

- Same n8n workflow can serve multiple apps
- Mobile app, web app, CLI - all use same backend
- Consistent AI behavior across platforms

### 5. **Easy Testing**

- Test the n8n workflow independently
- View execution history in n8n
- Debug requests and responses visually

## 📊 Before vs After

| Aspect               | Before (0.1.0)        | After (0.2.0)                |
| -------------------- | --------------------- | ---------------------------- |
| **Architecture**     | Next.js Full-Stack    | Next.js Static + n8n Backend |
| **AI Integration**   | Direct Claude SDK     | n8n Workflow                 |
| **API Key Location** | Next.js .env          | n8n Credentials              |
| **Backend Routes**   | `/api/chat`           | None (webhook only)          |
| **System Prompts**   | `src/lib/prompts.ts`  | n8n Workflow                 |
| **Deployment**       | Needs Node.js runtime | Can be static                |
| **Customization**    | Requires redeploy     | Edit n8n workflow            |

## 🔍 Key File Changes

### `src/lib/constants.ts`

```typescript
// REMOVED:
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// ADDED:
export const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  "http://localhost:5678/webhook/...";
```

### `src/features/chat/api/index.ts`

```typescript
// BEFORE:
const response = await fetch("/api/chat", { ... });

// AFTER:
const response = await fetch(N8N_WEBHOOK_URL, { ... });
```

### `src/lib/utils.ts`

````typescript
// ADDED:
export function extractWorkflowJson(text: string): string | null {
  const jsonBlockRegex = /```json\s*([\s\S]*?)```/;
  const match = text.match(jsonBlockRegex);
  return match && match[1] ? match[1].trim() : null;
}
````

## 🧪 Testing the Integration

### Test 1: Webhook Connectivity

```bash
curl -X POST http://localhost:5678/webhook/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Expected: JSON response with AI-generated text

### Test 2: Frontend to Backend

1. Start n8n: `npx n8n`
2. Activate workflow
3. Start frontend: `npm run dev`
4. Open http://localhost:3000
5. Send message
6. Check n8n execution history

### Test 3: Workflow Insertion

1. Ask AI: "Create a simple webhook workflow"
2. AI generates JSON
3. Click "Insert to n8n"
4. Check n8n for new workflow

## 📚 Documentation Updates

All documentation has been updated:

- ✅ README.md - New setup instructions
- ✅ ARCHITECTURE.md - Updated data flow
- ✅ N8N_BACKEND.md - NEW comprehensive guide
- ✅ CHANGELOG.md - Version 0.2.0 documented
- ✅ .env.local.example - New environment variables

## ⚠️ Important Notes

### Environment Variable Naming

- **MUST** use `NEXT_PUBLIC_` prefix for webhook URL
- This makes it available to client-side code
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` is accessible in browser

### CORS Configuration

The n8n webhook node MUST allow your frontend origin:

```
Allowed Origins: http://localhost:3000
```

### n8n Must Be Running

The app will not work without:

1. n8n running
2. Workflow imported
3. Workflow active
4. Webhook URL configured

## 🎉 Success Criteria

You know the refactoring is working when:

- ✅ No linter errors (`npm run lint` passes)
- ✅ Frontend sends requests to n8n webhook
- ✅ n8n workflow executes successfully
- ✅ AI responses appear in the chat
- ✅ Workflow insertion still works
- ✅ No direct Anthropic SDK calls from Next.js

## 🆘 Troubleshooting

### "Failed to fetch" error

- Check n8n is running
- Verify workflow is active
- Confirm webhook URL in `.env.local` is correct

### CORS error

- Add `http://localhost:3000` to webhook's allowed origins
- Restart n8n workflow

### AI not responding

- Check Anthropic credentials in n8n
- View n8n execution history for errors
- Verify you have API credits

### Workflow insertion still fails

- This uses n8n REST API (separate from webhook)
- Check `N8N_API_URL` and `N8N_API_KEY`

## 📖 Learn More

- Read `N8N_BACKEND.md` for full backend documentation
- Review `ARCHITECTURE.md` for system design
- Check n8n execution history to debug requests

---

**Refactoring completed successfully! Version 0.2.0 is ready to use with n8n as the backend.**
