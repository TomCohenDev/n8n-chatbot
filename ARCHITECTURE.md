# Architecture Documentation

## Overview

The n8n Chat Assistant follows **Clean Architecture** principles, separating concerns into distinct layers with clear dependencies.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User Interface                      │
│              (Next.js App Router)                    │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────┐
│              Components Layer                        │
│  - Chat Components (MessageBubble, ChatInput)       │
│  - Workflow Components (Actions, JSON Viewer)       │
│  - UI Components (shadcn/ui)                        │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────┐
│              Features Layer                          │
│  - Chat (State, API, Types)                         │
│  - Workflow (Validation, API, Types)                │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────┐
│              Infrastructure Layer                    │
│  - API Clients (Axios, Claude SDK)                  │
│  - External APIs (n8n, Anthropic)                   │
└─────────────────────────────────────────────────────┘
```

## Folder Structure

### `/src/app` - Application Layer
Next.js App Router pages and API routes.

- `page.tsx` - Main chat interface page
- `layout.tsx` - Root layout with global providers
- `api/chat/route.ts` - Streaming chat API endpoint

**Responsibility**: Entry points for the application, routing, and API endpoints.

### `/src/components` - Presentation Layer
React components for UI rendering.

#### `/src/components/ui`
shadcn/ui components (auto-generated):
- `button.tsx`, `input.tsx`, `card.tsx`, etc.
- Reusable, accessible UI primitives

#### `/src/components/chat`
Chat-specific components:
- `chat-container.tsx` - Main chat interface orchestrator
- `message-bubble.tsx` - Individual message display
- `chat-input.tsx` - Message input field

#### `/src/components/workflow`
Workflow-related components:
- `workflow-actions.tsx` - Copy/Insert/View buttons
- `workflow-json-viewer.tsx` - Syntax-highlighted JSON viewer

**Responsibility**: Pure presentational components, no business logic.

### `/src/features` - Domain Layer
Feature-specific business logic organized by domain.

#### `/src/features/chat`
Chat domain logic:

**`/api`**
- `index.ts` - Client-side API functions for sending messages

**`/store`**
- `index.ts` - Zustand store for chat state
  - Messages array
  - Loading states
  - Error handling
  - Message mutations

**`/types`**
- `index.ts` - TypeScript interfaces
  - `Message` - Chat message structure
  - `ChatState` - Store state shape
  - `ParsedWorkflow` - Extracted workflow data

#### `/src/features/workflow`
Workflow domain logic:

**`/api`**
- `index.ts` - n8n API client functions
  - `getWorkflows()` - Fetch all workflows
  - `getWorkflow(id)` - Fetch single workflow
  - `createWorkflow(workflow)` - Create new workflow
  - `updateWorkflow(id, data)` - Update workflow
  - `deleteWorkflow(id)` - Delete workflow

**`/validation`**
- `schema.ts` - Zod validation schemas
  - `n8nNodeSchema` - Node structure validation
  - `n8nWorkflowSchema` - Full workflow validation
  - `validateWorkflow()` - Validation helper

**`/types`**
- `index.ts` - TypeScript interfaces
  - `N8nNode` - Node structure
  - `N8nWorkflow` - Workflow structure
  - `N8nWorkflowResponse` - API response types

**Responsibility**: Domain-specific business logic, validation, and state management.

### `/src/lib` - Infrastructure Layer
Shared utilities and external service integrations.

- `api-client.ts` - Configured Axios instance for n8n API
- `claude.ts` - Claude SDK wrapper and streaming utilities
- `prompts.ts` - AI system prompts
- `constants.ts` - Application constants
- `utils.ts` - Shared utilities (from shadcn/ui)

**Responsibility**: Low-level utilities, SDK wrappers, and configuration.

## Data Flow

### Chat Message Flow

```
User Input
    ↓
ChatInput Component
    ↓
ChatContainer (event handler)
    ↓
useChatStore.addMessage() ← Add user message
    ↓
sendMessage() API call ← /src/features/chat/api
    ↓
POST /api/chat ← Next.js API route
    ↓
streamChat() ← Claude API
    ↓
Stream chunks back ← Server-Sent Events
    ↓
useChatStore.updateLastMessage() ← Update AI message
    ↓
MessageBubble re-renders ← Show streaming response
```

### Workflow Insertion Flow

```
AI generates workflow JSON
    ↓
extractWorkflowJson() ← Parse from response
    ↓
WorkflowActions component ← Display buttons
    ↓
User clicks "Insert to n8n"
    ↓
validateWorkflow() ← Zod validation
    ↓
createWorkflow() API call ← /src/features/workflow/api
    ↓
POST to n8n API ← Axios client
    ↓
Success/Error toast ← User feedback
```

## State Management

### Zustand Store (`useChatStore`)

**State:**
```typescript
{
  messages: Message[],
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
- `addMessage(message)` - Add a new message
- `updateLastMessage(content)` - Append to last message (streaming)
- `setLoading(isLoading)` - Toggle loading state
- `setError(error)` - Set error message
- `clearMessages()` - Clear all messages

**Why Zustand?**
- Lightweight (no context providers needed)
- Simple API
- Good TypeScript support
- Perfect for this use case

## API Routes

### `POST /api/chat`

**Request:**
```json
{
  "message": "Create a webhook workflow"
}
```

**Response:**
Streaming plain text response (chunks of AI-generated text)

**Flow:**
1. Validate request
2. Call Claude API with system prompt
3. Stream response chunks
4. Return as ReadableStream

## External APIs

### n8n REST API

**Base URL:** `http://localhost:5678/api/v1`

**Endpoints Used:**
- `GET /workflows` - List all workflows
- `GET /workflows/:id` - Get single workflow
- `POST /workflows` - Create new workflow
- `PATCH /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow

**Authentication:**
- Header: `X-N8N-API-KEY`

### Anthropic Claude API

**Model:** `claude-3-5-sonnet-20241022`

**Features Used:**
- Message streaming
- System prompts
- Text generation

**Configuration:**
- Max tokens: 4096
- Streaming: Enabled

## Validation Strategy

### Client-Side Validation
- Zod schemas validate workflow structure
- Prevents invalid data from reaching n8n
- Provides user-friendly error messages

**Validated Fields:**
- Node IDs (non-empty strings)
- Node types (valid n8n node types)
- Positions (tuple of numbers)
- Connections (valid node references)

### Server-Side Validation
- Next.js API routes validate requests
- Type checking with TypeScript
- Runtime validation with Zod

## Error Handling

### Layers of Error Handling

1. **Component Level**
   - Try-catch around API calls
   - Display errors in UI with toasts
   - Graceful degradation

2. **API Client Level**
   - Axios interceptors log errors
   - Transform error messages
   - Retry logic (future enhancement)

3. **API Route Level**
   - Validate input
   - Catch exceptions
   - Return appropriate HTTP status codes

4. **Store Level**
   - Error state management
   - Error message display
   - Recovery actions

## Performance Considerations

### Optimizations
- **Code Splitting**: Next.js automatic code splitting
- **Streaming**: Real-time response display
- **Lazy Loading**: Components loaded as needed
- **Memoization**: React components memoized where beneficial

### Future Optimizations
- Implement conversation history pagination
- Add message virtualization for long chats
- Cache workflow templates
- Optimize syntax highlighter bundle size

## Security

### API Keys
- Stored in environment variables
- Never exposed to client
- Server-side only

### Validation
- All workflow JSON validated before insertion
- Zod schemas enforce type safety
- Prevents malformed data

### CORS
- Next.js API routes handle CORS
- n8n API requires proper configuration

## Testing Strategy (Future)

### Unit Tests
- Utility functions
- Validation schemas
- Store actions

### Integration Tests
- API routes
- Component interactions
- API client functions

### E2E Tests
- Full chat flow
- Workflow insertion
- Error scenarios

## Deployment

### Environment Variables Required
```env
ANTHROPIC_API_KEY=xxx
N8N_API_URL=xxx
N8N_API_KEY=xxx
```

### Build Process
```bash
npm run build
npm run start
```

### Hosting Options
- Vercel (recommended)
- Docker container
- Traditional Node.js server

## Future Architecture Enhancements

1. **Conversation History**
   - Persist chats to database
   - Multi-turn context awareness

2. **Caching Layer**
   - Cache workflow templates
   - Cache n8n node documentation

3. **WebSocket Support**
   - Real-time collaboration
   - Live workflow updates

4. **Plugin System**
   - Custom node definitions
   - Extensible AI prompts

---

This architecture provides:
- ✅ Separation of concerns
- ✅ Testability
- ✅ Maintainability
- ✅ Scalability
- ✅ Type safety
