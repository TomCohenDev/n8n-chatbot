# Start n8n Docker with CORS Enabled

## Stop your current n8n container:

```bash
docker stop n8n
```

## Start n8n with CORS enabled:

```bash
docker run -it --rm --name n8n -p 5678:5678 -e N8N_CORS_ORIGIN=http://localhost:3000 -v n8n_data:/home/node/.n8n n8nio/n8n
```

**What changed:**

- Added `-e N8N_CORS_ORIGIN=http://localhost:3000` to enable CORS

## Alternative: Allow all origins (less secure, dev only):

```bash
docker run -it --rm --name n8n -p 5678:5678 -e N8N_CORS_ORIGIN=* -v n8n_data:/home/node/.n8n n8nio/n8n
```

## Then:

1. Wait for n8n to start (you'll see "Editor is now accessible...")
2. Refresh your browser at http://localhost:3000
3. Try "Insert to n8n" again - should work!

---

**Note:** The `-e` flag passes environment variables to Docker containers.
