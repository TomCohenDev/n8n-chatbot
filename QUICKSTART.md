# 🚀 Quick Start - Get Running in 5 Minutes

## Step 1: Configure Your API Keys (2 min)

Edit `.env.local` (already created) with your credentials:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_n8n_key_or_leave_empty
```

**Get Anthropic Key**: https://console.anthropic.com/

## Step 2: Start n8n (1 min)

In a **separate terminal**:

```bash
npx n8n
```

Wait for: `Editor is now accessible via: http://localhost:5678/`

## Step 3: Start the Chat App (1 min)

In **this terminal**:

```bash
npm run dev
```

Wait for: `Ready in X.XXs`

## Step 4: Open & Test (1 min)

1. Open: http://localhost:3000
2. Type: **"Create a simple webhook workflow"**
3. Click: **"Insert to n8n"**
4. Check n8n: http://localhost:5678/workflows

## 🎉 Done!

You should now see:
- ✅ Chat interface running on port 3000
- ✅ AI generating workflow JSON
- ✅ Workflow created in n8n

## 💡 Try These Next

Ask the AI:
- "Create a webhook that sends data to Slack"
- "Make a workflow that runs every hour"
- "Build an email notification workflow"

## 🐛 Issues?

### Chat not loading?
```bash
# Check if port 3000 is free
netstat -ano | findstr :3000
```

### n8n not connecting?
- Verify n8n is running: http://localhost:5678
- Check `N8N_API_URL` in `.env.local`

### AI not responding?
- Verify your `ANTHROPIC_API_KEY` is correct
- Check you have API credits

## 📚 Learn More

- **Full Setup**: See `SETUP_GUIDE.md`
- **Architecture**: See `ARCHITECTURE.md`
- **README**: See `README.md`

---

**Need help?** Check the troubleshooting sections in the other docs!
