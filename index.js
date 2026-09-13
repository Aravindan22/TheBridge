// --- 1. THE FRONTEND UI (HTML/CSS/JS) ---
const HTML_UI = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Prompt Bridge</title>
<!-- Your custom SVG favicon goes here -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌉</text></svg>">
<style>
  :root {
    --bg-dark: #0B1120; --bg-card: #1E293B; --bg-input: #0F172A;
    --blue: #2563EB; --blue-light: #3B82F6;
    --green: #4ADE80; --green-dark: #064E3B;
    --white: #F8FAFC; --muted: #94A3B8; --danger: #EF4444;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-dark); color: var(--white); height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
  
  .header { background: var(--bg-card); padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; flex-shrink: 0; }
  .header h1 { font-size: 1.2rem; font-weight: 600; }
  .icon-btn { background: transparent; border: none; color: var(--white); font-size: 1.5rem; cursor: pointer; padding: 5px; }
  .icon-btn:active { opacity: 0.5; }

  .view { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .hidden { display: none !important; }

  .list-container { flex: 1; overflow-y: auto; padding: 15px; }
  .chat-card { background: var(--bg-card); padding: 15px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #334155; cursor: pointer; transition: transform 0.1s; }
  .chat-card:active { transform: scale(0.98); }
  .chat-title { font-weight: 600; margin-bottom: 5px; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-preview { font-size: 0.9rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-meta { font-size: 0.75rem; color: var(--muted); margin-top: 8px; display: flex; justify-content: space-between; }

  .messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
  .bubble { max-width: 85%; padding: 12px 15px; border-radius: 18px; position: relative; word-wrap: break-word; white-space: pre-wrap; font-size: 0.95rem; line-height: 1.4; }
  .bubble-user { background: var(--blue); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
  .bubble-ai { background: var(--green); color: var(--green-dark); align-self: flex-start; border-bottom-left-radius: 4px; font-weight: 500; }
  .bubble-actions { display: flex; gap: 10px; margin-top: 8px; font-size: 0.8rem; opacity: 0.8; flex-wrap: wrap; }
  .bubble-actions span { cursor: pointer; }
  .bubble-actions span:active { opacity: 0.5; }

  .input-area { background: var(--bg-card); padding: 15px; border-top: 1px solid #334155; flex-shrink: 0; }
  .input-row { display: flex; gap: 10px; margin-bottom: 10px; }
  textarea { flex: 1; background: var(--bg-input); border: 1px solid #334155; color: var(--white); padding: 12px; border-radius: 12px; font-size: 1rem; resize: none; height: 60px; font-family: inherit; }
  textarea:focus { outline: none; border-color: var(--blue-light); }
  .btn { padding: 12px 16px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; font-size: 0.9rem; white-space: nowrap; }
  .btn-blue { background: var(--blue); color: white; }
  .btn-green { background: var(--green); color: var(--green-dark); }
  .btn-danger { background: var(--danger); color: white; }
  .btn:active { opacity: 0.7; }

  .login-screen { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px; }
  .login-screen input { background: var(--bg-input); border: 1px solid #334155; color: var(--white); padding: 15px; border-radius: 12px; font-size: 1rem; margin-bottom: 15px; }

  .toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--bg-card); color: var(--white); border: 1px solid var(--green); padding: 10px 20px; border-radius: 20px; opacity: 0; transition: opacity 0.3s; pointer-events: none; font-size: 0.9rem;}
  .toast.show { opacity: 1; }
  
  .empty-state { text-align: center; color: var(--muted); margin-top: 50px; }
</style>
</head>
<body>

<div id="login-view" class="view">
  <div class="login-screen">
    <h1 style="text-align:center; margin-bottom:30px; color:var(--green);">🔐 Prompt Bridge</h1>
    <input type="password" id="pwd-input" placeholder="Enter Password" />
    <button class="btn btn-blue" style="width:100%" onclick="login()">Unlock</button>
  </div>
</div>

<div id="list-view" class="view hidden">
  <div class="header">
    <h1>💬 Chats</h1>
    <div>
      <button class="icon-btn" onclick="refreshData()" title="Refresh">🔄</button>
      <button class="icon-btn" onclick="logout()" title="Logout" style="color:var(--danger)">⎋</button>
    </div>
  </div>
  <div class="list-container" id="chat-list"></div>
  <div style="padding:15px; flex-shrink:0;">
    <button class="btn btn-green" style="width:100%; padding:15px;" onclick="createNewChat()">+ New Chat Thread</button>
  </div>
</div>

<div id="chat-view" class="view hidden">
  <div class="header">
    <button class="icon-btn" onclick="showListView()">←</button>
    <h1 id="chat-title">Chat</h1>
    <button class="icon-btn" onclick="deleteCurrentChat()" style="color:var(--danger)">🗑️</button>
  </div>
  <div class="messages" id="messages-container"></div>
  <div class="input-area">
    <textarea id="msg-input" placeholder="Type prompt or AI result..."></textarea>
    <div class="input-row">
      <button class="btn btn-blue" style="flex:1" onclick="addMessage('user')">📤 Send Prompt</button>
      <button class="btn btn-green" style="flex:1" onclick="addMessage('ai')">🤖 Add AI Result</button>
    </div>
  </div>
</div>

<div id="toast" class="toast">Copied!</div>

<script>
  let TOKEN = localStorage.getItem('bridge_token');
  let state = { chats: {}, currentChatId: null };

  if (TOKEN) checkAuth();

  async function checkAuth() {
    const res = await fetch('/api/chats', { headers: { 'X-Auth': TOKEN } });
    if (res.ok) {
      state.chats = await res.json();
      showListView();
    } else {
      TOKEN = null;
      localStorage.removeItem('bridge_token');
      document.getElementById('login-view').classList.remove('hidden');
    }
  }

  async function login() {
    TOKEN = document.getElementById('pwd-input').value;
    if(!TOKEN) return;
    localStorage.setItem('bridge_token', TOKEN);
    await checkAuth();
  }

  function logout() { TOKEN = null; localStorage.removeItem('bridge_token'); location.reload(); }
  
  function showListView() {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('chat-view').classList.add('hidden');
    document.getElementById('list-view').classList.remove('hidden');
    renderList();
  }
  
  function showChatView(id) {
    state.currentChatId = id;
    document.getElementById('list-view').classList.add('hidden');
    document.getElementById('chat-view').classList.remove('hidden');
    renderChat();
  }
  
  async function refreshData() {
    const res = await fetch('/api/chats', { headers: { 'X-Auth': TOKEN } });
    if(res.ok) { 
      state.chats = await res.json(); 
      if(state.currentChatId) renderChat(); 
      else renderList(); 
      showToast('Refreshed!'); 
    }
  }

  function renderList() {
    const container = document.getElementById('chat-list');
    const chatIds = Object.keys(state.chats).sort((a,b) => b - a);
    if (chatIds.length === 0) { 
      container.innerHTML = '<div class="empty-state">No chats yet. Create one to start!</div>'; 
      return; 
    }
    container.innerHTML = chatIds.map(id => {
      const chat = state.chats[id]; 
      const msgs = chat.messages;
      const title = msgs.find(m => m.role === 'user')?.text || 'New Chat';
      const preview = msgs[msgs.length - 1]?.text || '';
      const date = new Date(parseInt(id)).toLocaleString();
      return \`<div class="chat-card" onclick="showChatView('\${id}')"><div class="chat-title">\${escapeHtml(title.substring(0, 50))}</div><div class="chat-preview">\${escapeHtml(preview.substring(0, 80))}</div><div class="chat-meta"><span>\${msgs.length} messages</span><span>\${date}</span></div></div>\`;
    }).join('');
  }

  function renderChat() {
    const chat = state.chats[state.currentChatId];
    if (!chat) return showListView();
    const container = document.getElementById('messages-container');
    document.getElementById('chat-title').innerText = 'Thread';
    if (chat.messages.length === 0) { 
      container.innerHTML = '<div class="empty-state">Send a prompt to start!</div>'; 
      return; 
    }
    // FIXED: Removed accidental backslashes before backticks and \${}
    container.innerHTML = chat.messages.map((msg) => \`<div class="bubble bubble-\${msg.role}">\${escapeHtml(msg.text)}<div class="bubble-actions"><span onclick="copyText('\${msg.id}')">📋 Copy</span><span onclick="shareText('\${msg.id}')">📤 Share</span><span onclick="editMessage('\${msg.id}')">✏️ Edit</span><span onclick="deleteMessage('\${msg.id}')">🗑️ Delete</span></div></div>\`).join('');
    container.scrollTop = container.scrollHeight;
  }

  async function createNewChat() {
    const id = Date.now().toString();
    state.chats[id] = { messages: [] };
    await fetch('/api/chats', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN }, body: JSON.stringify({ id }) });
    showChatView(id);
  }

  async function addMessage(role) {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (!text) return;
    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    state.chats[state.currentChatId].messages.push({ id: msgId, role, text });
    input.value = '';
    renderChat();
    await fetch(\`/api/chats/\${state.currentChatId}/messages\`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN }, body: JSON.stringify({ id: msgId, role, text }) });
  }

  async function editMessage(msgId) {
    const chat = state.chats[state.currentChatId];
    const msg = chat.messages.find(m => m.id === msgId);
    if (!msg) return;
    
    const newText = prompt('Edit message:', msg.text);
    if (newText === null || newText.trim() === '') return;
    
    msg.text = newText.trim();
    renderChat();
    
    await fetch(\`/api/chats/\${state.currentChatId}/messages/\${msgId}\`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN }, 
      body: JSON.stringify({ text: newText.trim() }) 
    });
    showToast('Message updated!');
  }

  async function deleteMessage(msgId) {
    if (!confirm('Delete this message?')) return;
    
    const chat = state.chats[state.currentChatId];
    chat.messages = chat.messages.filter(m => m.id !== msgId);
    renderChat();
    
    await fetch(\`/api/chats/\${state.currentChatId}/messages/\${msgId}\`, { 
      method: 'DELETE', 
      headers: { 'X-Auth': TOKEN } 
    });
    showToast('Message deleted!');
  }

  async function deleteCurrentChat() {
    if (!confirm('Delete this entire chat thread?')) return;
    await fetch(\`/api/chats/\${state.currentChatId}\`, { method: 'DELETE', headers: { 'X-Auth': TOKEN } });
    delete state.chats[state.currentChatId];
    showListView();
  }

  function copyText(msgId) { 
    const msg = state.chats[state.currentChatId].messages.find(m => m.id === msgId);
    if (msg) { navigator.clipboard.writeText(msg.text); showToast('Copied!'); }
  }
  
  function shareText(msgId) {
    const msg = state.chats[state.currentChatId].messages.find(m => m.id === msgId);
    if (!msg) return;
    if (navigator.share) navigator.share({ title: 'AI Prompt', text: msg.text });
    else { navigator.clipboard.writeText(msg.text); showToast('Copied for sharing!'); }
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

// --- 2. CLI HANDLER ---
async function handleCLI(request, env, url) {
  const path = url.pathname;
  const params = url.searchParams;
  const textPlain = { 'Content-Type': 'text/plain; charset=utf-8' };

  const getDB = async () => (await env.CLIP_KV.get('database', 'json')) || { chats: {} };
  const saveDB = async (data) => await env.CLIP_KV.put('database', JSON.stringify(data));

  if (path === '/cli' && request.method === 'GET') {
    const db = await getDB();
    const chatIds = Object.keys(db.chats).sort((a,b) => b - a);
    let output = "=== Prompt Bridge CLI ===\n\n";
    
    if (chatIds.length === 0) {
      output += "No chats found. Create one by POSTing text to /cli\n";
    } else {
      output += "Recent Chats:\n";
      chatIds.slice(0, 5).forEach(id => {
        const chat = db.chats[id];
        const firstMsg = chat.messages.find(m => m.role === 'user')?.text || 'Empty';
        output += \`- [\${id}] \${firstMsg.substring(0, 40).replace(/\\n/g, ' ')}\\n\`;
      });
    }
    
    output += "\n--- Commands ---\n";
    output += "POST /cli             : Create new chat (Body = prompt text)\n";
    output += "POST /cli?chat=ID     : Append to chat (Body = text)\n";
    output += "GET  /cli/latest      : Get latest message text\n";
    output += "GET  /cli/latest?role=user|ai : Filter by role\n";
    output += "GET  /cli/chat/ID     : Get full chat text\n";
    
    return new Response(output, { headers: textPlain });
  }

  if (path === '/cli' && request.method === 'POST') {
    const text = await request.text();
    if (!text.trim()) return new Response('Error: Empty body', { status: 400, headers: textPlain });
    
    const role = params.get('role') || 'user';
    const chatId = params.get('chat');
    const db = await getDB();

    let targetId = chatId;
    if (!targetId || !db.chats[targetId]) {
      targetId = Date.now().toString();
      db.chats[targetId] = { messages: [] };
    }

    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    db.chats[targetId].messages.push({ id: msgId, role, text, timestamp: Date.now() });
    await saveDB(db);

    return new Response(\`Success! Chat ID: \${targetId}\\n\`, { status: 201, headers: textPlain });
  }

  if (path === '/cli/latest' && request.method === 'GET') {
    const db = await getDB();
    const roleFilter = params.get('role');
    
    let allMsgs = [];
    for (const [chatId, chat] of Object.entries(db.chats)) {
      for (const msg of chat.messages) {
        allMsgs.push({ ...msg, chatId });
      }
    }
    
    allMsgs.sort((a, b) => b.timestamp - a.timestamp);
    
    if (roleFilter) {
      allMsgs = allMsgs.filter(m => m.role === roleFilter);
    }

    if (allMsgs.length === 0) {
      return new Response('No messages found.', { status: 404, headers: textPlain });
    }

    return new Response(allMsgs[0].text, { headers: textPlain });
  }

  if (path.startsWith('/cli/chat/') && request.method === 'GET') {
    const chatId = path.split('/').pop();
    const db = await getDB();
    const chat = db.chats[chatId];
    
    if (!chat) return new Response('Chat not found', { status: 404, headers: textPlain });

    let output = \`=== Chat \${chatId} ===\\n\\n\`;
    chat.messages.forEach(msg => {
      const prefix = msg.role === 'user' ? '[PROMPT]' : '[AI RESULT]';
      output += \`\${prefix}:\\n\${msg.text}\\n\\n---\\n\\n\`;
    });

    return new Response(output, { headers: textPlain });
  }

  return new Response('CLI Endpoint not found. Try GET /cli for help.', { status: 404, headers: textPlain });
}

// --- 3. MAIN BACKEND ROUTER ---
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' && request.method === 'GET') {
      return new Response(HTML_UI, { headers: { 'Content-Type': 'text/html' } });
    }

    const token = request.headers.get('X-Auth');
    if (token !== env.ADMIN_PASSWORD) {
      return new Response('Unauthorized. Use -H "X-Auth: YOUR_PASSWORD"', { status: 401, headers: { 'Content-Type': 'text/plain' } });
    }

    if (path.startsWith('/cli')) {
      return handleCLI(request, env, url);
    }

    const getDB = async () => (await env.CLIP_KV.get('database', 'json')) || { chats: {} };
    const saveDB = async (data) => await env.CLIP_KV.put('database', JSON.stringify(data));

    if (path === '/api/chats' && request.method === 'GET') {
      const db = await getDB(); return Response.json(db.chats);
    }
    
    if (path === '/api/chats' && request.method === 'POST') {
      const { id } = await request.json(); const db = await getDB(); db.chats[id] = { messages: [] }; await saveDB(db); return Response.json({ success: true });
    }
    
    if (path.match(/^\/api\/chats\/\d+\/messages$/) && request.method === 'POST') {
      const chatId = path.split('/')[3]; 
      const { id, role, text } = await request.json(); 
      const db = await getDB();
      if (!db.chats[chatId]) return new Response('Chat not found', { status: 404 });
      db.chats[chatId].messages.push({ id, role, text, timestamp: Date.now() }); 
      await saveDB(db); 
      return Response.json({ success: true });
    }
    
    if (path.match(/^\/api\/chats\/\d+\/messages\/.+$/) && request.method === 'PUT') {
      const parts = path.split('/');
      const chatId = parts[3];
      const msgId = parts[5];
      const { text } = await request.json();
      
      const db = await getDB();
      if (!db.chats[chatId]) return new Response('Chat not found', { status: 404 });
      
      const msg = db.chats[chatId].messages.find(m => m.id === msgId);
      if (!msg) return new Response('Message not found', { status: 404 });
      
      msg.text = text;
      await saveDB(db);
      return Response.json({ success: true });
    }
    
    if (path.match(/^\/api\/chats\/\d+\/messages\/.+$/) && request.method === 'DELETE') {
      const parts = path.split('/');
      const chatId = parts[3];
      const msgId = parts[5];
      
      const db = await getDB();
      if (!db.chats[chatId]) return new Response('Chat not found', { status: 404 });
      
      db.chats[chatId].messages = db.chats[chatId].messages.filter(m => m.id !== msgId);
      await saveDB(db);
      return Response.json({ success: true });
    }
    
    if (path.match(/^\/api\/chats\/\d+$/) && request.method === 'DELETE') {
      const chatId = path.split('/')[3]; const db = await getDB(); delete db.chats[chatId]; await saveDB(db); return Response.json({ success: true });
    }

    return new Response('Not Found', { status: 404 });
  },
};
