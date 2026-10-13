import '../styles/chatbot.css';
import { API_BASE } from '../utils/auth.js';

const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_LENGTH = 4500;

function appendMessage(log, role, content) {
  const message = document.createElement('div');
  message.className = `kdt-chat-message is-${role}`;
  message.textContent = content;
  log.append(message);
  log.scrollTop = log.scrollHeight;
}

export function initPublicChat() {
  if (document.getElementById('kdt-public-chat')) return;

  const root = document.createElement('div');
  root.id = 'kdt-public-chat';
  root.innerHTML = `
    <button class="kdt-chat-launcher" type="button" aria-label="Ask KDT, open chat" title="Ask KDT" aria-expanded="false" aria-controls="kdt-chat-panel">
      <svg class="kdt-chat-launcher-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8.2 8.2 0 0 1-3.7-.9L4 19l.9-4.1A7.5 7.5 0 1 1 20 11.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.2" />
      </svg>
    </button>
    <section id="kdt-chat-panel" class="kdt-chat-panel" role="dialog" aria-labelledby="kdt-chat-title" aria-modal="false" hidden>
      <header class="kdt-chat-header">
        <div><strong id="kdt-chat-title">KDT assistant</strong><span>Questions about KDT products</span></div>
        <button class="kdt-chat-close" type="button" aria-label="Close chat">×</button>
      </header>
      <div class="kdt-chat-log" role="log" aria-live="polite" aria-relevant="additions text">
        <p class="kdt-chat-intro">Ask about KDT products, workflows, or a demo.</p>
      </div>
      <p class="kdt-chat-status" aria-live="polite"></p>
      <form class="kdt-chat-form">
        <label class="sr-only" for="kdt-chat-input">Your question</label>
        <textarea id="kdt-chat-input" name="question" rows="2" maxlength="1200" placeholder="What would you like to know?" required></textarea>
        <button type="submit">Send</button>
      </form>
      <p class="kdt-chat-disclosure">Avoid sharing sensitive information. Messages are sent to OpenAI to generate replies.</p>
    </section>
  `;
  document.body.append(root);

  const launcher = root.querySelector('.kdt-chat-launcher');
  const panel = root.querySelector('.kdt-chat-panel');
  const closeButton = root.querySelector('.kdt-chat-close');
  const form = root.querySelector('.kdt-chat-form');
  const input = root.querySelector('#kdt-chat-input');
  const sendButton = form.querySelector('button[type="submit"]');
  const status = root.querySelector('.kdt-chat-status');
  const log = root.querySelector('.kdt-chat-log');
  const messages = [];

  function trimHistory() {
    while (messages.length > MAX_MESSAGES || messages.reduce((total, message) => total + message.content.length, 0) > MAX_HISTORY_LENGTH) {
      messages.shift();
    }
  }

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else launcher.focus();
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = input.value.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!question || sendButton.disabled) return;

    const userMessage = { role: 'user', content: question };
    messages.push(userMessage);
    trimHistory();
    appendMessage(log, 'user', question);
    input.value = '';
    sendButton.disabled = true;
    status.textContent = 'Thinking…';

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The assistant is unavailable.');
      const answer = typeof data.answer === 'string' ? data.answer.trim() : '';
      if (!answer) throw new Error('The assistant could not prepare a reply.');
      messages.push({ role: 'assistant', content: answer.slice(0, 3500) });
      trimHistory();
      appendMessage(log, 'assistant', answer);
      status.textContent = '';
    } catch (error) {
      status.textContent = error.message || 'The assistant is unavailable. Please contact the KDT team.';
    } finally {
      sendButton.disabled = false;
      if (!panel.hidden) input.focus();
    }
  });
}
