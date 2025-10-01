# n8n Chat Assistant

An AI-powered standalone web application that helps you create n8n workflows through natural conversation. Built with Next.js 14, Claude AI, and shadcn/ui.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🌟 Features

- **AI-Powered Workflow Generation**: Chat with Claude AI to generate n8n workflow JSON
- **Real-time Streaming**: See responses as they're generated
- **Workflow Actions**: Copy, view, and directly insert workflows into n8n
- **Syntax Highlighting**: Beautiful code highlighting with Prism.js
- **Markdown Support**: Rich text formatting in chat messages
- **Validation**: Automatic workflow JSON validation before insertion
- **Modern UI**: Clean, responsive interface built with shadcn/ui
- **Dark Mode**: Full dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- n8n instance running with the chat workflow imported (default: `http://localhost:5678`)
- Anthropic API key (configured in n8n, not in this app)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd n8n-chatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Import the n8n workflow**

   ```bash
   # In n8n web interface:
   # 1. Go to Workflows → Import from File
   # 2. Select n8n-workflow.json
   # 3. Add your Anthropic API credentials
   # 4. Activate the workflow
   # 5. Copy the webhook URL
   ```

4. **Configure environment variables**

   Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your configuration:

   ```env
   N8N_API_URL=http://localhost:5678/api/v1
   N8N_API_KEY=your_n8n_api_key_here
   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/YOUR_WEBHOOK_ID
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating Workflows

Simply type a request in natural language:

**Examples:**

- "Create a webhook that receives data and sends it to Slack"
- "Make a workflow that processes JSON data and saves it to a database"
- "Build a workflow to send emails via Gmail when a form is submitted"

### Workflow Actions

When the AI generates a workflow, you'll see action buttons:

- **Copy JSON**: Copy the workflow JSON to clipboard
- **Insert to n8n**: Automatically create the workflow in your n8n instance
- **View JSON**: Expand/collapse the JSON code view

### Supported n8n Nodes

The AI understands common n8n nodes including:

- Triggers: `webhook`, `schedule`, `manual`
- Actions: `httpRequest`, `slack`, `gmail`, `set`, `code`
- Logic: `if`, `switch`, `filter`, `merge`
- And many more!

## 🏗️ Architecture

Built with **Clean Architecture** principles and **n8n as the backend**:

```
┌─────────────────────────────┐
│   Next.js Frontend (UI)     │
│   - React Components        │
│   - State Management        │
│   - Workflow Validation     │
└──────────┬──────────────────┘
           │
           │ HTTP POST
           ▼
┌─────────────────────────────┐
│   n8n Workflow (Backend)    │
│   - Receives webhook calls  │
│   - Calls Claude API        │
│   - Returns AI responses    │
└─────────────────────────────┘
```

**Key Feature**: No backend API routes in Next.js. All AI processing happens in n8n!

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [N8N_BACKEND.md](./N8N_BACKEND.md) for detailed documentation.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: Prism.js

### Backend

- **Backend**: n8n workflow (handles all AI logic)
- **AI**: Anthropic Claude API (called from n8n)
- **HTTP Client**: Axios (n8n REST via Next.js proxy)
- **Proxy**: Next.js API route `/api/n8n-proxy` (avoids CORS)
- **Validation**: Zod

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔒 Security Notes

- **Never commit** `.env.local` - it's in `.gitignore`
- Anthropic API key is stored only in n8n (not in Next.js)
- Webhook URL is public but can be secured with API key authentication
- n8n credentials are referenced, never included in workflow JSON
- All workflow JSON is validated before insertion to n8n

## 🐛 Troubleshooting

### "Failed to connect to n8n webhook"

- Ensure n8n workflow is **Active**
- Check the webhook URL in `.env.local` matches n8n
- Verify CORS settings in the webhook node allow `http://localhost:3000`
- Test the webhook directly with Postman/curl

### "Failed to connect to n8n API"

- Ensure n8n is running on the configured URL
- Check your `N8N_API_KEY` is correct
- Frontend now uses `/api/n8n-proxy` to avoid browser CORS

### "Invalid workflow JSON"

- The AI sometimes generates incomplete workflows
- Try rephrasing your request
- Check the View JSON to see validation errors
- Review the n8n workflow execution history

### AI not responding

- Check the n8n workflow is active
- Verify Anthropic API credentials in n8n
- Review n8n execution history for errors
- Ensure you have Anthropic API credits remaining

## 🔐 Environment Variables

```env
# Local n8n for inserting workflows
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_local_n8n_api_key

# Remote n8n webhook for chat backend
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-remote-n8n/webhook/ID
```

## 🔀 n8n Proxy (CORS-free)

- Endpoint: `/api/n8n-proxy`
- Forwards POST to `${N8N_API_URL}/workflows` with `X-N8N-API-KEY`
- Sanitizes workflow body to include only supported fields (name, settings, active, nodes, connections)

## 🚧 Roadmap

- [ ] Multi-turn conversations with context
- [ ] Workflow editing and refinement
- [ ] Pre-built workflow templates
- [ ] n8n documentation search integration
- [ ] Workflow execution and monitoring
- [ ] Team collaboration features

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Webhook Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Anthropic Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.anthropic/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 💬 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Claude AI, and n8n
