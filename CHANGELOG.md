# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-09-30

### Added

#### Project Setup
- Initialized Next.js 15 project with TypeScript and Tailwind CSS 4
- Configured App Router for modern Next.js architecture
- Set up ESLint for code quality
- Created clean architecture folder structure

#### Dependencies
- Installed `@anthropic-ai/sdk` for Claude AI integration
- Installed `axios` for HTTP client functionality
- Installed `zustand` for lightweight state management
- Installed `zod` for schema validation
- Installed `react-markdown` and `remark-gfm` for markdown rendering
- Installed `prismjs` for syntax highlighting
- Installed `sonner` for toast notifications
- Configured shadcn/ui with Tailwind CSS 4

#### UI Components
- Added shadcn/ui components: Button, Input, Textarea, Card, Badge, Separator, ScrollArea
- Created Toaster component for notifications
- Implemented responsive design with mobile support
- Added dark mode support throughout the application

#### Chat Interface
- Built `ChatContainer` component as main chat orchestrator
- Created `MessageBubble` component with role-based styling (user/assistant)
- Implemented `ChatInput` component with keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Added streaming message display with typing indicators
- Integrated markdown rendering in AI responses
- Added syntax highlighting for code blocks using Prism.js
- Implemented auto-scroll to latest message

#### Workflow Features
- Created `WorkflowActions` component with Copy/Insert/View buttons
- Built `WorkflowJsonViewer` component with syntax-highlighted JSON display
- Implemented workflow JSON extraction from AI responses
- Added clipboard copy functionality
- Created n8n API integration for workflow insertion
- Implemented real-time workflow validation with Zod

#### AI Integration
- Integrated Claude 3.5 Sonnet API
- Implemented streaming chat responses
- Created comprehensive system prompt for n8n workflow generation
- Added support for common n8n node types (webhook, httpRequest, slack, gmail, etc.)
- Built JSON extraction logic to parse workflows from AI responses

#### State Management
- Created Zustand store for chat state
- Implemented message history management
- Added loading and error states
- Built streaming message update mechanism

#### API Layer
- Created Next.js API route for streaming chat (`/api/chat`)
- Built n8n API client with Axios
- Implemented CRUD operations for workflows:
  - `getWorkflows()` - Fetch all workflows
  - `getWorkflow(id)` - Fetch single workflow
  - `createWorkflow()` - Create new workflow
  - `updateWorkflow()` - Update existing workflow
  - `deleteWorkflow()` - Delete workflow
- Added request/response interceptors for logging and error handling

#### Validation
- Created Zod schemas for n8n workflow validation
- Implemented node structure validation
- Added connection validation
- Built workflow validation helper functions
- Created TypeScript types for type safety

#### Infrastructure
- Set up environment variable configuration
- Created `.env.local.example` template
- Built API client with Axios for n8n integration
- Configured CORS handling
- Added error handling at all layers

#### Documentation
- Created comprehensive README.md with setup instructions
- Built detailed ARCHITECTURE.md documenting system design
- Added CHANGELOG.md for version tracking
- Included usage examples and troubleshooting guide
- Documented all available n8n nodes and features

#### Developer Experience
- Configured TypeScript strict mode
- Set up path aliases (`@/*`) for clean imports
- Added JSDoc comments to key functions
- Implemented consistent error logging
- Created reusable utility functions

### Technical Details

#### Architecture Decisions
- **Clean Architecture**: Separated concerns into layers (UI, Features, Infrastructure)
- **Streaming First**: Real-time response display for better UX
- **Type Safety**: Full TypeScript coverage with strict mode
- **Validation**: Client-side validation before API calls
- **Error Handling**: Multi-layer error handling with user feedback

#### Performance
- Implemented streaming responses for perceived performance
- Used Next.js App Router for optimal code splitting
- Added lazy loading where appropriate
- Optimized bundle size with dynamic imports

#### Security
- API keys stored server-side only
- Environment variables properly configured
- Validation before all external API calls
- No credentials in workflow JSON

### Known Limitations
- Single-turn conversations (no conversation history context)
- No workflow editing after generation
- Limited to Claude 3.5 Sonnet model
- No offline support
- Requires n8n instance to be running locally

### Future Enhancements
- [ ] Multi-turn conversation support with context
- [ ] Workflow editing and refinement
- [ ] Pre-built workflow templates library
- [ ] n8n documentation search integration
- [ ] Workflow execution monitoring
- [ ] Conversation history persistence
- [ ] Team collaboration features
- [ ] Custom node definitions
- [ ] Workflow versioning
- [ ] Export/import conversations

---

## [Unreleased]

### Planned Features
- Conversation history with database persistence
- Workflow templates gallery
- Advanced workflow editing capabilities
- Real-time collaboration
- Analytics and usage tracking
- Plugin system for extensibility

---

**Note**: This is the initial release (MVP) of the n8n Chat Assistant. Future versions will expand on these foundations with more advanced features.
