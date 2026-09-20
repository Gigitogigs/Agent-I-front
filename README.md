# Agent-I Frontend

Agent-I is a SaaS-facing frontend designed for business administrators and operators to manage their multi-agent support systems. This platform provides full control over approvals, agent configurations, knowledge base ingestion, conversation monitoring, and analytics.

This project is built using Next.js and interfaces with a backend orchestrator powered by LangGraph, Postgres/pgvector, and Langfuse.

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Core Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide (`lucide-react`)
- **Components:** shadcn/ui (Radix + Tailwind)
- **State Management & Data Fetching:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts

## 💡 Key Features

The frontend architecture consolidates complex operational features into 9 core mental models/pages:

1. **Homepage:** A quick-glance summary of pending approvals, agent stats, system health, and recent escalations.
2. **Onboarding Wizard:** Guided, multi-step flow for connecting backends, choosing global models, and setting up the knowledge base.
3. **Approvals:** "Inbox-style" management of Human-in-the-Loop (HITL) queues with integrated risk badges, SLA timers, and full conversation context.
4. **Conversations:** High-volume, slide-over transcript viewer with inline retrieval citations and approval outcomes.
5. **Knowledge Base:** Drag-and-drop document upload and management, along with an integrated retrieval testing tool.
6. **Agent Stats Dashboard:** Granular Langfuse-backed metrics for resolution rates, latency, guardrail blocks, and fallback rates.
7. **Agent Configuration:** A modular rail+tabs interface for managing LLM models, API keys, prompt overrides, guardrails, and HITL policies per agent (Orchestrator, Retrieval, Action, Escalation).
8. **Settings:** Workspace management, user profile, notifications, and ongoing integration setups.
9. **Authentication:** Secure login and signup flows for operators.

## 🏗️ Architecture & Design

### Visual Design System
The UI adheres to a strict "Swiss design" aesthetic:
- **Typography:** Inter font family.
- **Layout:** Grid-based with sharp corners on structural elements (panels, sidebar) and softened touchpoints (buttons, inputs).
- **Color Palette:** Strictly black, white, and gray. Color is reserved *exclusively* for semantic status badges (Green = Ready/Approved, Amber = Pending/Processing, Red = Failed/Rejected).

### Component Architecture
The application is structured into domain-specific features and generic reusable components based on two primary page templates:
- **List + Detail Template:** Used for *Approvals* and *Conversations* (inbox patterns).
- **Rail + Tabs Template:** Used for *Agent Configuration* and *Settings*.

### File Structure

```text
frontend/
├── app/
│   ├── (auth)/                    # unauthenticated routes, no sidebar shell
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx               # multi-step wizard, own layout (no sidebar)
│   ├── (dashboard)/               # authenticated routes, shares the app shell
│   │   ├── layout.tsx             # sidebar + top bar
│   │   ├── page.tsx               # Homepage "/"
│   │   ├── approvals/
│   │   │   └── page.tsx
│   │   ├── conversations/
│   │   │   └── page.tsx
│   │   ├── knowledge-base/
│   │   │   └── page.tsx
│   │   ├── agent-stats/
│   │   │   └── page.tsx
│   │   ├── agent-config/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── layout.tsx                 # root layout (fonts, providers)
│
├── components/
│   ├── ui/                        # shadcn primitives (button, input, dialog, tabs...)
│   ├── shared/                    # reusable pieces
│   │   ├── status-badge.tsx
│   │   ├── metric-card.tsx
│   │   ├── empty-state.tsx
│   │   ├── save-changes-footer.tsx
│   │   └── sla-countdown.tsx
│   ├── templates/                 # the two repeating page templates
│   │   ├── list-detail/
│   │   │   ├── list-detail-layout.tsx
│   │   │   ├── list-pane.tsx
│   │   │   └── detail-panel.tsx   # or slide-over variant
│   │   └── rail-tabs/
│   │       ├── rail-tabs-layout.tsx
│   │       ├── rail.tsx
│   │       └── tab-bar.tsx
│   └── shell/                     # app shell pieces
│       ├── sidebar.tsx
│       ├── top-bar.tsx
│       ├── workspace-switcher.tsx
│       └── notifications-center.tsx
│
├── features/                      # page-specific logic/components, grouped by domain
│   ├── approvals/
│   │   ├── approval-row.tsx
│   │   ├── approval-detail.tsx
│   │   └── use-approvals.ts       # TanStack Query hooks
│   ├── conversations/
│   ├── knowledge-base/
│   ├── agent-stats/
│   ├── agent-config/
│   └── settings/
│
├── lib/
│   ├── api-client.ts              # FastAPI client setup
│   ├── query-client.ts            # TanStack Query config
│   └── utils.ts
│
├── hooks/
│   └── use-websocket.ts           # real-time approvals updates
│
└── types/
    └── (shared TS types/interfaces, mirroring backend Pydantic schemas)
```

## 📖 Additional Documentation

For a detailed breakdown of the internal frontend specifications, design decisions, and component breakdown, please refer to the internal [`Frontend-Architecture.md`](./Frontend-Architecture.md) documentation.