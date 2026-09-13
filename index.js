// --- 1. THE FRONTEND UI (HTML/CSS/JS + PWA SETUP) ---
const HTML_UI = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0B1120">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Prompt Bridge">
<meta name="description" content="A private, cross-device clipboard and chat-thread manager for AI prompts.">
<title>Prompt Bridge</title>
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>
  :root {
    --bg-dark: #0B1120; --bg-card: #1E293B; --bg-input: #0F172A;
    --blue: #2563EB; --blue-light: #3B82F6;
    --green: #4ADE80; --green-dark: #064E3B;
    --white: #F8FAFC; --muted: #94A3B8; --danger: #EF4444;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-dark); color: var(--white); height: 100dvh; display: flex; flex-direction: column; overflow: hidden; user-select: none; }

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
  .bubble { max-width: 85%; padding: 12px 15px; border-radius: 18px; position: relative; word-wrap: break-word; font-size: 0.95rem; line-height: 1.4; }
  .bubble-text { white-space: pre-wrap; }
  .bubble-user { background: var(--blue); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
  .bubble-ai { background: var(--green); color: var(--green-dark); align-self: flex-start; border-bottom-left-radius: 4px; font-weight: 500; }
  .bubble-actions { display: flex; gap: 10px; margin-top: 8px; font-size: 0.8rem; opacity: 0.8; flex-wrap: wrap; }
  .bubble-actions span { cursor: pointer; padding: 5px; }
  .bubble-actions span:active { opacity: 0.5; }

  .input-area { background: var(--bg-card); padding: 15px; border-top: 1px solid #334155; flex-shrink: 0; }
  .input-row { display: flex; gap: 10px; margin-bottom: 10px; }
  textarea { flex: 1; background: var(--bg-input); border: 1px solid #334155; color: var(--white); padding: 12px; border-radius: 12px; font-size: 1rem; resize: none; height: 60px; font-family: inherit; }
  textarea:focus { outline: none; border-color: var(--blue-light); }
  .btn { padding: 12px 16px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; font-size: 0.9rem; white-space: nowrap; }
  .btn-blue { background: var(--blue); color: white; }
  .btn-green { background: var(--green); color: var(--green-dark); }
  .btn-danger { background: var(--danger); color: white; }
  .btn-muted { background: #334155; color: var(--white); }
  .btn:active { opacity: 0.7; }

  .login-screen { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px; }
  .login-screen input { background: var(--bg-input); border: 1px solid #334155; color: var(--white); padding: 15px; border-radius: 12px; font-size: 1rem; margin-bottom: 15px; }

  .toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--bg-card); color: var(--white); border: 1px solid var(--green); padding: 10px 20px; border-radius: 20px; opacity: 0; transition: opacity 0.3s; pointer-events: none; font-size: 0.9rem; z-index: 1000;}
  .toast.show { opacity: 1; }

  .empty-state { text-align: center; color: var(--muted); margin-top: 50px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 2000; }
  .modal-box { background: var(--bg-card); border: 1px solid #334155; border-radius: 14px; padding: 20px; width: 100%; max-width: 360px; }
  .modal-title { font-weight: 600; margin-bottom: 12px; font-size: 1.05rem; }
  .modal-message { color: var(--muted); margin-bottom: 16px; font-size: 0.95rem; line-height: 1.4; }
  .modal-textarea { width: 100%; background: var(--bg-input); border: 1px solid #334155; color: var(--white); padding: 12px; border-radius: 10px; font-size: 0.95rem; resize: none; height: 100px; font-family: inherit; margin-bottom: 16px; }
  .modal-textarea:focus { outline: none; border-color: var(--blue-light); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
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

<div id="modal-overlay" class="modal-overlay hidden">
  <div class="modal-box">
    <div id="modal-title" class="modal-title">Title</div>
    <div id="modal-message" class="modal-message hidden"></div>
    <textarea id="modal-textarea" class="modal-textarea hidden"></textarea>
    <div class="modal-actions">
      <button class="btn btn-muted" id="modal-cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-blue" id="modal-confirm-btn" onclick="confirmModal()">OK</button>
    </div>
  </div>
</div>

<script>

  // --- PWA SERVICE WORKER REGISTRATION (real file, not a blob URL) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (err) {
        console.log('SW Reg Failed', err);
      });
    });
  }

  let TOKEN = localStorage.getItem('bridge_token');
  let state = { chats: {}, currentChatId: null };
  let modalConfirmCallback = null;

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
    if (!TOKEN) return;
    localStorage.setItem('bridge_token', TOKEN);
    await checkAuth();
  }

  function logout() {
    TOKEN = null;
    localStorage.removeItem('bridge_token');
    location.reload();
  }

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
    if (res.ok) {
      state.chats = await res.json();
      if (state.currentChatId) renderChat();
      else renderList();
      showToast('Refreshed!');
    }
  }

  function renderList() {
    const container = document.getElementById('chat-list');
    container.innerHTML = '';
    const chatIds = Object.keys(state.chats).sort(function (a, b) { return b - a; });

    if (chatIds.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No chats yet. Create one to start!';
      container.appendChild(empty);
      return;
    }

    chatIds.forEach(function (id) {
      const chat = state.chats[id];
      const msgs = chat.messages;
      const userMsg = msgs.find(function (m) { return m.role === 'user'; });
      const title = userMsg ? userMsg.text : 'New Chat';
      const preview = msgs.length ? msgs[msgs.length - 1].text : '';
      const date = new Date(parseInt(id, 10)).toLocaleString();

      const card = document.createElement('div');
      card.className = 'chat-card';
      card.addEventListener('click', function () { showChatView(id); });

      const titleEl = document.createElement('div');
      titleEl.className = 'chat-title';
      titleEl.textContent = title.substring(0, 50);

      const previewEl = document.createElement('div');
      previewEl.className = 'chat-preview';
      previewEl.textContent = preview.substring(0, 80);

      const metaEl = document.createElement('div');
      metaEl.className = 'chat-meta';
      const countSpan = document.createElement('span');
      countSpan.textContent = msgs.length + ' messages';
      const dateSpan = document.createElement('span');
      dateSpan.textContent = date;
      metaEl.appendChild(countSpan);
      metaEl.appendChild(dateSpan);

      card.appendChild(titleEl);
      card.appendChild(previewEl);
      card.appendChild(metaEl);
      container.appendChild(card);
    });
  }

  function renderChat() {
    const chat = state.chats[state.currentChatId];
    if (!chat) return showListView();
    const container = document.getElementById('messages-container');
    document.getElementById('chat-title').innerText = 'Thread';
    container.innerHTML = '';

    if (chat.messages.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Send a prompt to start!';
      container.appendChild(empty);
      return;
    }

    chat.messages.forEach(function (msg) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble bubble-' + msg.role;

      const textEl = document.createElement('div');
      textEl.className = 'bubble-text';
      textEl.textContent = msg.text;
      bubble.appendChild(textEl);

      const actions = document.createElement('div');
      actions.className = 'bubble-actions';

      const copyBtn = document.createElement('span');
      copyBtn.textContent = '📋 Copy';
      copyBtn.addEventListener('click', function () { copyText(msg.id); });

      const shareBtn = document.createElement('span');
      shareBtn.textContent = '📤 Share';
      shareBtn.addEventListener('click', function () { shareText(msg.id); });

      const editBtn = document.createElement('span');
      editBtn.textContent = '✏️ Edit';
      editBtn.addEventListener('click', function () { openEditModal(msg.id); });

      const deleteBtn = document.createElement('span');
      deleteBtn.textContent = '🗑️ Delete';
      deleteBtn.addEventListener('click', function () { deleteMessage(msg.id); });

      actions.appendChild(copyBtn);
      actions.appendChild(shareBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      bubble.appendChild(actions);

      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  async function createNewChat() {
    const id = Date.now().toString();
    state.chats[id] = { messages: [] };
    await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN },
      body: JSON.stringify({ id: id })
    });
    showChatView(id);
  }

  async function addMessage(role) {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (!text) return;
    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    state.chats[state.currentChatId].messages.push({ id: msgId, role: role, text: text });
    input.value = '';
    renderChat();
    await fetch('/api/chats/' + state.currentChatId + '/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN },
      body: JSON.stringify({ id: msgId, role: role, text: text })
    });
  }

  // --- Edit / Delete now use an in-page modal instead of prompt()/confirm(),
  // because those native dialogs are suppressed by iOS/Android when the app
  // is installed and launched as a standalone PWA, which silently "broke" them. ---

  function openEditModal(msgId) {
    const chat = state.chats[state.currentChatId];
    const msg = chat.messages.find(function (m) { return m.id === msgId; });
    if (!msg) return;

    document.getElementById('modal-title').textContent = 'Edit message';
    document.getElementById('modal-message').classList.add('hidden');
    const ta = document.getElementById('modal-textarea');
    ta.classList.remove('hidden');
    ta.value = msg.text;

    const confirmBtn = document.getElementById('modal-confirm-btn');
    confirmBtn.textContent = 'Save';
    confirmBtn.className = 'btn btn-blue';

    document.getElementById('modal-overlay').classList.remove('hidden');
    setTimeout(function () { ta.focus(); }, 50);

    modalConfirmCallback = async function () {
      const newText = ta.value.trim();
      if (!newText) return;
      msg.text = newText;
      renderChat();
      closeModal();
      await fetch('/api/chats/' + state.currentChatId + '/messages/' + msgId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Auth': TOKEN },
        body: JSON.stringify({ text: newText })
      });
      showToast('Message updated!');
    };
  }

  function openConfirmModal(message, onConfirm) {
    document.getElementById('modal-title').textContent = 'Please confirm';
    document.getElementById('modal-textarea').classList.add('hidden');
    const msgEl = document.getElementById('modal-message');
    msgEl.classList.remove('hidden');
    msgEl.textContent = message;

    const confirmBtn = document.getElementById('modal-confirm-btn');
    confirmBtn.textContent = 'Delete';
    confirmBtn.className = 'btn btn-danger';

    document.getElementById('modal-overlay').classList.remove('hidden');
    modalConfirmCallback = async function () {
      closeModal();
      await onConfirm();
    };
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    modalConfirmCallback = null;
  }

  function confirmModal() {
    if (modalConfirmCallback) modalConfirmCallback();
  }

  function deleteMessage(msgId) {
    openConfirmModal('Delete this message?', async function () {
      const chat = state.chats[state.currentChatId];
      chat.messages = chat.messages.filter(function (m) { return m.id !== msgId; });
      renderChat();
      await fetch('/api/chats/' + state.currentChatId + '/messages/' + msgId, {
        method: 'DELETE',
        headers: { 'X-Auth': TOKEN }
      });
      showToast('Message deleted!');
    });
  }

  function deleteCurrentChat() {
    openConfirmModal('Delete this entire chat thread?', async function () {
      await fetch('/api/chats/' + state.currentChatId, { method: 'DELETE', headers: { 'X-Auth': TOKEN } });
      delete state.chats[state.currentChatId];
      showListView();
    });
  }

  // --- Copy / Share now have a fallback + real success/failure feedback ---

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      throw new Error('Clipboard API unavailable');
    } catch (err) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const success = document.execCommand('copy');
        document.body.removeChild(ta);
        return success;
      } catch (err2) {
        return false;
      }
    }
  }

  async function copyText(msgId) {
    const msg = state.chats[state.currentChatId].messages.find(function (m) { return m.id === msgId; });
    if (!msg) return;
    const ok = await copyToClipboard(msg.text);
    showToast(ok ? 'Copied!' : 'Copy failed - long-press text to select');
  }

  async function shareText(msgId) {
    const msg = state.chats[state.currentChatId].messages.find(function (m) { return m.id === msgId; });
    if (!msg) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AI Prompt', text: msg.text });
      } catch (err) {
        if (err && err.name !== 'AbortError') {
          const ok = await copyToClipboard(msg.text);
          showToast(ok ? 'Copied for sharing!' : 'Share failed');
        }
      }
    } else {
      const ok = await copyToClipboard(msg.text);
      showToast(ok ? 'Copied for sharing!' : 'Share failed');
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2000);
  }

</script>
</body>
</html>`;

// --- PWA: service worker script + manifest + icons ---
const SW_JS = `
const CACHE_NAME = 'bridge-shell-v1';
const SHELL_URLS = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Live private data - never cache, always go straight to network.
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/cli')) {
    e.respondWith(fetch(e.request));
    return;
  }

  if (e.request.method !== 'GET') {
    e.respondWith(fetch(e.request));
    return;
  }

  // App shell: network-first (stay fresh), fall back to cache when offline.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((cached) =>
          cached || new Response('Offline - reconnect to sync.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          })
        )
      )
  );
});
`;

const ICON_192_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAANkklEQVR4nO2d+XMUxxXHe1crDonTGB1AGaqSVH5IBWl3pdx3bIgNmEO2uE9jnFSlKv9MigTMKTDCAgIYsGNy34m0OnCq4koqcYEJ6EAYKUK3dic/7Gqu7enpc46d96n3gzTzuvvb/d686ZFGq1jl0jXIK1Zs6/BsrIjz8GeN3gwUU5pAtVv/pq5zgJ7eq19U1LOSBKrd+lfpfQJS6L36JbkdSk6g2i1/kdgboIjea1+W1ZW0BKrd8mcp/QCe0XvtK+KdSEig2s1/EtcB+EXv9a+KNBdKoNrNfxQZGwgOvde/xteQP4FqN/+BryEQTHqvf52jFU8C1bz8e46RgFDQ9843mPyZE6jm5d8x+QOho++db9I7syVQzabfsqoBwkjfjW9RejIkUM2m3/CpAcJI341v07jRJlDNxl8LyQFCSN/N77j6UCVQzcZfSZADhJC+m98lO7gnUM3GX0qTA4SQvpvPE866JFD1hl9IlgOEkP5bLzidIiVQ9YbbSuQAIaT/1jrscccEqn7pfYVygBDS/+764oMJZ/+cOilAyYCvQNUvvuu5EiAE9L/3ku0IJoGqX7zlkRwghPS/t8H8LfYWpnkjBSgB7BWo+ns3fFIChIb+n2/Sv7ZXIA3KD8CCpQJVrb/unxIgTAy8vzn/ha0CQfkB2DAqUNW6q74qAULGwO2tyFqBoPwAzBQqUNW6K34rAcLHwO2m2QqkQfkBeCgkEDy9A3zEKpeuWf58m98ygLCSr0BQfgBOEgjBBgjgByoQIEQ+geDdMYCT2Jom+IQNgJ8EPMADIiRgBw2IkIAdNCACVCBACKhAgBCQQIAQcAsDhIAKBAiR0KACAQJABQKEgD0QIARUIEAISCBACLiFAUJABQKEgMd4QIgEvI4IiAB7IEAI2AMBQkACAUKUzi3s8z/+wHbk7z9c64sSLAGXx01pV6CATy3g8qgonQqEIeBTC7g8Okr5z3oCPrWAy6OkRCrQ2qP/wBwNzNQCLk8E2AP5SMDlURFHSAu7rT36IXZua49+6Lu24MsTtNiq9a0qE1Q5a3/yT7LDBz/4rDdKsARcnjjhrkCu4UGFEII8VVYim2gXAj7HgMsjElu57rzfGjip++m/6Z3vfP/T6pRgCbg8WcRWvnDObw081B37D2uTO298SoUSLAGXJ5FQ7oE4woMKQQV5ki2OUC5cVnfsI/O633ljDSEqtrN1xz6KuDzpFkeaFjIzB+DI6rpjdwkRqjt2986R1ZZDEZcn20J2C6s7fs8UnucQ0uwxwaDdOfKcEbPj9yIrT4WFqQLVHf8Yc7G6B8juVnf84wjKU2Rx/yXQWd2b982r3PP6KvPBntdXOQWo7s37GtJsDvmD0ZGnzsJTgczhObzSflAjXuuahjSt5/DK4oNRkafMwrEHqj/xwBSeFaZTxnqTIjTr33N4hX6o/sSDiMhTaiFIoPoTD7HLrR/vOVxLGSGbW/2Jh+rkWcfCyOs5XIuTIVmeagv6Laz+RK9l0V+rwdw1im4ihnMhEr16K/1g8Sm58vRThYPFFE9BtjwPLNAVqP5knzU81c7XNy5CGB8NIa3ntWpLkE72laQ8byzYFcgcnkNVlkv/ZL/9OCZAmuVrk/UcqrJ7SpWHGRonT5dRf7JfvjxPLLgVqP7UgCk8y4sciq9dTIh6Di0vROjUgK0H/RT2rKA8/azpFEaew0QkyPPMAvrpHMnTg+ZvCSLpT5FnWn/qUffBZ0tDnpcEsQLZwtN9cJmTg/VUMaRLHCGt++Ays3fy9KAUeQ6D4uXpGopH55PnsQUxgazheYYuPIQIPTMbgMfFXelnnZKMQ17y9GPcWbw85+lwy/PUAreJTp7+xAjPgaUuu1eHLa39LNZ/1roPLNXPJ09/Emp53luwKlDyzBPXC0736T6wxHoKEyLXS7y4bfLMExF5zsM5yus+sMRtaCp5vliAKlDyzJB5pbr3L2a4vomXePf+xbOrP4S/ymcdCG6U8nQ3u4OzPNKkqOX5ZUF5IzF5dtganoXOzjpOx7EOTq0K1r1/oSVIZ4dDJM9Hi2vBwLw6XfsWOLklz444+RTHB3uWoKFr3wLX5mR5hIHI8vShk2dHOOT5SCD2QKmWp6bwVBKdjQUkbBSKfbr2VeYPpVqeEvrX3cye9PJ0T5wbSZ7b1Ejy/DX/EyjVMkpcVoxn174KnIOECNn6SbWM0stzG8JFXte+Cn1Qenm+h8/nTXSqZcy8Il1755P8jZUnnnVyIzefta6983HBppBHHsJVHp1Cm7xUy5i/EfSzAqXOjVvDM0/g+qa4xPfOKyz6uXHyQLonkzx9Og6eLvIoJoiX5zodpeZrBTKHZ89csnPq3ISLJyZAPJd44ULfM5dJnnvnFPL0QVPnJpjk+RhE3ypQ6vykKTxzKJq4Xp2YEPFd4jZ5CKHU+UlhhTTyGBR27ZnDKE+J+ZNAqfNTFEvJurLuEeraUz674lMs8hiadO0p55ZHN018n2R56syHnwOlzk+bZ965O0HfhOCMiQ/RjVKeNUjTrqMLyuvcnXAdq9iZvol0fKlA5uwpY2xC1S3R2bUri7zO3WUUfbJ1K9yVYdTyVJnXm+j0W1kjPLuoRzfWh8KH6Ny5K54/mX4rSylPb+LaijQjOnm0k8XNyEmeUvO0AqUv2H4lxNaqc1eM6IkJEdMlTpRnkL6Qo+yQT17nrpjzQO6ds7SSYN5VoPQFyzw7dyLatsaC07m5+uMcyPI6d1o6Tl9gV0gvj37KlPJUmkcVKG39KNjOnUzNjeWUc4nvLDinWxG9PL2VU1u3SdHKY5myuzzV5tktzBwehhqbbo1RtxKJEJW8zp3YexxlsBnk6QOlW8l3bRp5as2Lx/h0q7HLy+zIMrU1FoPak6aJ2YdJXmaHsctOt8bpFTLJo+/WVZ5qlP/P1IaL5dYDrMPpj6muDcuKjhCaFJwbLtpa0cgzmlibk9syyUMsE3ccqOFiWWaH44+1pKB2E23Lnsz2Kb7mVA2LcXbObMf8rJlSHmdbFnnmURouljMtmk0ea3NWU70HMi8xx+9rjMVmGouulS0DGORltk8yjsUhj3X6BHkKQ6ywAjW8bfzGONPs8utll6uWyZmylTl72OVlmicYxuKQxzp9Z3kNb1O8SsBrqipQQ5vtlRr+HjLNlO+7YEKkTp5txIY2+peZaAfNNI9Tdy4uj9OUJFBDm+WtuUzzmNj8mdeL3NAmT0oCIYQa2uZLkSe2CIZlmi1ve7rJ4zT5T3oNbRVm3R2vjvL1Y6wcoz+5oU0e0xCuIza0VQjKc2rFp7DjVcsL3QR53KioQObs4fzLgcZLlew9YGJEIQ8hhBovkf8UxFWh66D08iwmotDWA/2gTCZ5E914yfjbpY5XRvi7Ml16zE2c22LkcQxUpLDjlRH9u8ZLC7jlSVsKq1HJ4zWZFajx8kLbCgkYRyeYEFHI41br1A9qvLyQQ57UpSCN7iCP06RVoMbLi8wqO5qGxbti6wQTIHd5HU3Ds8u6SESh3o9jb0R5pPrBpdCpE/GubCaxApnDMySpK04BuOYEeRzDYZp0NA05j+4qT8WCWMxNHqfFlid/hJsbG41XjM+w6Wh6QnYAvME1EFgHViTcwuzJQXl/AVTjFojGKw4fkMV0CxO/DbZve6xrat/2GOvj+eIBiDtYTCZnE92+dRAh1L510NEH8B7uYLFYwmF/x0z71kdS+gHk4RhZicGKxv+NjyaeRFb5G4l52rf0uTup5wvXCv/KhFIPkz9r56WBtFtY2GCdNZN/hJY0qrcw1lkz+UdpSRPRfMZmnTWTf6SWFCqQAv8oLSnsgVT4R2hJoQIp8I/SkkIFUuEfoSWNLfvcAb81ACEmqrcwQBIRfYwHZAEVCBAisptoQA5QgQAhoAIBQkACAULALQwQwqMXyoBSJaFBBQIEgD0QIATsgQAhoAIBQkACAULALQwQAioQIAQ8xgNCQAUChIA9ECAEVCBACEggQAi4hQFCQAUChIAKBAgBf9YDCJGYGf5XYtFn/JYBhJUEQgheSgS4yScQ3MUAThIIRevjSAC5QAUChEgghGZG7iYWrPZbCRA+Zp7ey1egaH0uJCCRQgLBNgjgo5BA2dH7ZZWr/JUChIvs6H+RUYEQgq00wIGRQNnRB2UVK3yUAoSI7NjD/BcJ63EoQgAblgTKjvWWza/xSwoQFrLjxr8jslUgeJ4H2LAnUG68Pz6vyhcpQCjITQyYv7UnEEIIdkIAPZgEyk08is971nspQPDJTQzajmArEMpNDMbnLlOvBwgTucnHxQfxCZT3VycFKBkcEyg3+SQ+Z4mHSoBAk5sawh4nVCCUmxqKz1msRA4QKnJTw06nSAmUbxkrXyRbDxAmtOn/Ec66JFC+fax8oTw9QJjQpkfIDu4JlO8lVr5Ahh4gTGjTT119qBIo31csUSmmBwgT2swojRttAuV7jCUqePUAYUKbGaP0ZEigfL+xsvnseoAwoWXH6Z3ZEijfe6xsHmsrICxo2Qkmf+YEMsaIz+VoCwSX3CRHI54EMsaLz+FvDgSK3BRfO4EE0keNlwt1AvhLblqktVgCmRXEZHQFeIk2I96HvKjn1cTKpHUIqEPLyupJdtkoKItL7haQhuS3dBTdd3SVMTX9A6yoek35//gq+/pX1iV+AAAAAElFTkSuQmCC';
const ICON_512_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAfpUlEQVR4nO3d2Z9cxXXA8ZpRSyAkxCqNZCAmjpM85BNmJ/tmGzAYMIh937H9+eQhf0w+ttlXse+LjeM4i7NLo9GIPMSJN2xsNBICJKFdM9N5aGlmNOqpu1XVqarz+37qAbu7q8695/aprro9rZ4VZ5xvUMVn1m+SDgFAdx+8MiodQkp6mAAWs+7qjdIhAHBj26sXSocQIyaAOVR8QAnmgw7tE8C6q/9LOgQAkra9+gfSIYjROAFQ9AF0pW0yUDQBUPcBlKRkJsh/Alh39X9KhwAgVdte/UPpEDzKdgJYdxV1H4Az217LcCbIcAJYd9V/SIcAIE/bXvsj6RBcymcCoO4DCCaPmSCHCYDSD0BE6tNA2hPAuqv+XToEANpte+2PpUOoKdUJgNIPICopTgPpTQDrvvpv0iEAQHfbXv8T6RAqSGkCoPQDSEIq00CvdABlUf0BpCKVepXACmDdV/9VOgQAqGPb638qHYJN1BMApR9ABqKdBuKdANZ99V+kQwAAN7a9/mfSIXQR4wSw7kpKP4AMbXsjrmkguglgLdUfQL4mY5oD4poA1l75Q+kQAMCvyTf+XDqEo2KZACj9AFSJYRqIYgJYe+U/S4cAAKFNvvEXsgHI/yEY1R+ATuLVT3IFsPYKSj8AmMk3ZZYCYhPA2iv+SWRcAIjQ5Jt/GX5QmS0gqj8AzCdSFQVWAGuv+MfAIwJAEibf/KuQw4VeAVD9AWAxgStk0AmA6g8AdiHrZLgtoLVX/EOYgQAgdZNvfiHAKIEmgLWXU/0BoILJt7zPASEmgLWX/8D3EACQn8m3vui1f+/3AKj+AFCP7/rpdwKg+gNAE16rqMctoLWX/72nngFAlcm3vuSjW18rAKo/ALjiqaJ6WQGs/cr3nfcJAMpNvn2R2w7drwCo/gDgg/Pq6ngF0Ef1BwCftrtbB7icAPq+8neuugIALGb72xc76Uf+XwQDAIhwtgLo+8r3nPQDACi0/e1LmnfiZgLou4zqDwBBbf9O0znAwRYQ1R8Awmtee1suwmi76AQAEFTTFUDfZe84iQMAUFXDCtzoHkDfZd9tMjYAoLnt37m03gvrrwCo/gAQg9rVuME9AHb+ASBlNbeA+i79jutIAAD1bf/uZVVfUmcLiOoPALGpUZnrbQGx+wMAyau8Aui79G0fcQAAGqpan/kxOABQqtpN4L5L3/IWCQDAge3fvbzkMytMAH1fpvoDQAK2v1NqDmALCACUKrsC6Pvym54jAQA4s/2dKwqfU/ZroHzxEwAyU2oFsObLb/iPBADg0o53rrQ/gXsAAKBU8QpgzSV8/AeAJO34nm0RUOYeAPv/AJChgi2gNZe8HiYOAIBz9hpeuALg4z8A5Mm2AlhzyWuhwgAAeGGp5HwLCACUsm4Btdn/AYBsLboCWHPxqyHjAAB4slg9t6wA+PgPADnrvgJYc/ErgeMAAPjTtapzExgAlFpsC4j9HwDIXJffAlpz0csSkQAA/Nrx/Wvm/8+uKwA+/gNA/rgHAABKLZwA1lz0kkgcAADfFlT4hVtAbfZ/AEAHtoAAQKnjvgW0+qIX5CIBAITw4fev7/zH8VtAbP8AgBpsAQGAUgtuArMEAAAt5lYAq7/0vGAcAIAwZqv9/BUAH/8BQBHuAQCAUvNWACwAAECTo38HsPqLz0pHAgAI58Mf3MQWEAAoNbsFxAYQAOjCCgAAlGICAAClelaccf7qL2yQDgMAEBorAABQqnMTmDvAAKAOKwAAUIoJAACUahn+HWAAUKllDLcAAEAjbgIDgFI9n13/Q+kYAAACuAkMAEq12P8BAJ1YAQCAUqwAAECpFvUfAHRiCwgAlGILCACUYgUAAEqxAgAApVgBAIBSfAsIAJRiCwgAlGILCACUYgIAAKXYAgIApVgBAIBSrXabFQAAaMQKAACUYgIAAKW4CQwASrECAAClWAEAgFL8FhAAKMUWEAAoxRYQACjFCgAAlGIFAABKsQIAAKWYAABAqZbhx+AAQCVWAACgFDeBAUApVgAAoBQTAAAoxRYQACjV4ktAAKATKwAAUIp7AACgFBMAACjFFhAAKMUKAACU4reAAEApVgAAoBQTAAAoxU1gAFCKFQAAKMUKAACUalH/AUAntoAAQCm2gABAqZZ0AIjL7//tu1Vf8t9/fYGPSFCIZKEhVgBojksoISQLc7gHAABKMQEAgFL8GBwa4xJKCMnCPC0uBzTEJZQQkoX5uAmM5riEEkKyMId7AACgFBMAACjFFhCa4xJKCMnCHH4MDo1xCSWEZGEeVgBojksoISQLc7gHAABKMQFgzgXf/J9gr0JDJAvNsQUEJ7iKEkKycBQrABx1wTd/JPJa1ECy4ETPuZc8Kx0D5F3wrf9t3sm73/jd5p2gEMmCK6wA4KagOOwHFiQLDjEBAIBSPede8ox0DJB0wbf+z22H737jd9x2iFkkC26xAlDNeUHx1CcMyYIHTAB6+XvzU1acI1nwoefcizdIxwABF3z7x76HePfrv+17CCVIFjxhBQAASvWce/HT0jEgtAu+/ZMwA7379c+HGShjJAv+9JzDBKBMf6iC0rGVstIAyYJXbAHpErigiIyYDZIF33rOufgp6RgQSP+3fyo19Nav/5bU0IkiWQiAFQAAKNVzzkVPSseAEPof+JlsAFu/9jnZABJCshAGKwAVxAtKJDEkIYYTFUMMCIAJIH/2N7Pbz3r23igrhUgWQuJfBIPbC6CwN663JkgWXGIFkLn+B35ueXTr137T+Yj2Pu3xKEeyEFjPORc9Lh0DfOl/4D3Lo1u/dn7hc2oo023nOZiPZCG8XtM2tCxbwbv6/vOPPtO5tjFts/X+8y1P6X/gPfHzE1UjWTSRxhZQnvoffM/yqP0N70pBWbFGqArJghRuAut0NOn9D/7Cedf9D7639f7PVgoDViQLvrACyJC9UpR+wztgH8tHRUsOyYKgXvldKJrTVlRQfuP453syN8TW+3/D8rz+B38hfsZIFslS21gBZKX/wV9aHl3w9rY/2WEYRWXFVxiRI1kQ1zJt6RDgSP9DRW/OkLmuMlb/g7/cep+t7uSHZCEG3ATWYut95wkWla33ndf/0Pvln68cyUIYbAFlwv6O3XrfeZWe39yJ/Z8Yg/35GSNZiESrzWSevoGHfmV5dOK+c0U+sp14aU3cd64l1P6H3p+471zPQckjWYgHK4DklSgoEbHHYz+WDJAsRIUJIG313oRh3roxxyYi5hMSc2zwp2XabAFla+Lec4Tv13W7uibuPWfg4V9XfVX2SBbCYwWQMPs7c+Lec4JFUpU9toKKkyaShQj1fOYLD0rHgDoGHv7A8ujEvZ+p90LnakdieWFySBbixAogSXm8G+1xBq59/pAsRIsJAHPqFaNUSlhmSBaa48fg0mtFnyjX1X6tMe1aV5HtVQMPf2CJZ+LedbVfm0QjWbSYGyuAxAw8vM3yqP0tGqeismI73siRLESu17TbtFRaQUG5Z21xJ4Uvr6Hdnrhnrf0J9mZ/+cDD28TPPMnKO1lqGyuAZAw8Mineg9S4UpHXlu4hpxs5amACyETBx7ropR5/JakfbOrxYxY3gdNo9k9VE/f0leunTA81tI1pT9zTV/gce7P3MPDIpHgWSFZ+yVLeWAEkYOCR7ZZHi97MpTrxreToRWVF8hBKIlmVOoEsVgCxt6KCsqZ0V3Yln9bktaXinLhnjaWLgUe2i2eEZOWRLJox7V7pAGi2NvDIDhfvU2Patj4m7l5T5mmFMUzcbSsHTkI1xgw8skM8LyQr9WTROo0toIQVvIfnGXi0qDb5Vz6G8seVEJKFCLEFFG+zvwkn7l5dpTe78s9s+PKyAU/cvdrSy8CjO8SzQ7LSTRZttrECiNTAox9aHrW/5Spx2JXb3orKiu38BEayEkoW5uuV/1s02gnN/obZcvfZDntb8OQa11D5HgYe/bBS5FvuPtthbySrUg9ZJou2oLECiM7gozulQ0iG+LkSDyAhnKsI8S2g+JrVlrvOdthhl95qOL6HLXfZPglWDb6gt+odkiy9yaKd0LgJHFcbfMz2KWnLXWe57bDbS2qo0MngYzurHsKWu85y2yHJUpgsWtfGFlBEBh/7yPKo/a2Vt6KyYjtvnpCsxUSYLCyGFUAsraignFm356p91rCwky13nVnp+WWavc/Bxz4iWeWoSxbN0lgB5GzwsY+lQ+gizqjExXla4owKrjABRMH+Niv6jKZF0efKQKWKZJURSbJgx78IJt8KCsqdZ9TvvEa3NXTrZ8udZ1R9SZlm73bwsY9JVgFNyaIVNlYAwgYf/8TyaME7s0HPsprEVlBWfB41yapKMFkoo2VMrc8RcGHw8V1FT/GXHYc91+vK16ENPv7JljtP99DtrqKnkKzKPCULJbECiJe/N0aYt1zq8VeS+sGmHj/qYQIQY/9E2fBtU+LjqrCGEdrPj/PDJ1lNXh44WSiPvwOQaUUF5bTGQ9jVfqHb3hod45Y7T7N0Pfj4LpLltLc0kkWr1FgBCBh8fLflUftbpTnf/Yccq6is2M5zSSQrTP9OkoWq+DG40K34Qvc9hP3lNdTtcPDx3Q5OqVXDIUjWrPiTRavR+BZQXLbcscp/Rpz336TDpsFsuWPV4BN7vA5hGZpkVSKYLHTFFlBQ9qt/yx2rfAcQYIjwI9qHKKo4NV8oflyJjugpWaiHm8DhWlFBOTXAKCV6qKF+n4NP7HFy1FvuONXtKCTLyWkMkyxa7cYKIJDBJz61PGp/S6CMorJiO/+VnkyymnOYLDTRaktHAGNMmCyM+6lchcGP33Hq0OJv6WBXoKuBSFYA1KUwWqbNqfZu6Mm9lkfHb18Z6IL3lOuG3bqLavz2lZZTPfTEp+O3ryzshGR5fPk8TpKFhtgC8q5EQQk0Vpzcxmw/n4VjkSy7qJKF5rgJ7LcVFZQVrkdsPlYNxd2O376iYQ/lm32soSf3kqwMkkVz0lgBeDT05D7Lo0VvM9RXVFa65IVkSamRLLjCBJCPdN8q6UZeW7qHnG7kOBFbQL5a0SfKUzwMauekE389Oz4b47efYhls6Ml9JCvRZNEcNn4LyEsbenK/5YIev+0UL+M6GbGGcj2P32Z7k/s4IfYRh57cT7KSSxbNbWMF4L4NPWUvKMvDD1qlqxocdD701H4fp2X8tuX2QUlWQsnyMajyxj0Ax4aeOiAdApAn3lzOMQEEZf+Mk9OgXaV1+GlF65zyw1eCLSCXzf4JZfy2k0XGrdhbDW76H3rqgKfzM37byVUPiWTFmSx/4+psrACcGXrqoOXRGjUIDlU6/yRLVtEcYHujoRJ+C8iNoacPWR4dv/UkY2TOc4ihq1xC47eeZDtXPq/GgqHnPY1kdUSbrKGnDo7fepK/0fVgBeBAmbKS6+hu5XQsXeV0gFz2GWAC8I6PKvEozAXJige5CICbwE1b0ebPMv8xuB29hmpDjN+6zGFvDpNljn6uJFlRJKtwdP/Jyr+xAmhk6OnDlkeL3jzeA0iRvyMq2bN4AAkJcERFc0BupzQwVgD1W1H1XxokDDvnHYYZJXSyFhh6+jDJEkzWgjZ+61LL8N6SpaKxAsiW/W0jK+bYRMR8QmKODQ21+BZoPcMbjlge3XxLiPeMPYZgmXU+0NDTR9yeQPuJiiEGkmW3+ZallhMYJoYssQVUpxVV/1aoSOx89BlsoEDJshjecIRkBU6WpW2+pWWJwHWytDS2gCob3jBledR+mQYTSRgWYSIsTFZRWbG93BWSVVIMycoMK4BqrcRFFkkktXuuwf1YwxumAibLJkgkJMvNIYeNJIfGCsClzbcskQ4BZc0mi6wlhGS5xQRQwfCGacuj8Vya8URi5zXOSsmyR2LvqiGSVZVgsvLTa9ptWplWUFBuDnomC67yJp3X4Ge44Q3TIZO1+WbbhyF/wZCsGs1fsrQ1VgClDD8zY3nUfjkisNrJKigr1m4RGMlygpvAxa3ExRQ+qkVtvrnHU88+Dn/zzT1ue26cLJvhZ2ZIlo+efRx+3WTpanx0baroXeHe8DMFl342nB9pYbKcZ5Nk+RP+rZcfJoAC9suaSzAqTpJlf5qegp4EktUQW0C2VlRQjFBgXkOqodGIm29207nDZNlDGn6GZHnp3EdIFZOlrvVKBxBvG37GdmFtvinGqBwMUYPPQYefkUnW5pu8R6U2Wc6bk2TpbJ1frcFCw88WbhdInbfCG3Fe+xcZtKB/b8mybi88azbfVNgtyQqmebI04h5AHXFeTHFGVYbXyGt3HmdU4uKMPM6o4scE0IX9E6XgpVbio26G7EftNVn2lzcJLFeCR90kWWpxE3hhKyoosl8utgswhNS4YsnafJPtDwuGn7V8kV/8pEmN62SIwMlS2lgBHGf4WdsJsV9esmKOrYwa8QdLVlFZqfwmUpisYJwnK28t025Lx5AO0XM1/Jz117gEY/M/9PCzvZtvrPgjXyFPyAljkSzfo9RHxZunV34REk2zv2nHbpyWDc8uzCiCQ8sma8xa0YafW0KyfIwSJlmaGwuio0aKCkqwSGqIPLySyh+FSLLs3dpDKt9PKiI/ClfJyh43gdvGtIsKivw/M1R0yTocq4YQo488t0Q8WWM32v5hr5IRqkqWYCuZLOWNFYAZeS6Kf+8UZUSerMjDw3wky7ACMKZtP0FjNx6RDq8gSNcR1uBs9LEbjxQNZBMgWUURFgSpLFnCrVyyVDftvwU08txSy9UxdsMR8QgLg3Q8XA2hAogkWWM32MoKyZo7D0HS0TRZ0hHKNtVbQCPPFxUUJCJwsrg2ElIwB1iLQPb0bgEVVf/D4hHOayHjrMFlAGM3HK46vEiy4oizhpAnIXRS6sU58vxS8QilmtIVwMjzy6RDKCuhUIH5Erp0EwrVLaUTgF2ND3eQIpgsrpOEkKyuNG4B2Wf7sRsOiUd4fAscag2OYxi74VDJgcWTJR1q/MmSzE6lUEeeXyYeYfimbgUw8vxJlkfLv5/DsEerXCTJiiSMOMV2ARfNAXFFG4CuH4MbeeFky6Nj1x8MFokbkeROIoyokjV2/UH7pWWM4mRFcuDH2JM18vxJUV1avqlbAWQj78s0s6PL7HAWyPvo8qZoAsjt43/WkkuWPaTi9QECIlmztNwELiooB8QjrBqzt3FrCHzgnbeofIIiiFk+WYWRRJgsY9pj1x9ILmYfTcUKYOSF5ZZH7ZdCnFKMuSR7spKW8aGleEEWzQHZJmu+/FcARdV/v3iEizcLkUG9B1PlXSeenTrnbeSF5dkkq0ow4tnp3sau3x8wWTG2VkHishfr4Y+8eIrt4ajClghm5IVTxq6zvXtDKkjWArK5U5+saqJ6o3mQ+RaQ/Z2Z6kWZqWplNFlKDjMV9iKQfbJa7XznuNEXV1ge3XTdvmCRuBVb5E4uIXuy/I0rYuTFU6SS6O+kbbpunyWJMSfLHrlgsgLIdgWQdPWvUQ2TVu94IzlLSQcfTOTHay8IkQffRCvLXa7RF1cWPSXpo44t+EbxlEiWr6Fljb64YtN1e4MPK3jGSFZ0sl0BWCSdyKSDryHp4006+BqSPt6kg68tw38S0v6JctO1e8UjbBK/9wBq8J2sxY2+uDLyZG261lZWmsZfg9z1I56swuY3WVG23P4OYPQle0H5VDzCEi3Wd7DrkEonS/aENE3Wpms/tTxj9KWVSSTL4QmJuflMVowtqy2g0ZdOtTxqT20SMjiEWeWTlehRlz8E+6lIS6LJmk9PskxOfwlcIjHyQTY+igAx1BAgWYsafenURJJlU/coapC8hAST5fDEpnMUxS2rFYDFpmv3SIeAsrJMVpYHlSs9ycpkAhh9aZXl0TzSmcdRmFrJSu7YaxyF/bQkJLlkdaUkWb2m3U69FRSUa3aLR+jkQAKFUUOYZC1u9KVVqSRr0zW7XR5IDdJXkUiy6jXHyYqyJb8CGH35NMuj9hQiMJJlig7TfooQWPbJyvMvgefJ5Og2XbNLOgQLVyfZ1s+ma3aNvny6/xgcaJwsr8cS4kQllKzG0j6WntWDfyMdQ33Wi6z++9DeLYAUeSoIcX84K5DwFlDGWQEQD3sxSfrzYqp/B1BU/T9p1j+A/NSvCZuu+cTS7+jLp4uXxHotyRXA6MtnSIcAAHMSLUot+3e2UrRp/cfSIQCIT7Nat2n9x6OvnOmvfxHprQDsOaD6A/DEXl4KpocoJTYBUP0BCMpsDkjs3wTeuP4jY8yFr5y12EMA0JWrWrdx/UfZlKDEVgAdKZ5oABlLtCil+pfAG9fvNMZc+MrZ8/8nACzOWa3buH5nHsUn7X8ScuPVO40xG6/e6bhnAPlJoviEbUluAc3XSQMABJZB8Ul1CwgAKqLWLZT8CgAAUA8rAABKUOsWYgUAAEq1mBQBqECtOwFbQF1svGq7dAj5u/C1PsujXlMgNbTgIQNdsQUEAEqxAkCcBC9LqaF5JyI0VgAAoBQTAAAoleG/CIYcCF6WUkPzTkRwrAAAQCluAiNO3AQGvGMFAABKtfjUgQjx+R8IgC0gxIkpAPCOLSAAUIqvgSJKfA0U8I8VAAAoxQQAAEpxExhx4iYw4B0rAABQigkAAJTiW0CIEt8CAvxjBQAASnETGHHiJjDgHSsAAFCKCQAAlOo56/fulI4BACCgxcYjAOjETWAAUIp7AACgFBMAACjFFhAAKMW/CQwASvFbQACgFPcAAEApJgAAUIqbwACgFCsAAFCKFQAAKMUKAACU4sfgAEAptoAAQCm2gABAKVYAAKAUKwAAUIoJAACU4sfgAEApVgAAoBQ3gQFAKVYAAKAUEwAAKMUWEAAo1eJLQACgEysAAFCKewAAoBQTAAAoxRYQACjFCgAAlOK3gABAKVYAAKAUEwAAKMVNYABQihUAACjFCgAAlGIFAABKtVgAAIBObAEBgFJsAQGAUqwAAEApVgAAoBQTAAAo1WrzY3AAoBIrAABQipvAAKAUKwAAUIoJAACUYgsIAJTit4AAQCm2gABAKbaAAEApVgAAoBQrAABQihUAACjFt4AAQCm2gABAKbaAAEApVgAAoBQrAABQqvfIrh9JxwAAENAyxrALBAAKtYyh/gOARi1jTJsZAAD04SYwACjFBAAASnETGACUYgUAAEq1jDFTu3/cWvV56UgAAOFM7fkJKwAAUIoJAACUah37D+4DA4AurAAAQKmjK4CpPT9trfqcbCgAgDCm9vzMzNsCYhMIAHRhCwgAlJq3AmAJAACazK0Apj79uWAcAIAwZqt96/j/n0UAAGjBPQAAUOr4FQALAABQ47gJYGrve62Vn5UKBQDg29TeX8z+N1tAAKDUgpvA/PvAAKDFwhXA9N5fisQBAPBtQYVnCwgAlFq4BWSM4ctAAKBBlwlgeu/7S1acFz4UAIA/0/veX/D/dF0BGBYBAJA97gEAgFLdJ4Dpfb8KHAcAwJ+uVX2xLSDDLhAA5G3RLaDpfb8OGQcAwJPF6rllBWBMm0UAAGSLm8AAoJRtApje/0GwOAAAPlgquXULyBhuBQNArgq2gKb3bwsTBwDAOXsNL1wBGBYBAJCl4glgev/kkuVrA4QCAHBo+sCk/Ql8CwgAlCqzBWSmD0wuWd7nOxQAgCvTB7YXPqfUBGC4DwAA2Sk7Acwc2N67fI3XUAAATswc2FHmadwDAAClyq4AjDEzB3b0nswiAACiNnOw1Md/U2kC6PTbe/Lq6vEAAEKYOfhh+SezBQQASlWeACpNLwCAYKrW52pbQMfwpVAASF6dLaCZgzudxwEAaKJGZa63AjAzB3f2nnxWvdcCANyaOfhRjVfVnACMYR8IANJW/1tAM4fqTDgAALdqV+MGKwBjZg591HvSmU16AAA0MXPo49qvbfp3AE3GBgA00bACN1oBHMPdAABIj4O/BJ459EnzTgAAlTSvvU5WAGbm0Ce9y85w0hUAoNDMYQefvN1MAMaYmcOf9C473VVvAIDFzBze5aQffgwOAJRytgIwxswc3tW77DSHHQIAFpg5vNtVVy4nAGPMzOHdPcwBAOBH2131Nz62gNzGBwDocF5dHa8AOtqHd/csXeWjZwDQqX1kj/M+fd0E9hErAOjkqaJ6WQF0tI/s6Vl6qr/+AUCD9pFPPfXs92ug/uIGAA28VlHvfwfAHAAA9fiunx63gGa1j3zas3RlgIEAIBvtI3t9DxFiAjDGtI/s7WkxBwBAKe0p79XfBJsAjDHtqb09rRXBhgOARLWn9oUZKOhvAQU7KgBIVMg6GfrH4JgDAGAxgStkuC2gWe2pfT2tU8KPCwAxa0/tDzyizM9Bhz9OAIiZSFUUWAF0tKf297SWS40OAPFoTx0QGVdsAjDHjrlnCdMAAKXa0zKlv0P+XwSTPX4AkCJe/SRXALPa0wd6lpwsHQUAhNOePigdQhwTgDl2LpgGAGQvhtLfEcsE0NGePtiz5CTpKADAl/b0IekQ5sQ1AZjO2WEOAJClmKq/iXACMObYOeplGgCQi5m4Sn9HlBNAx8wh07tMOggAaGzmsHQE3UU8AZhjZ41pAECiYi39HXFPAB1Hp4Gl0nEAQGkzR6QjKCb/h2BlpXA2AcCYZOpVCiuAWZ1zylIAQLQSKf0dSU0AHZ3z25Ng5AAy1p6SjqCyZMto51wzDQAQl2Dp70i8gB6dBpZIxwFApfa0dASNJD4BdHRywDQAIJjES39HFhNAx2w+mAkAeJJF3Z+V0QQw6+iCIJ1vuAKIX3tGOgL3cpwAOuayxUwAoLYM6/6sfCeAObP565GMAkBK2tIBhKBhApg1m1FmAgBdqaj7s1RNALPm55jJAFBOV9GfT+cEMJ/e3ANQjhukAKDU/wM/eXf9VeTFRAAAAABJRU5ErkJggg==';
const ICON_512_MASKABLE_B64 = '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';
const ICON_APPLE_180_B64 = 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAML0lEQVR4nO2d+XMUxxXHe1crZCRxBaODEEPlqFSlKrqVO5XLt8Hc933GqcoP+WMS24ABcxkjfIDBR5y7ckuri1TFlbgSg6GsA4gRIIGunfywq5meme6Z7pmemdbq+6n3g+h5r+c7/d68ObSLUhULlpGIWbymI+pdzEw+eaM10vlTERVH7eq/RzEt4NH35teVz6m4OGpX/03hbCAAfW9+Q9VUaoqjdtVfw08C1NJ3/pshZwhbHLWr/hJSAYiUvvPfChwbqjhqV/45cCyIjb4L3w4WGLA4alf+Kdj+QFL0XfiObEiQ4qh59o+yIUAH+t/6rpS/XHHUPPsHOTlAP/rf+p6gp0Rx1Kz4fTA1QDf6L35fxE20OGpW/C6MGqAb/Rd/4OsjVBw1y3+rQA7QjP5LP/R28C+OmuW/USYHaEb/pR95bPUpjprlv1YsB2hG/6VHeZu8iqP6mV9FIgdoxsDbjzHHucVR/cz7EcoBmjHw9uPuwQzX3chFqAVMB9ido/rpd2NXAhJm4J2nHCOM4qh+6p2Y5ADNGHj3afqfzMuKEY8UoDnOzlH95KWElAAtGHhvufmzrTiqnryYgBygGYPvrcj/YL+sGLigAAurc1Q9cSFRJUAjBn+5ktg7B15sABtUceCaAuwULitVj7+etBKgF4Pvr53qHGgbwEWhOAy8+AIuUhULli16tC1pGUBH8p0DbQMwyBCCGw7AJt858IYDMEgtW4vvuwI2GdxwAB4ZPMQCHhncjQIeuKwALugcgAs6B+CSwfdTAA90DsAlY+CeA3BA5wBc8LQCuKBzAC4oDsAFj7KACzoH4IJHWcAFnQNwwaMs4ILOAbigcwAu07hzfPXnlx0j//hpXSJKHGgrTJbies+h7bFoK8yTovqAsbbHoq0wb6brZaXuF/9kDSd/LNoKC0Bx3ZBqeyzaCvMkTYgx7azu+Q+YB1P3/AcQptBSS544E2XxqafuhX95O1z+yZfjUeJAW2GBmWadwzcBpJAkCFNgxXXPMUXdC/++/NyXklbBYlqtdsaYPv//Qv2L/xF3jvO4xIXVvfhh73NfiFSMQlKffexE0hqEqD/4X9mQ3h9/PgolDrQVFp7pcc8RIAGkkLYZKkyJpYlhaG71Bz+iV7b3wDKPdXdsrT/40QwUpsqmReegl3hp/aErHjmoP3Sl98BSx4iewpJeVX/TvTjqD12lEvCIIyUcjN4Dj0SdhvDC6g9dTXx5vU3ry0r9oY/ta2sQQyAHhkEMo3f/56g0fKyPMHpAuTC1lk5eAsfqD1+j17Fn/xJ6sGf/El4K6g9fy8/AHExcmMNBoTDlliZGTkNrOHzdloB9iwubrLPQ8zWGkSNGrmffYnqs4fD1IhYWhWl7z0EnoJY17t3GC/49+2ptaXjpEz2FJb3abNPxnqPhpT4rAXtr3OOFQRc9e2umiqDPjDIHp7KgozB6XB/TrnM0HOnnn1KOQTduH4MQo2dvtZWGI/36CKM9AguLzvTqHA1HBuj16tlTZXOwltf+T3rc4eOOJaThyIAmwnr2VIUUFqnp1jnoBCyynbhHB13jjCT07FlUWOijg3S4Oc7cqo+wpNffZmlDGxqO3jBXqHv3w46t1InnHHFscnvm6d79sL0+bmgoTFxVDOjSORqP3fQ7gdybGFngeBase/dCv70kI4x2bTx2M/F05C1NSC5xazx2i16d7t0LeA72TW5yhOS6dy+YWuVb7n2ZW3kOiQijVYkIi8eSvyFtPPapLQG75jPcrFOOfY/p3Mr0ZwU2HvtUE2Hdu+YLCovNdLis0AmY5+fDDnRtZfoXrHvXPFsaXr6tp7Ck85L0o2zjy0NWAnbO9fZxOjBSMHUW7pw7lfgh5pymA89NB2E8n9gsyc7RePyO2InCc2AkQfAcJcTo3jmHF5usMDqs8fidBBOU2KNs4/G79Cp07ajkeVpryRlnOvCiaLp2VFJpuKuJMFoVLSx+EuwcdAIqxDzVnqDOSZpO3NNEWNeOCn54fJbMPUfTiWErAdvLRTwZbowUWFu7tpdPpXzYY37TzXLWT5i3Z3SWwHuOppMj9pXz9vdwcyMea1nX9odYUyUvjI5vOjkSf6bi7hxNJx/Qx9y1rcwnxMRjE8/HI9Zxmm4rc8ykgzCHqqaTD2JOVqz3HE2nRu0JmCXoz/FkJMF25d42q7Csp0alhLmnSkqY6Snor9ZiviGlK6NUxt9nNr6bULLdEzWdGtNDmNG1rdRvqqgsvkfZplPj5vF1bs2IhFjr4bnVw817Brcwe32MJyvMpHNrRkSVcmLqHM2nJ2TL3wzp3FoS+ATt3FqS39B8ekJEmOnvERWPMI85hUPCWhw3pM2nJ20J2CK2U+rk8nHw9uRvZQrr3JL2mTN6YW5zqGo+PRlD4uJ5lKUTQOSj/Kf19PTYyhbWuYVKwyuJCGMYrUo8KoxF3jmaX6ESsFk6yivEDfOc22xMpZlICKOgA2MQ5mFmiFRUYIv2nqP5TMqxSMImEsJIguBsvsI6N9saQPOZVDzCZFaGVhWJRfi00nzGdpnMbpoUj7XWTMDH19nhICgsu8l2R9J8Jh21MBGYqiIiqs7R8qrttj+7SeIG24z1i2JkgWnZTYXni5ZXS6SEmYFmeHTCxNeHpSqazhHVFYtOwMbxgLHCu/D3ZyEiLLuR9RYkCmEyS+RUFU0SI+kcLWetl3rZjd6vGr3PPEE3EX93ZYgLk9pRYGFyq5TdOGZGtpwVed0sbeo7R8vZWfZlCRie3TCq8ATNbnD99kT8NJWNDSSs5ews6dWmCBLuZ4rfc7S02X6RmN1wX34SE3FP/5CQwrIb7tsy0VamSpjkIYdRJW0qLystbbPtCRgJNI91uqnq3qqF+coTFSZ/yE7LbrB9OKalbbbChKp8EKJVdqwfDjBDS1u5eDgjA2KeLW3lgYWJTCIuLE/H+uHAwuhwkX1JoaxztJ6zPvbYsf5e0HmkziFGFryFSc7vvS/Seo73CdMAuwsszCDE6Fh/T0CVtKm5IW09V2lfiqBTSc3ASIGfsMAKp+hYZ/tseuu5ymDCQh2432qwVcmbgs7R+prtCyAd6wJ+1cKcR3gGRhK8hXWsK3whpfW1OYGFmZPwp/IRxjj1AwljzhByHtpUdA46AWtDfElL9uxhpEBAmOxeWCEda4foyaWFKTl8l/mokrfUosafMQ5GmNbX55s/d6y97e0A1OK74EwHcUL9V5POxDPdQHT4LXjr6/ND/VeTYfpO+xrrv69oX3OL6RP7gs0gAidF0MLec7SvvkkIaV990/9SCpQTOClipuDvyravvuHvBCKBmzslSZmuf3QYEEKizl3kfwCwfdWAv1NkfO18tbgMcWepaacvM6dzSB2muHMxr15x/ulQBlKHKe5c1Ks3nf50aBikDlPcubhXD50jnHNRrx7uOUI6F/PqoXOEcy7q1UPnCOlczKuXWviVXUlrAJoyczoHkCaDX5wCHhl85ALwwGUFcJkxj7JAHnQOwAWdA3BB5wBcMgY6B+CAzgG44D0H4ILOAbigOAAXPMoCLugcgAseZQEXdA7ABY+ygAs6B+CCpxXABZ0DcEHnAFzwAWPABZcVwCUzMfRhZu4Xk5YBdCT/p47xqgMwyBBS5N8GBoHJdw4UB2CQIYRM3L2SqVyatBKgFxP3ruY7B8EDLXBTKA7cdgA3heKYHL5WUrEkWSlAHyaHrxOrcxA0D+CEKg687QB2rOKYHOkrKa9JUArQhMmR/vwPGdswriyAwlYck/cH0rOrkpICdCB3f9D8OePeln5oUbx6gC7kHtj+SouzOAgheJsO8jCKI/fgZrpsYfxSQLLkRm85Rpidg+RGb6XLPhO9HqALudH/uQfZxUEIwfdZALc4cmO307PmxSkFJEVubIg5zu8chOTGhlKlc6PRA3TBGL/D2+RVHPnIVOkc1XqALhjjdz22+hRHPj5VWqlOD9AFY/yet4N/ceRnSWUqVOgBumBMDPv6CBVHfq5UpjycHqALxsSIiJtoceRnTJXMDqoH6IIxeV/QU6I4zHlTJWXSioAGGJOjUv5yxWHtIz0rQCBIktyYbESQ4rD2lC4NGA7iJDceLC5ocZh7TYWbAUSNMRE4NHRq8/tOlYSdByjHmAw5gaLz3tKRVjMhCI6y35gqvyiYylKqZwbeqP+I1v8BAX0Yx0MxpugAAAAASUVORK5CYII=';
const ICON_FAVICON_32_B64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAB1UlEQVR4nL1Wz0sCQRh9Y2uHDCEjsoLwHJS4i3TpFJ0iiCIEIQqRunXpX+kSHhIi2IsEQtCtU5fyV9GxU0I/DtUhEnRtdzqMjYO7rpZOj+/whvf5vp03qyPxjYQgYHI9h57xdBrlnPABE6uXvVuLeM4uNAcEVy76687wcrZIfCOh8eVzGe4MCgBqGvIGkFCsD6fqAgVmTe4AaknMB4Ai9QDYgA4RzR6UANztRX4lCQO6i8ilzd1BgWtEc4f3DWZrc5FEkKmlo3ZaOFUWl7e7091ILfBQ03CscKp8kwzyvptkMJwqd5Ts5XwGkfR7KREAmhK1jFIiEEm/AGgnlRIBxx3U7AWAmrVI+r245eMj+fvWTnK08sAyWko9rhQ3vWA7E/fHuZNU3PSqxxW7W+sXTdNJIU5/EiDUNADCJPWkXohTAJpeR+MnkvzsyQBQiEPTGz3OEWk6yceqLVzs5gEyzkg+VtV0wiSRsyJj6j7ri2b8uY2PaMZvP6hfgZnkNj7YshnR9dprj9YM1DREKzI6u9PNx+azU1erj5zwZUeQ0Zntvz1pl/iP+0D2jSb9wpEdkfRL/+vzYWBoQuIASP7jpQCwam/EOyzDndY/Fc7gGeyzvWUA+AYzootoOweTXwAAAABJRU5ErkJggg==';

function iconBytes(b64) {
  const binStr = atob(b64);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
  return bytes;
}

const MANIFEST = {
  name: 'Prompt Bridge',
  short_name: 'Bridge',
  description: 'A private, cross-device clipboard and chat-thread manager for AI prompts.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0B1120',
  theme_color: '#0B1120',
  orientation: 'portrait',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
};

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
        output += `- [\${id}] \${firstMsg.substring(0, 40).replace(/\\n/g, ' ')}\\n`;
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

    return new Response(`Success! Chat ID: \${targetId}\\n`, { status: 201, headers: textPlain });
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

    let output = `=== Chat \${chatId} ===\\n\\n`;
    chat.messages.forEach(msg => {
      const prefix = msg.role === 'user' ? '[PROMPT]' : '[AI RESULT]';
      output += `\${prefix}:\\n\${msg.text}\\n\\n---\\n\\n`;
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

    // --- PWA static assets (public, no auth required) ---
    if (path === '/manifest.json' && request.method === 'GET') {
      return Response.json(MANIFEST, { headers: { 'Content-Type': 'application/manifest+json' } });
    }
    if (path === '/sw.js' && request.method === 'GET') {
      return new Response(SW_JS, { headers: { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-cache' } });
    }
    if (path === '/icon-192.png' && request.method === 'GET') {
      return new Response(iconBytes(ICON_192_B64), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/icon-512.png' && request.method === 'GET') {
      return new Response(iconBytes(ICON_512_B64), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/icon-512-maskable.png' && request.method === 'GET') {
      return new Response(iconBytes(ICON_512_MASKABLE_B64), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/apple-touch-icon.png' && request.method === 'GET') {
      return new Response(iconBytes(ICON_APPLE_180_B64), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/favicon.png' && request.method === 'GET') {
      return new Response(iconBytes(ICON_FAVICON_32_B64), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
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
