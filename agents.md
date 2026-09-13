# AI Prompt Bridge - Project Context

## Overview
A private, cross-device clipboard and chat-thread manager for AI prompts. 
Allows users to save prompts on one device (e.g., mobile) and retrieve them along with AI results on another (e.g., work laptop).

## Tech Stack
- **Runtime:** Cloudflare Workers (Edge JavaScript)
- **Database:** Cloudflare KV (Key-Value store)
- **Frontend:** Vanilla HTML/CSS/JS (Embedded in Worker)
- **Build:** None. Direct deployment via GitHub integration.

## Architecture
- **Single File App:** The entire frontend and backend lives in `index.js`.
- **Database Strategy:** Uses a single KV key (`database`) storing a JSON object of all chats. This minimizes KV read/write operations and ensures instant UI updates.
- **Authentication:** Handled via a simple `X-Auth` header matched against the `ADMIN_PASSWORD` environment variable.

## Coding Conventions
- Use modern ES6+ JavaScript.
- Keep frontend state in a global `state` object and re-render views dynamically without page reloads.
- CSS uses CSS variables for theming (Dark theme with Blue/Green/White accents).

## Deployment
Deployed automatically via Cloudflare Dashboard GitHub integration. No build steps required.
