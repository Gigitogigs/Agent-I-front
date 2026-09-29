# Agent-I Frontend

Agent-I is a SaaS-facing admin dashboard for business operators managing a multi-agent customer support system. It provides real-time HITL approval queues, conversation monitoring, knowledge base management, agent configuration, and workspace analytics.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server (defaults to `http://localhost:3000`):

```bash
npm run dev
```

The backend API must be running separately. Set the base URL via the `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:8000`).

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Vanilla CSS (custom design tokens via CSS variables) |
| Icons | Lucide React |
| Server State | TanStack Query v5 |
| HTTP Client | Axios (via `lib/api-client.ts`) |
| Charts | Recharts |

## Authentication

Auth is custom-built — **`next-auth` is not used**.

- Login issues a short-lived **Bearer access token** (stored in `sessionStorage`) and an HttpOnly **refresh token cookie** (managed by the browser).
- `lib/api-client.ts` injects the Bearer token on every request and silently rotates it via `/auth/refresh` on 401.
- `middleware.ts` protects all `/(dashboard)/*` routes by checking for the presence of the `refresh_token` cookie. Unauthenticated requests are redirected to `/login`.

## Key Features

1. **Homepage** — Quick-glance metrics: pending approvals, agent stats, system health.
2. **Approvals** — Inbox-style HITL queue with risk badges, SLA countdowns, and approve/reject with mandatory reason.
3. **Conversations** — Searchable transcript viewer with inline retrieval citations.
4. **Knowledge Base** — Document upload/management with retrieval testing.
5. **Agent Stats** — Langfuse-backed resolution rate, latency, guardrail block, and fallback metrics.
6. **Agent Configuration** — Per-agent LLM model selection, API key management, prompt overrides, and HITL policies.
7. **Team & Roles** — Member invite, role assignment (owner/admin/operator).
8. **Settings** — Profile, workspace management, account deletion.
9. **Workspace Switcher** — Multi-workspace support; active workspace persisted in `localStorage`.

## Design System

Custom CSS variables in `app/globals.css` drive all theming:
- `--bg-*` / `--fg-*` for backgrounds and foregrounds.
- `--border-hairline` for structural borders.
- `--color-danger` / `--color-warn` / `--color-ok` for semantic status.
- Sharp corners on structural chrome (sidebar, panels); softened corners on interactive elements (buttons, inputs).

## Architecture

```text
autonomi/
├── app/
│   ├── (auth)/             # Login/signup — no sidebar
│   ├── (dashboard)/        # All authenticated routes — shares AppShell
│   └── layout.tsx          # Root layout: fonts, QueryClient, providers
│
├── components/
│   ├── shell/              # Sidebar, TopBar, WorkspaceSwitcher
│   └── shared/             # StatusBadge, MetricCard, SlaCountdown, SaveChangesFooter
│
├── features/               # Domain-scoped components + hooks
│   ├── approvals/
│   ├── agent-config/
│   ├── conversations/
│   ├── knowledge-base/
│   ├── settings/
│   └── stats/
│
├── hooks/                  # use-auth.ts, use-websocket.ts, use-homepage-summary.ts
├── lib/                    # api-client.ts, token-store.ts, providers.tsx, utils.ts
├── middleware.ts            # Route protection
└── types/                  # Shared TS types mirroring backend Pydantic schemas
```

## Additional Documentation

- [`Frontend-Architecture.md`](./Frontend-Architecture.md) — Full design spec and component decisions.
- Backend API source: `../Agent-I/backend/` (FastAPI + SQLAlchemy + Redis).