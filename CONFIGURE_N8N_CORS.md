# Configure n8n CORS for Workflow Insertion

## Problem

The "Insert to n8n" feature is failing with CORS error because n8n's REST API doesn't allow requests from `http://localhost:3000`.

## Solution

Since you're using a remote n8n instance (`https://n8n.yarden-zamir.com`), you need to configure CORS on that server.

### Option 1: Configure via n8n Environment Variables

Add this environment variable to your n8n instance:

```bash
N8N_CORS_ORIGIN=http://localhost:3000
```

**How to set it depends on how you're running n8n:**

#### If using Docker:

```yaml
# docker-compose.yml
services:
  n8n:
    environment:
      - N8N_CORS_ORIGIN=http://localhost:3000
```

#### If using npm/system service:

Create/edit `.n8n/.env`:

```env
N8N_CORS_ORIGIN=http://localhost:3000
```

#### If running directly:

```bash
N8N_CORS_ORIGIN=http://localhost:3000 n8n start
```

### Option 2: Allow All Origins (Less Secure - Dev Only)

```bash
N8N_CORS_ORIGIN=*
```

### After Configuration

1. **Restart n8n** for changes to take effect
2. **Refresh your browser** at `http://localhost:3000`
3. **Try "Insert to n8n"** again - should work now!

---

## Alternative: Use n8n Webhook (Already Working)

Note: The **webhook for chat** (`NEXT_PUBLIC_N8N_WEBHOOK_URL`) already works fine. This CORS issue only affects the **REST API** used for inserting workflows.

If you can't configure CORS, you could:

- Manually copy the JSON and paste into n8n
- Or create an n8n workflow that accepts workflow JSON via webhook and creates it

But the easiest solution is just enabling CORS on your n8n instance.
