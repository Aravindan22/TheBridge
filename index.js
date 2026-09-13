// --- 1. THE FRONTEND UI (HTML/CSS/JS) ---
const HTML_UI = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Prompt Bridge</title>
<style>
  :root { --bg: #121212; --card: #1e1e1e; --text: #e0e0e0; --accent: #007bff; --danger: #dc3545; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 20px; line-height: 1.5; }
  .container { max-width: 600px; margin: 0 auto; }
  h1 { text-align: center; margin-bottom: 20px; font-size: 1.5rem; }
  .hidden { display: none !important; }
  input, textarea, button { width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #333; background: var(--card); color: var(--text); font-size: 16px; box-sizing: border-box; }
  textarea { min-height: 100px; resize: vertical; font-family: monospace; }
  button { background: var(--accent); color: white; border: none; cursor: pointer; font-weight: bold; transition: opacity 0.2s; }
  button:hover { opacity: 0.85; }
  .btn-danger { background: var(--danger); }
  .btn-row { display: flex; gap: 10px; }
  .btn-row button { flex: 1; }
  .clip-card { background: var(--card); padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #333; }
  .clip-text { white-space: pre-wrap; word-break: break-word; background: #2a2a2a; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-family: monospace; font-size: 14px; max-height: 200px; overflow-y: auto;}
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .logout-btn { width: auto; padding: 8px 15px; font-size: 14px; margin: 0; }
  .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #28a745; color: white; padding: 10px 20px; border-radius: 20px; opacity: 0; transition: opacity 0.3s; }
  .toast.show { opacity: 1; }
</style>
</head>
<body>
<div class="container">
  <!-- LOGIN SCREEN -->
  <div id="login-screen">
    <h1>🔐 AI Prompt Bridge</h1>
    <input type="password" id="password-input" placeholder="Enter Access Password" />
    <button onclick="login()">Unlock</button>
  </div>

  <!-- MAIN APP SCREEN -->
  <div id="app-screen" class="hidden">
    <div class="header">
      <h1 style="margin:0; font-size:1.2rem;">📋 Prompt Bridge</h1>
      <button class="logout-btn btn-danger" onclick="logout()">Logout</button>
    </div>

    <h3 style="margin-top:0;">New Prompt</h3>
    <textarea id="new-clip-text" placeholder="Type or paste your AI prompt here..."></textarea>
    <button onclick="saveClip()">Save to Cloud</button>

    <h3>Saved Prompts</h3>
    <div id="clips-list">Loading...</div>
  </div>
</div>
<div id="toast" class="toast">Copied!</div>

<script>
  let TOKEN = localStorage.getItem('bridge_token');
  if (TOKEN) showApp();

  async function login() {
    const pwd = document.getElementById('password-input').value;
    if(!pwd) return alert('Enter password');
    TOKEN = pwd;
    localStorage.setItem('bridge_token', TOKEN);
    // Test token
    const res = await fetch('/api/clips', { headers: { 'X-Auth': TOKEN } });
    if(res.ok) showApp();
    else { alert('Wrong password'); TOKEN = null; localStorage.removeItem('bridge_token'); }
  }

  function logout() {
    TOKEN = null;
    localStorage.removeItem('bridge_token');
    location.reload();
  }

  function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    loadClips();
  }

  async function loadClips() {
    const res = await fetch('/api/clips', { headers: { 'X-Auth': TOKEN } });
    const clips = await res.json();
    const list = document.getElementById('clips-list');
    if (clips.length === 0) { list.innerHTML = '<p style="text-align:center; color:#666;">No saved prompts yet.</p>'; return; }
    
    list.innerHTML = clips.map(c => \`
      <div class="clip-card">
        <div class="clip-text" id="text-\${c.id}">\${escapeHtml(c.text)}</div>
        <div class="btn-row">
          <button onclick="copyText('\${c.id}')">📋 Copy</button>
          <button class="btn-danger" onclick="deleteClip('\${c.id}')">🗑️ Delete</button>
        </div>
      </div>
    \`).join('');
  }

  async function saveClip() {
    const text = document.getElementById('new-clip-text').value;
    if(!text.trim()) return;
    await fetch('/api/clips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN },
      body: JSON.stringify({ text })
    });
    document.getElementById('new-clip-text').value = '';
    loadClips();
  }

  async function deleteClip(id) {
    if(!confirm('Delete this prompt?')) return;
    await fetch('/api/clips/' + id, { method: 'DELETE', headers: { 'X-Auth': TOKEN } });
    loadClips();
  }

  function copyText(id) {
    const text = document.getElementById('text-' + id).innerText;
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
</script>
</body>
</html>`;

// --- 2. THE BACKEND API ---
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Serve the Frontend UI
    if (path === '/' && request.method === 'GET') {
      return new Response(HTML_UI, { headers: { 'Content-Type': 'text/html' } });
    }

    // 2. Authentication Check for API routes
    const token = request.headers.get('X-Auth');
    if (token !== env.ADMIN_PASSWORD) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 3. API: Get all clips
    if (path === '/api/clips' && request.method === 'GET') {
      const list = await env.CLIP_KV.list({ prefix: 'clip_' });
      const clips = [];
      for (const key of list.keys) {
        const text = await env.CLIP_KV.get(key.name);
        clips.push({ id: key.name, text: text });
      }
      // Sort newest first
      clips.sort((a, b) => b.id.localeCompare(a.id));
      return Response.json(clips);
    }

    // 4. API: Save a new clip
    if (path === '/api/clips' && request.method === 'POST') {
      const { text } = await request.json();
      if (!text) return new Response('Text required', { status: 400 });
      
      const id = `clip_${Date.now()}`;
      await env.CLIP_KV.put(id, text);
      return Response.json({ success: true, id });
    }

    // 5. API: Delete a clip
    if (path.startsWith('/api/clips/') && request.method === 'DELETE') {
      const id = path.split('/').pop();
      await env.CLIP_KV.delete(id);
      return Response.json({ success: true });
    }

    return new Response('Not Found', { status: 404 });
  },
};
