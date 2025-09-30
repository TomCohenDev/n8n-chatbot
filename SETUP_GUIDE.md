# Setup Guide - n8n Chat Assistant

This guide will help you get the n8n Chat Assistant up and running.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **n8n** instance running locally or remotely
- **Anthropic API key** ([Get one here](https://console.anthropic.com/))

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 15
- React 19
- Anthropic SDK
- Axios, Zustand, Zod
- shadcn/ui components
- Markdown and syntax highlighting libraries

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   # Get your API key from: https://console.anthropic.com/
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   
   # Your n8n instance URL (default for local)
   N8N_API_URL=http://localhost:5678/api/v1
   
   # n8n API key (optional, create in n8n settings)
   N8N_API_KEY=your_n8n_api_key
   ```

### Getting n8n API Key

1. Open n8n in your browser (usually `http://localhost:5678`)
2. Go to **Settings** → **API**
3. Click **Create API Key**
4. Copy the key and paste it in `.env.local`

**Note**: If n8n doesn't require authentication, you can leave `N8N_API_KEY` empty.

## Step 3: Start n8n (if not already running)

If you don't have n8n running:

```bash
# Using npx (easiest)
npx n8n

# Or if installed globally
n8n start
```

n8n will start on `http://localhost:5678` by default.

## Step 4: Start the Chat Assistant

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Step 5: Test the Application

1. Open `http://localhost:3000` in your browser
2. Try asking: **"Create a simple webhook workflow"**
3. The AI will generate n8n workflow JSON
4. Click **"Insert to n8n"** to create the workflow in your n8n instance
5. Check n8n to see the newly created workflow!

## Common Issues & Solutions

### Issue: "Failed to connect to n8n"

**Solutions:**
- Ensure n8n is running on the configured URL
- Check that `N8N_API_URL` in `.env.local` is correct
- Verify your n8n API key is valid
- Check if n8n requires authentication

### Issue: "Anthropic API error"

**Solutions:**
- Verify your `ANTHROPIC_API_KEY` is correct
- Check you have API credits remaining
- Ensure the key starts with `sk-ant-api03-`

### Issue: "Invalid workflow JSON"

**Solutions:**
- The AI sometimes generates incomplete workflows
- Try rephrasing your request more specifically
- Click "View JSON" to see what was generated
- Copy and manually fix the JSON if needed

### Issue: "Port 3000 already in use"

**Solution:**
Run on a different port:
```bash
PORT=3001 npm run dev
```

### Issue: CORS errors when calling n8n

**Solution:**
Add CORS configuration to n8n. In your n8n `.env` file:
```
N8N_CORS_ORIGIN=http://localhost:3000
```

## Development

### Running Linter

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm run start
```

### Project Structure

```
src/
├── app/                    # Next.js pages and API routes
│   ├── api/chat/          # Streaming chat endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat interface
│   └── workflow/         # Workflow components
├── features/             # Feature modules
│   ├── chat/            # Chat logic
│   └── workflow/        # Workflow logic
└── lib/                  # Utilities and config
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key | `sk-ant-api03-xxxxx` |
| `N8N_API_URL` | Yes | n8n API base URL | `http://localhost:5678/api/v1` |
| `N8N_API_KEY` | No* | n8n API authentication key | `n8n_api_xxxxx` |

*Required only if your n8n instance requires API authentication

## Usage Tips

### Best Prompts

**Good prompts:**
- "Create a webhook that receives POST data and sends it to Slack"
- "Make a workflow that fetches data from an API every hour"
- "Build a workflow to process form submissions and save to a database"

**Less effective prompts:**
- "Make a workflow"
- "n8n"
- Single word requests

### Understanding Results

When the AI generates a workflow:
- **Copy JSON**: Copy the workflow to clipboard
- **Insert to n8n**: Automatically create in n8n
- **View JSON**: Expand to see the full JSON

The workflow will include:
- Nodes (the building blocks)
- Connections (how data flows)
- Parameters (node configuration)

## Next Steps

1. Read the [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the codebase
2. Check [CHANGELOG.md](./CHANGELOG.md) for version history
3. Explore the code and customize to your needs
4. Create your first workflow!

## Support

- **Issues**: Open an issue on GitHub
- **n8n Docs**: https://docs.n8n.io/
- **Anthropic Docs**: https://docs.anthropic.com/

## Security Best Practices

1. **Never commit `.env.local`** - it's already in `.gitignore`
2. **Keep API keys secret** - don't share them
3. **Use environment variables** for all sensitive data
4. **Review generated workflows** before inserting to n8n
5. **Don't include credentials** in workflow parameters

---

**Ready to build amazing n8n workflows with AI! 🚀**
