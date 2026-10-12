# Public website assistant

The public widget posts to `POST /api/chat`. Express calls the OpenAI Responses
API from the server, using `OPENAI_API_KEY`; the browser never receives the key.
The endpoint sends `store: false`, limits responses to 450 tokens, times out
after 20 seconds, and returns a generic error when the provider is unavailable.

To enable it, set `OPENAI_API_KEY` in the backend process environment or in the
backend's untracked `.env` file, optionally set `OPENAI_MODEL`, then restart
Express. `backend/.env.example` lists the chatbot settings. Do not add the key
to frontend variables, `site_settings`, or the admin settings screen. Without a
key, the widget remains visible and gives visitors a contact fallback.

The admin console's **Chat knowledge base** view creates, edits, publishes,
unpublishes, and deletes entries. The companion Django admin also exposes the
same Express-created SQLite table. Express creates this table at startup; start
Express once before opening the Django knowledge-base section. No Django
migration is required because the model is unmanaged, like the other shared
content models.

Only published entry titles, product labels, keywords, and answer bodies can
enter retrieval. Private source notes and drafts are excluded. The public API
does not provide knowledge-base list or CRUD routes. Chat accepts at most eight
messages, bounds visitor and assistant text, retrieves from recent visitor
turns, includes the canonical public product summaries, and does not persist
conversation history. The process enforces 10 requests per client per minute,
60 total chat requests per minute, and four simultaneous provider calls. These
counters are in-memory and apply to each Express process; keep an edge rate
limit in front of the API when running multiple instances.

When using a reverse proxy, set `TRUST_PROXY_HOPS` only to the number of known,
trusted hops in front of Express. The default is 0, which leaves Express's
forwarded-IP headers untrusted. For example, use `1` only when one trusted
proxy reliably strips and rewrites incoming forwarding headers.

The assistant is grounded in the public product catalog and approved snippets.
It is instructed to avoid pricing, availability, guarantees, and engineering
advice unless supported by the references, and to direct visitors to the KDT
contact form when it cannot confirm an answer. Review published entries before
making claims available to public visitors.
