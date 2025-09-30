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
- n8n instance running (default: `http://localhost:5678`)
- Anthropic API key

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

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   N8N_API_URL=http://localhost:5678/api/v1
   N8N_API_KEY=your_n8n_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
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

Built with **Clean Architecture** principles:

```
src/
├── app/                    # Next.js App Router
│   ├── api/chat/          # Streaming chat API route
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat interface components
│   └── workflow/         # Workflow display components
├── features/             # Feature modules
│   ├── chat/
│   │   ├── api/         # Chat API client
│   │   ├── store/       # Zustand state management
│   │   └── types/       # TypeScript types
│   └── workflow/
│       ├── api/         # n8n API client
│       ├── validation/  # Zod schemas
│       └── types/       # TypeScript types
└── lib/                  # Shared utilities
    ├── api-client.ts    # Axios configuration
    ├── claude.ts        # Claude SDK wrapper
    ├── prompts.ts       # AI system prompts
    └── constants.ts     # App constants
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: Prism.js

### Backend
- **Runtime**: Next.js API Routes
- **AI**: Anthropic Claude API
- **HTTP Client**: Axios
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
- API keys are kept server-side only
- n8n credentials are referenced, never included in workflow JSON
- All workflow JSON is validated before insertion

## 🐛 Troubleshooting

### "Failed to connect to n8n"
- Ensure n8n is running on the configured URL
- Check your `N8N_API_KEY` is correct
- Verify CORS settings in n8n if needed

### "Invalid workflow JSON"
- The AI sometimes generates incomplete workflows
- Try rephrasing your request
- Check the View JSON to see validation errors

### Streaming not working
- Ensure your Anthropic API key is valid
- Check browser console for errors
- Verify the API route is accessible

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
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 💬 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Claude AI, and n8n