# n8n Backend Integration

## Overview

This application uses an **n8n workflow as its backend**. All AI operations and business logic are handled by n8n, not by Next.js API routes.

## Architecture Flow

```
┌──────────────┐
│   User Input │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  React UI        │
│  (ChatContainer) │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────────┐
│  sendMessage()                  │
│  POST to n8n webhook            │
│  NEXT_PUBLIC_N8N_WEBHOOK_URL    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  n8n Workflow Processing:       │
│  1. Receive webhook request     │
│  2. Extract message data        │
│  3. Call Claude API             │
│  4. Format response             │
│  5. Return to frontend          │
└──────┬──────────────────────────┘
       │
       ▼
┌──────────────────┐
│  Response Stream │
│  (or JSON)       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  UI updates with │
│  streaming chunks│
└──────────────────┘
```

## n8n Workflow Setup

### 1. Import the Workflow

1. Open n8n in your browser (`http://localhost:5678`)
2. Go to **Workflows** → **Import from File**
3. Select `n8n-workflow.json` from this repository
4. The workflow will be imported with all nodes configured

### 2. Configure Claude API Credentials

1. In n8n, go to **Credentials** → **Add Credential**
2. Select **Anthropic API**
3. Enter your Anthropic API key
4. Save the credential
5. In the workflow, update the **Call Claude API** node to use your credential

### 3. Activate the Workflow

1. Open the imported workflow
2. Click **Active** toggle in the top right
3. The webhook will now be live

### 4. Get the Webhook URL

1. Click on the **Webhook** node
2. Copy the **Test URL** or **Production URL**
3. Update your `.env.local`:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/YOUR_WEBHOOK_ID
   ```

## Workflow Nodes Explained

### 1. Webhook Node

- **Type**: `n8n-nodes-base.webhook`
- **Purpose**: Receives POST requests from the frontend
- **Configuration**:
  - Path: Auto-generated webhook ID
  - Method: POST
  - CORS: Allows `http://localhost:3000`

### 2. Extract Input Node

- **Type**: `n8n-nodes-base.set`
- **Purpose**: Extracts and validates request data
- **Outputs**:
  - `message` - User's message
  - `conversationHistory` - Previous messages (optional)

### 3. Call Claude API Node

- **Type**: `n8n-nodes-base.anthropic`
- **Purpose**: Sends message to Claude API
- **Configuration**:
  - Model: `claude-3-5-sonnet-20241022`
  - Max Tokens: 4096
  - System Prompt: n8n workflow assistant instructions

### 4. Respond to Webhook Node

- **Type**: `n8n-nodes-base.respondToWebhook`
- **Purpose**: Returns response to frontend
- **Output**: JSON with `response` and optional `workflowJson`

## Request/Response Format

### Request (from Frontend)

```json
{
  "message": "Create a webhook workflow",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

### Response (from n8n)

````json
{
  "response": "Here's a webhook workflow...\n\n```json\n{...}\n```",
  "workflowJson": null
}
````

## Advantages of n8n Backend

### ✅ Benefits

1. **No Vendor Lock-in**: Claude API key only in n8n, not in Next.js
2. **Flexible Logic**: Easy to modify AI behavior without redeploying frontend
3. **Visual Workflow**: See and edit the entire backend flow visually
4. **Easy Testing**: Test the workflow in n8n before using in the app
5. **Reusable**: Same workflow can be used by other applications
6. **No Server Needed**: Next.js is purely static, can be deployed to CDN
7. **Centralized Config**: All AI prompts and logic in one place (n8n)

### 🎯 Use Cases

This pattern is ideal for:

- Rapid prototyping
- Low-code/no-code development
- Separating frontend and backend teams
- Multi-app backends (same n8n workflow for web, mobile, etc.)
- Easy A/B testing of different AI prompts

## Customizing the Workflow

### Change AI Model

1. Open the workflow in n8n
2. Click **Call Claude API** node
3. Change `model` parameter
4. Options: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`, etc.

### Modify System Prompt

1. Open the workflow
2. Click **Call Claude API** node
3. Edit the `systemPrompt` parameter
4. Save and test

### Add Preprocessing

Add nodes between **Extract Input** and **Call Claude API**:

- **Code node**: Custom JavaScript logic
- **IF node**: Conditional branching
- **Set node**: Data transformation

### Add Postprocessing

Add nodes between **Call Claude API** and **Respond to Webhook**:

- **Code node**: Parse and format response
- **HTTP Request**: Call other APIs
- **Set node**: Add metadata

## Streaming Support

The current workflow returns JSON, not streaming responses. To enable streaming:

### Option 1: Server-Sent Events

Modify the **Respond to Webhook** node to use streaming mode (requires n8n 1.0+).

### Option 2: Polling

Instead of streaming, the frontend can poll for updates.

### Option 3: WebSocket

Use n8n's WebSocket trigger for real-time bidirectional communication.

## Error Handling

The workflow should handle errors gracefully:

```javascript
// Add an error branch
try {
  // Call Claude API
} catch (error) {
  return {
    response: "Sorry, I encountered an error processing your request.",
    error: error.message,
  };
}
```

## Security Considerations

### ✅ Best Practices

1. **API Key in n8n**: Claude API key stored only in n8n credentials
2. **CORS Configuration**: Webhook only allows requests from your frontend domain
3. **Rate Limiting**: Add rate limiting in n8n to prevent abuse
4. **Input Validation**: Validate user input in the **Extract Input** node
5. **Authentication** (Optional): Add API key authentication to the webhook

### Example: Add Authentication

1. Add a **Set** node after **Webhook**
2. Check for `Authorization` header
3. If invalid, return 401 error

## Monitoring & Debugging

### View Execution History

1. In n8n, go to **Executions**
2. See all webhook calls, inputs, and outputs
3. Debug failures by inspecting each node's data

### Enable Logging

Add **Code** nodes to log data at each step:

```javascript
console.log("Input:", $input.all());
return $input.all();
```

## Production Deployment

### n8n Deployment

- **Self-hosted**: Deploy n8n on your own server
- **n8n Cloud**: Use managed n8n hosting
- **Docker**: Run n8n in a container

### Environment Variables

Update for production:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/YOUR_ID
N8N_API_URL=https://your-n8n-domain.com/api/v1
```

### SSL/HTTPS

Ensure n8n is served over HTTPS in production for security.

## Troubleshooting

### Webhook Not Responding

1. Check workflow is **Active**
2. Verify webhook URL is correct
3. Check n8n execution history for errors
4. Test webhook with Postman/curl

### CORS Errors

1. In webhook node, add your frontend URL to allowed origins
2. Example: `http://localhost:3000,https://your-app.com`

### Claude API Errors

1. Check your Anthropic API key in n8n credentials
2. Verify you have API credits
3. Check rate limits

## Next Steps

1. **Import the workflow**: Use `n8n-workflow.json`
2. **Configure credentials**: Add your Anthropic API key
3. **Activate workflow**: Turn it on in n8n
4. **Update .env.local**: Add the webhook URL
5. **Test**: Send a message from the frontend

---

**This architecture keeps your Next.js app lean and puts all backend logic in n8n, making it easy to modify and extend without redeploying the frontend.**
