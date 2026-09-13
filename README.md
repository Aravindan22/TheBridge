# 🔐 Prompt Bridge

A private, cross-device clipboard and chat-thread manager for AI prompts, built on **Cloudflare Workers**.

Designed for situations where you can't access certain things on one device but can on another. Type a text on your **phone**, fetch it on your **work laptop**, paste it into the AI, and push the result back — all without installing any apps.

---

## ✨ Features

- **Chat Threads** — Organize prompts and AI results into threaded conversations
- **Web UI** — Beautiful dark-themed, mobile-friendly interface (Blue / Green / White)
- **CLI API** — Terminal-friendly endpoints at `/cli` for `curl` workflows
- **Zero Install** — Works in any browser, no app needed
- **Password Protected** — Single secret password via environment variable
- **Instant Sync** — No page reloads, real-time UI updates
- **Copy & Share** — One-tap copy and native share sheet on mobile
- **No Build Step** — Pure vanilla JS, deploys directly from GitHub

---

## 📁 Project Structure

```
├── index.js          # Entire app (backend API + frontend UI)
├── wrangler.toml     # Cloudflare Worker configuration
├── agents.md         # AI coding assistant context file
└── README.md         # This file
```

---

## 🚀 Deployment (No Terminal Required)

You can deploy this entire project from your **phone** using just GitHub and the Cloudflare Dashboard.

### Step 1: Create KV Database

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages → KV**
3. Tap **Create a namespace**, name it `CLIP_KV`
4. Copy the **Namespace ID**

### Step 2: Create GitHub Repository

1. Create a new repo on GitHub (e.g., `ai-prompt-bridge`)
2. Create these files directly in GitHub:

**`wrangler.toml`**
```toml
name = "ai-prompt-bridge"
main = "index.js"
compatibility_date = "2026-09-01"

[[kv_namespaces]]
binding = "CLIP_KV"
id = "PASTE_YOUR_KV_ID_HERE"
```

**`index.js`** — Paste the full source code from this repo.

### Step 3: Connect to Cloudflare

1. In Cloudflare Dashboard, go to **Workers & Pages → Create**
2. Select **Workers → Connect to Git**
3. Authorize GitHub and select your repository
4. Leave **Build Command** blank
5. Tap **Deploy**

### Step 4: Set Password

1. Go to your deployed Worker → **Settings → Variables and Secrets**
2. Add a new variable:
   - **Type:** Secret
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** Your chosen password
3. Tap **Deploy**

---

## 🌐 Web UI Usage

Open your Worker URL (e.g., `https://ai-prompt-bridge.your-subdomain.workers.dev`) in any browser.

1. **Login** with your password
2. Tap **+ New Chat Thread** to start a conversation
3. Type your AI prompt → Tap **📤 Send Prompt** (blue bubble)
4. After getting the AI answer, paste it → Tap **🤖 Add AI Result** (green bubble)
5. Use **📋 Copy** or **📤 Share** on any message
6. Tap **🔄** to refresh across devices

---

## 💻 CLI Usage

All CLI endpoints return **plain text**, making them perfect for terminal piping.

Set your variables for convenience:
```bash
URL="https://ai-prompt-bridge.your-subdomain.workers.dev"
AUTH="X-Auth: YOUR_PASSWORD"
```

### List recent chats & see help
```bash
curl -H "$AUTH" $URL/cli
```

### Get the latest prompt (typed on your phone)
```bash
curl -H "$AUTH" "$URL/cli/latest?role=user"
```

### Get the latest AI result
```bash
curl -H "$AUTH" "$URL/cli/latest?role=ai"
```

### Create a new chat with a prompt
```bash
curl -X POST -H "$AUTH" -d "Explain quantum computing" "$URL/cli"
```
*Returns: `Success! Chat ID: 1726234567890`*

### Append an AI result to a specific chat
```bash
curl -X POST -H "$AUTH" -d "Quantum computing is..." "$URL/cli?chat=1726234567890&role=ai"
```

### View full chat thread
```bash
curl -H "$AUTH" "$URL/cli/chat/1726234567890"
```

### Pipe a file directly to your phone
```bash
cat ai-response.txt | curl -X POST -H "$AUTH" --data-binary @- "$URL/cli?role=ai"
```

---

## 🔄 Typical Workflow

```
┌──────────────┐                          ┌──────────────┐
│   📱 Phone   │                          │  💻 Work Mac  │
│              │                          │              │
│ 1. Open URL  │                          │              │
│ 2. Login     │                          │              │
│ 3. Type      │──── Cloudflare KV ──────▶│ 4. curl      │
│    prompt    │                          │    /cli/latest│
│ 4. Send      │                          │ 5. Copy into │
│              │                          │    Grok/Qwen  │
│              │                          │ 6. curl POST  │
│ 7. See AI ◀──┼──── Cloudflare KV ───────│    AI result  │
│    result    │                          │              │
└──────────────┘                          └──────────────┘
```

---

## ⚙️ Environment Variables

| Variable | Type | Description |
|---|---|---|
| `ADMIN_PASSWORD` | Secret | Password to access the web UI and CLI |

---

## 🔒 Security Notes

- The password is stored as a **Cloudflare Secret** (encrypted at rest)
- All API requests require the `X-Auth` header
- The KV database stores all chats in a single JSON key — suitable for personal/light use
- For production use, consider adding rate limiting

---

## 📝 License

MIT — Use it however you want.
