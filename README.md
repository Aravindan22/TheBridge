# 🔐 Prompt Bridge

A private, cross-device clipboard and chat-thread manager for AI prompts, built on **Cloudflare Workers**.

Designed for situations where you can't access certain things on one device but can on another. Type a text on your **phone**, fetch it on your **work laptop**, paste it into the AI, and push the result back — all without installing any apps.

---

## ✨ Features

- **Chat Threads** — Organize prompts and AI results into threaded conversations
- **Web UI** — Matte black & white themed, mobile-friendly interface (Greyscale / Monochrome)
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

## 💻 CLI & REST API Reference

Prompt Bridge offers two complementary interfaces for terminal users, automation scripts, and command-line workflows:
- **CLI Endpoints (`/cli*`)**: Return lightweight **plain text** (`text/plain; charset=utf-8`), engineered for seamless terminal piping (`curl`, `cat`, `pbcopy`, `xargs`) without requiring JSON parsing tools like `jq`.
- **REST API Endpoints (`/api*`)**: Accept and return structured **JSON** (`application/json`), providing full programmatic CRUD capabilities over chats and individual messages.

---

### 1. Overview & Authentication

All API and CLI requests require authentication via the `X-Auth` header matching your configured `ADMIN_PASSWORD`.

Set these environment variables in your terminal session for convenience:

```bash
URL="https://ai-prompt-bridge.your-subdomain.workers.dev"
AUTH="X-Auth: YOUR_PASSWORD"
```

| Interface | Path Prefix | Content-Type | Use Case |
|---|---|---|---|
| **CLI Endpoints** | `/cli`, `/cli/latest`, `/cli/chat/:id` | `text/plain` | Direct terminal viewing, piping to clipboard, shell scripts |
| **REST API** | `/api/chats`, `/api/chats/:id/messages` | `application/json` | Programmatic automation, webhooks, fine-grained CRUD control |

> **Authentication Failure:** If `X-Auth` is omitted or incorrect, endpoints return HTTP `401 Unauthorized` (`Unauthorized. Use -H "X-Auth: YOUR_PASSWORD"`).

---

### 2. CREATE (C)

#### A. Create a New Chat Thread with an Initial Prompt

- **CLI (`POST /cli`)** — Submit prompt text directly in the request body. A new chat thread ID (Unix timestamp in milliseconds) is created automatically:
  ```bash
  curl -s -X POST -H "$AUTH" \
    -d "Explain quantum computing in simple terms" \
    "$URL/cli"
  ```
  *Response (Plain Text, HTTP 201):*
  ```text
  Success! Chat ID: 1726234567890
  ```

- **REST API (`POST /api/chats`)** — Create an empty chat thread with a specific numeric ID:
  ```bash
  CHAT_ID=$(date +%s%3N)
  curl -s -X POST -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d "{\"id\": \"$CHAT_ID\"}" \
    "$URL/api/chats"
  ```
  *Response (JSON, HTTP 200):*
  ```json
  {"success": true}
  ```

#### B. Append a Prompt or AI Result to an Existing Chat

- **CLI (`POST /cli?chat=<id>&role=<user|ai>`)** — Append a follow-up user prompt or AI response to an existing thread. Parameter `role` defaults to `user` if omitted:
  ```bash
  # Append user follow-up prompt:
  curl -s -X POST -H "$AUTH" \
    -d "Can you provide a simple analogy?" \
    "$URL/cli?chat=1726234567890&role=user"

  # Append AI result:
  curl -s -X POST -H "$AUTH" \
    -d "Think of qubits as spinning coins showing heads and tails simultaneously." \
    "$URL/cli?chat=1726234567890&role=ai"
  ```
  *Response (Plain Text, HTTP 201):*
  ```text
  Success! Chat ID: 1726234567890
  ```

- **REST API (`POST /api/chats/<id>/messages`)** — Append a message object with custom message `id`, `role`, and `text`:
  ```bash
  MSG_ID="msg_$(date +%s%3N)_$(head /dev/urandom | tr -dc a-z0-9 | head -c 9)"
  curl -s -X POST -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d "{\"id\": \"$MSG_ID\", \"role\": \"ai\", \"text\": \"Qubits enable exponential computational parallelism.\"}" \
    "$URL/api/chats/1726234567890/messages"
  ```
  *Response (JSON, HTTP 200):*
  ```json
  {"success": true}
  ```

#### C. Piping Files or Standard Input (stdin)

Pipe files, git diffs, or clipboard contents directly into Prompt Bridge using `--data-binary @-`:

```bash
# Pipe AI response file to an existing chat:
cat ai-response.txt | curl -s -X POST -H "$AUTH" --data-binary @- "$URL/cli?chat=1726234567890&role=ai"

# Pipe git diff as a new prompt:
git diff HEAD~1 | curl -s -X POST -H "$AUTH" --data-binary @- "$URL/cli"

# Pipe clipboard content directly (macOS pbpaste):
pbpaste | curl -s -X POST -H "$AUTH" --data-binary @- "$URL/cli?role=ai"
```

---

### 3. READ (R)

#### A. List Recent Chats or All Chats

- **CLI (`GET /cli`)** — Displays the 5 most recent chat threads and their initial prompt preview, followed by a quick command reference:
  ```bash
  curl -s -H "$AUTH" "$URL/cli"
  ```
  *Sample Response (Plain Text):*
  ```text
  === Prompt Bridge CLI ===

  Recent Chats:
  - [1726234567890] Explain quantum computing in simple term
  - [1726234400123] Review this rust code for memory safet

  --- Commands ---
  POST /cli             : Create new chat (Body = prompt text)
  POST /cli?chat=ID     : Append to chat (Body = text)
  GET  /cli/latest      : Get latest message text
  GET  /cli/latest?role=user|ai : Filter by role
  GET  /cli/chat/ID     : Get full chat text
  ```

- **REST API (`GET /api/chats`)** — Returns the full database of all chat threads, timestamps, and messages:
  ```bash
  curl -s -H "$AUTH" "$URL/api/chats"
  ```
  *Sample Response (JSON):*
  ```json
  {
    "1726234567890": {
      "messages": [
        {
          "id": "msg_1726234567890_abc123456",
          "role": "user",
          "text": "Explain quantum computing in simple terms",
          "timestamp": 1726234567890
        },
        {
          "id": "msg_1726234578123_xyz987654",
          "role": "ai",
          "text": "Think of qubits as spinning coins showing heads and tails simultaneously.",
          "timestamp": 1726234578123
        }
      ]
    }
  }
  ```

#### B. Read Full Chat Conversation History

- **CLI (`GET /cli/chat/<id>`)** — Returns a formatted, plain text transcript of the entire thread with labeled prompt and AI response blocks:
  ```bash
  curl -s -H "$AUTH" "$URL/cli/chat/1726234567890"
  ```
  *Sample Response (Plain Text):*
  ```text
  === Chat 1726234567890 ===

  [PROMPT]:
  Explain quantum computing in simple terms

  ---

  [AI RESULT]:
  Think of qubits as spinning coins showing heads and tails simultaneously.

  ---
  ```

#### C. Fetch Latest Prompt or AI Result

- **CLI (`GET /cli/latest`)** — Retrieves the raw text of the most recent message across all threads. Use the `role` query parameter to filter by author:
  ```bash
  # Get latest message (user prompt or AI result):
  curl -s -H "$AUTH" "$URL/cli/latest"

  # Get latest prompt created on mobile to paste into your local terminal/AI tool:
  curl -s -H "$AUTH" "$URL/cli/latest?role=user"

  # Get latest AI result to review:
  curl -s -H "$AUTH" "$URL/cli/latest?role=ai"

  # Copy latest prompt directly to macOS clipboard:
  curl -s -H "$AUTH" "$URL/cli/latest?role=user" | pbcopy
  ```

---

### 4. UPDATE (U)

#### Update / Edit Existing Message Text

- **REST API (`PUT /api/chats/<chatId>/messages/<msgId>`)** — Edit the text of an existing message in a chat thread without changing its role or timestamp:
  ```bash
  curl -s -X PUT -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d '{"text": "Quantum computers leverage superposition, entanglement, and interference to solve specific problems exponentially faster."}' \
    "$URL/api/chats/1726234567890/messages/msg_1726234578123_xyz987654"
  ```
  *Response (JSON, HTTP 200):*
  ```json
  {"success": true}
  ```
  *(Returns HTTP `404 Chat not found` or `404 Message not found` if target identifiers do not exist)*

---

### 5. DELETE (D)

#### A. Delete a Specific Message

- **REST API (`DELETE /api/chats/<chatId>/messages/<msgId>`)** — Remove an individual message from a conversation thread:
  ```bash
  curl -s -X DELETE -H "$AUTH" \
    "$URL/api/chats/1726234567890/messages/msg_1726234578123_xyz987654"
  ```
  *Response (JSON, HTTP 200):*
  ```json
  {"success": true}
  ```
  *(Returns HTTP `404 Chat not found` if the chat ID is not found)*

#### B. Delete an Entire Chat Thread

- **REST API (`DELETE /api/chats/<chatId>`)** — Permanently remove a chat thread and all associated messages from the database:
  ```bash
  curl -s -X DELETE -H "$AUTH" \
    "$URL/api/chats/1726234567890"
  ```
  *Response (JSON, HTTP 200):*
  ```json
  {"success": true}
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
