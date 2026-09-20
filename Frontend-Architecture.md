# Frontend Architecture — Agent-I

Scope: the SaaS-facing frontend for business admins/operators managing their multi-agent
support system (approvals, agent config, KB, conversations, stats, settings). Built in
Next.js. Backend reference: LangGraph orchestrator + subagents, Postgres/pgvector,
Langfuse, MCP adapter layer — see backend architecture docs.

---

## Table of Contents

1. [Full Feature List (v1)](#1-full-feature-list-v1)
2. [Consolidation Principle](#2-consolidation-principle)
3. [Consolidated Page List (17 → 10 pages)](#3-consolidated-page-list-17--10-pages)
4. [UI Elements (not standalone pages)](#4-ui-elements-not-standalone-pages)
5. [Page Templates](#5-page-templates)
6. [Open Items for Next Step](#6-open-items-for-next-step)
7. [Page Designs](#7-page-designs)
   - 7.1 [App Shell](#71-app-shell-persistent-across-all-pages)
   - 7.2 [Homepage](#72-homepage)
   - 7.3 [Login / Signup](#73-login--signup)
   - 7.4 [Approvals](#74-approvals)
   - 7.5 [Conversations](#75-conversations)
   - 7.6 [Knowledge Base](#76-knowledge-base)
   - 7.7 [Agent Stats Dashboard](#77-agent-stats-dashboard)
   - 7.8 [Agent Configuration](#78-agent-configuration)
   - 7.9 [Team & Roles](#79-team--roles)
   - 7.10 [Settings](#710-settings)
   - 7.11 [Onboarding Wizard](#711-onboarding-wizard)
8. [Tech Stack](#8-tech-stack)
9. [Visual Design System](#9-visual-design-system)
10. [Component Architecture](#10-component-architecture)
11. [Suggested File Structure](#11-suggested-file-structure)

---

## 1. Full Feature List (v1)

1. User signup & login (auth)
2. Password reset / email verification
3. Workspace/tenant creation & switching (multi-tenant-ready)
4. Onboarding wizard (connect backend adapter, pick initial models, invite team)
5. Backend/integration connection management (Shopify vs in-house adapter status, credentials)
6. HITL approval queue (list of pending checkpoints, risk badges, SLA timers)
7. Approval detail view (full context, approve/reject, reasoning)
8. Approval history / audit trail
9. Per-agent model selection & swapping
10. API key management (BYO keys per provider)
11. Per-agent prompt/config overrides
12. Tool allowlist view per agent (read-only visibility)
13. Guardrail policy settings (PII rules, refund caps, thresholds)
14. HITL breakpoint settings (expiry behavior, SLA windows per breakpoint type)
15. Knowledge base / document management (upload, status)
16. KB retrieval test tool ("test a query")
17. Conversation/transcript viewer (support-inbox style)
18. Agent stats dashboard (Langfuse-backed summary metrics)
19. Link-out to full Langfuse dashboard
20. Team/role management (admins, operators, read-only)
21. Notification/alert destination settings (email/webhook for SLA/approvals)
22. Billing & plan/usage page
23. Account/profile settings
24. Global search (conversations, tickets, KB docs)
25. Notifications center (in-app alerts — new escalations, SLA breaches)
26. Error/empty/loading states, 404 page
27. Settings landing/navigation hub

---

## 2. Consolidation Principle

A page is a *mental model*, not a 1:1 wrapper around a feature. Where several features
share the same data domain or the same layout pattern (list + detail, or rail + tabs),
they're merged into one page with clear internal navigation, instead of one URL per
feature. This cuts navigation overhead without dropping any functionality.

---

## 3. Consolidated Page List (17 → 10 pages)

### 1. Login / Signup
- User signup & login (#1)
- Password reset / email verification (#2)

### 2. Onboarding Wizard
One-time, multi-step flow, separate from the ongoing Integrations tab in Settings.
- Onboarding wizard (#4)
- Initial backend/integration connection setup (#5, first-run step)

### 3. Approvals
**Pattern: list + detail (inbox-style).** List on the left, filterable by status
(Pending / Approved / Rejected / Expired / All). Detail panel opens in place on the
right — no separate page per approval. "All" filter + detail panel doubles as history.
- HITL approval queue (#6)
- Approval detail view (#7)
- Approval history / audit trail (#8)

### 4. Conversations
**Pattern: list + detail**, same as Approvals.
- Conversation/transcript viewer (#17)

### 5. Knowledge Base
Doc management and retrieval testing live together — test a query against the docs
you just uploaded, in context.
- Document management (#15)
- Retrieval test tool (#16)

### 6. Agent Stats Dashboard
- Langfuse-backed summary metrics (#18)
- Link-out to full Langfuse dashboard (#19)

### 7. Agent Configuration
**Pattern: rail + tabs.** Left rail lists agents (Orchestrator, Retrieval, Action,
Escalation) plus a "Global" entry for system-wide defaults. Selecting an agent shows
tabs across the top:
- **Model & Keys** tab — model selection & swapping (#9), API key management (#10)
- **Prompt & Tools** tab — prompt/config overrides (#11), tool allowlist view (#12)
- **Guardrails** tab — guardrail policy settings (#13)
- **HITL Breakpoints** tab — breakpoint expiry/SLA settings (#14)

The "Global" rail entry holds guardrail defaults and breakpoint expiry policy that
aren't agent-specific.

### 8. Settings
**Pattern: rail + tabs**, same as Agent Configuration.
- **Profile** tab — account/profile settings (#23)
- **Notifications** tab — notification/alert destinations (#21)
- **Billing** tab — billing & plan/usage (#22)
- **Integrations** tab — ongoing backend/integration connection management (#5, post-onboarding)

### 9. Team & Roles
**Pattern: standalone list.** Promoted to its own top-level sidebar page rather than
a Settings tab, since who has access is a distinct, frequently-referenced admin
concern (and now governs workspace deletion) rather than a background setting.
- Team/role management (#20)

### 10. Homepage
Landing page after login — surfaces the most important info from the other pages
(pending approvals, agent stats snapshot, system health, recent conversations) as a
quick-glance summary, each widget linking out to its full page. Not tied to a single
numbered feature — added after the initial feature list as a cross-cutting summary
page.

---

## 4. UI Elements (not standalone pages)

These live inside the pages above rather than getting their own URL:
- **Workspace switcher** — nav element, supports #3
- **Global search** — overlay/command palette, supports #24
- **Notifications center** — nav dropdown/panel, supports #25
- **Error / empty / loading / 404 states** — shared components across all pages, supports #26

---

## 5. Page Templates

Consolidation reveals that most of the 10 pages reduce to **two repeating templates**:

| Template | Used by |
|---|---|
| **List + Detail** (inbox pattern) | Approvals, Conversations |
| **Rail + Tabs** (config pattern) | Agent Configuration, Settings |
| Standalone | Login/Signup, Onboarding Wizard, Knowledge Base, Agent Stats Dashboard, Homepage, Team & Roles |

Building these two templates well early pays off across 4 of the 10 pages.

---

## 6. Open Items for Next Step

- Lock v1 shipping scope (which of the 10 pages ship first — Approvals was the stated
  starting point)
- Page-level layout/design for each of the 10 pages
- Decide order: Approvals → Agent Configuration → Agent Stats → rest

---

## 7. Page Designs

### 7.1 App Shell (persistent across all pages)

The shell wraps every page except Login/Signup: sidebar (nav) + top bar (cross-cutting
actions). This is the skeleton the rest of the frontend inherits.

**Decisions:**
- **Left sidebar** for navigation (scales better than a top nav given 8 top-level
  destinations, and doesn't collide with the rail+tabs pattern used inside Agent
  Configuration and Settings)
- **Sidebar is collapsible** — for small screens/users who want more horizontal room
- **Top bar** holds cross-cutting actions only: global search, notifications, account
  avatar — kept separate from nav so the sidebar's job stays purely navigational

**Sidebar contents, top to bottom:**
- Workspace switcher (pinned top — multi-tenant context first)
- Nav items: Home, Approvals, Conversations, Knowledge Base, Agent Stats, Agent
  Configuration, Team & Roles, Settings
- User/account menu + logout (pinned bottom)
- Collapse toggle (collapses to icon-only rail; workspace switcher and nav items
  shrink to icons, labels appear on hover)

**Top bar contents, left to right:** global search, then (right-aligned) notifications
bell, account avatar.

### 7.2 Homepage

**Route:** `/` (or `/home`)

**Purpose:** quick contact point to the most important features + a glance at
metrics — not a replacement for any of the other 9 pages, just a fast summary with
links out to each.

**Decision:** Pending Approvals is the top-priority widget (core business operation),
given full-width top placement. No quick-links widget — sidebar nav already covers
that.

**Widgets, in priority order:**
1. **Pending Approvals** — count of pending, oldest SLA countdown, 2–3 most urgent
   rows, "View all" → Approvals page
2. **Agent Stats snapshot** — headline numbers from Langfuse (resolution rate, active
   conversations, avg latency, guardrail block rate), "View full stats" → Agent Stats
   Dashboard
3. **System Health strip** — backend adapter connection status, any agent in a
   degraded/fallback state, link → Settings → Integrations
4. **Recent Conversations / Escalations** — last few conversations, especially
   escalated ones, link → Conversations

**Layout:**

```
┌────────────┬──────────────────────────────────────────────────────┐
│            │  [Search...]                          🔔    [Avatar] │
│ [Workspace │──────────────────────────────────────────────────────│
│  Switcher] │                                                      │
│            │  Home                                                │
│────────────│                                                      │
│ 🏠 Home    │  ┌────────────────────────────────────────────────┐ │
│ ✅ Approvals│  │  PENDING APPROVALS                    View all →│ │
│ 💬 Convos  │  │  ● 3 pending · oldest: 4m left on SLA           │ │
│ 📚 KB      │  │  ┌──────────────────────────────────────────┐  │ │
│ 📊 Stats   │  │  │ Refund $84 — order #4471    HIGH  4m left │  │ │
│ ⚙️ Agent   │  │  │ Cancel order #4502          MED  12m left │  │ │
│    Config  │  │  │ Address change — #4498      LOW  1h left  │  │ │
│ 🔧 Settings│  │  └──────────────────────────────────────────┘  │ │
│            │  └────────────────────────────────────────────────┘ │
│            │                                                      │
│            │  ┌───────────────────────┐ ┌──────────────────────┐ │
│            │  │ AGENT STATS SNAPSHOT   │ │ SYSTEM HEALTH        │ │
│            │  │ Resolution: 87%        │ │ ● Shopify: connected │ │
│            │  │ Active convos: 12      │ │ ● All agents: healthy│ │
│            │  │ Avg latency: 1.4s      │ │                      │ │
│            │  │ Guardrail blocks: 2    │ │ View integrations →  │ │
│            │  │ View full stats →      │ │                      │ │
│            │  └───────────────────────┘ └──────────────────────┘ │
│            │                                                      │
│            │  ┌────────────────────────────────────────────────┐ │
│            │  │ RECENT CONVERSATIONS / ESCALATIONS   View all → │ │
│            │  │  Customer #221 — escalated: "damaged item"      │ │
│            │  │  Customer #219 — resolved: order status         │ │
│            │  │  Customer #217 — escalated: "refund dispute"    │ │
│            │  └────────────────────────────────────────────────┘ │
│────────────│                                                      │
│ [User /    │                                                      │
│  Logout]   │                                                      │
└────────────┴──────────────────────────────────────────────────────┘
```

**Placement logic:** Pending Approvals gets the full-width top slot — first thing seen,
no scrolling. Agent Stats + System Health share a row below (similar weight, both
"glance and move on"). Recent Conversations/Escalations gets its own full-width row at
the bottom (lowest priority of the four, but still full-width for scannability).

### 7.3 Login / Signup

**Decisions:** Email/password auth only for v1 (no SSO). Login and signup are
**separate routes**, not a toggle on one page.

**Routes**
- `/login`
- `/signup`

**Layout (both pages):** Centered single card on a plain background — no split-screen
hero, no marketing chrome. One column, top to bottom: logo → heading → fields →
primary action → secondary link.

```
┌─────────────────────────────────────────┐
│                                           │
│                 [Logo]                   │
│                                           │
│         Log in to Agent-I                │
│                                           │
│   ┌─────────────────────────────────┐   │
│   │ Email                           │   │
│   └─────────────────────────────────┘   │
│   ┌─────────────────────────────────┐   │
│   │ Password                        │   │
│   └─────────────────────────────────┘   │
│                          Forgot password?│
│                                           │
│   ┌─────────────────────────────────┐   │
│   │           Log in                 │   │
│   └─────────────────────────────────┘   │
│                                           │
│   Don't have an account?  Sign up        │
│                                           │
└─────────────────────────────────────────┘
```

**`/login` fields:** Email, Password. "Forgot password?" inline, right-aligned above
the button (low visual weight, standard placement). Full-width primary button, same
width as inputs. Link below flips to `/signup`.

**`/signup` fields:** Name, Email, Password (confirm-on-blur validation, no separate
confirm field). No workspace name field here — that belongs to the Onboarding Wizard,
right after signup. Link below flips to `/login`.

### 7.4 Approvals

**Route:** `/approvals`

**Components:**
1. **Status filter** (tabs) — Pending / Approved / Rejected / Expired / Cancelled /
   All. "All" + detail panel doubles as the history/audit view.
2. **List (left pane)** — one row per approval: risk badge (HIGH/MED/LOW, derived from
   action type + amount/impact, not raw LLM confidence), action summary, SLA
   countdown (or resolved timestamp for non-pending states), requesting agent,
   relative timestamp.
3. **Detail panel (right pane, opens in place)** — full action parameters, why it was
   flagged, conversation context (collapsed summary sent by the agent in its payload,
   with a link to the full Conversations page), Approve/Reject buttons, required
   reason field on reject. Non-pending items show the same layout read-only, plus
   who approved/rejected and when.
4. **SLA indicator styling** — countdown visually escalates as it nears zero (color
   shift), not just a number.
5. **Bulk actions** — deferred to v2.
6. **Empty state** — "No pending approvals," designed intentionally since it should be
   a common state.

**Layout:**

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│            │  [Search...]                                      🔔    [Avatar]     │
│ [Workspace │──────────────────────────────────────────────────────────────────────│
│  Switcher] │                                                                      │
│            │  Approvals                                                          │
│────────────│                                                                      │
│ 🏠 Home    │  [Pending] [Approved] [Rejected] [Expired] [Cancelled] [All]         │
│ ✅ Approvals│──────────────────────────────────────────────────────────────────────│
│ 💬 Convos  │                        │                                             │
│ 📚 KB      │  ┌──────────────────┐  │  Refund — $84 · Order #4471                 │
│ 📊 Stats   │  │ HIGH  ⏱ 4m left  │  │  ──────────────────────────────────────    │
│ ⚙️ Agent   │  │ Refund $84        │  │  Requested by: Action Agent                 │
│    Config  │  │ Order #4471       │  │  Flagged: refund amount above $50 auto-cap  │
│ 🔧 Settings│  │ Action Agent      │  │                                             │
│            │  │ 2m ago            │  │  Parameters                                 │
│            │  ├──────────────────┤◄─┼─ (selected, highlighted)                    │
│            │  │ MED   ⏱ 12m left │  │  Order ID:   #4471                          │
│            │  │ Cancel order      │  │  Amount:     $84.00                         │
│            │  │ #4502             │  │  Reason:     "item arrived damaged"         │
│            │  │ Action Agent      │  │  Customer:   #221 (Jane K.)                 │
│            │  │ 6m ago            │  │                                             │
│            │  ├──────────────────┤  │  Conversation summary                       │
│            │  │ LOW   ⏱ 1h left  │  │  "Customer reported item damaged on         │
│            │  │ Address change    │  │  arrival, requested refund. Order agent     │
│            │  │ #4498             │  │  confirmed delivery, refund exceeds auto-   │
│            │  │ Action Agent      │  │  approval cap."                             │
│            │  │ 18m ago           │  │                                 View full → │
│            │  ├──────────────────┤  │                                             │
│            │  │ MED   ⏱ 40m left │  │  ┌─────────────┐  ┌─────────────┐          │
│            │  │ Subscription      │  │  │   Approve    │  │   Reject    │          │
│            │  │ downgrade #88     │  │  └─────────────┘  └─────────────┘          │
│            │  │ Action Agent      │  │                                             │
│            │  │ 32m ago           │  │  Reason (required if rejecting)             │
│            │  └──────────────────┘  │  ┌─────────────────────────────────────┐    │
│            │                        │  │                                     │    │
│            │                        │  └─────────────────────────────────────┘    │
│────────────│                        │                                             │
│ [User /    │                                                                      │
│  Logout]   │                                                                      │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

**Placement logic:** Status filter sits directly under the page title — first decision
point before the list itself. List pane is narrower than the detail pane (rows are
compact/scannable; detail pane gets the real estate since decisions happen there).
Selected row is highlighted. Risk badge + SLA countdown lead every row — they drive
triage order. Detail panel reads top-to-bottom in decision order: what it is → why
flagged → parameters → context (summary + link) → action buttons. Reject reason field
only appears/becomes required when Reject is clicked. Resolved rows drop the countdown
in favor of a resolved state/timestamp, same card shape.

### 7.5 Conversations

**Route:** `/conversations`

**Components:**
1. **Status filter** (tabs) — Resolved / Escalated / In Progress / All.
2. **Page-local search** — search within conversations by customer, order ID, or
   transcript keyword (distinct from the global search in the top bar).
3. **List** — thin, single-line/table-style rows (not cards) since volume can be
   high: status badge, customer, one-line summary, agent icons (🔍 Retrieval, ⚡
   Action, 📤 Escalation), timestamp.
4. **Detail — slide-over panel** (opens from the right, ~70% width, list stays
   visible/dimmed behind it) rather than a fixed split-pane — gives the transcript
   room to breathe and keeps the list dense when closed. This is a variant of the
   list+detail template: Approvals uses a fixed split-pane (acting on one item,
   context should stay visible); Conversations uses a slide-over (read-heavy,
   high-volume, benefits from a dense list + focused reading mode).
5. **Transcript** — straight chronological customer ↔ agent turns. No per-turn agent
   attribution tags for now (deferred — agent icons on the list row are enough
   system-level context).
6. **Inline citations** — retrieved sources shown at the point they were used in the
   transcript (tag under the relevant agent turn), not bundled at the end.
7. **Inline approval outcomes** — if the conversation triggered an approval, the
   outcome appears inline at that point in the transcript (e.g. "→ Refund approved
   ($84) ✓"), with a link out to the full Approval record.
8. **Empty state** — "No conversations yet" for a fresh workspace.

**Layout (list view):**

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│            │  [Search...]                                      🔔    [Avatar]     │
│ [Workspace │──────────────────────────────────────────────────────────────────────│
│  Switcher] │                                                                      │
│            │  Conversations                                                      │
│────────────│                                                                      │
│ 🏠 Home    │  [Resolved] [Escalated] [In Progress] [All]                         │
│ ✅ Approvals│  [🔍 Search customer, order ID, or keyword...]                       │
│ 💬 Convos  │──────────────────────────────────────────────────────────────────────│
│ 📚 KB      │  Status       Customer    Summary                 Agents   Time      │
│ 📊 Stats   │──────────────────────────────────────────────────────────────────────│
│ ⚙️ Agent   │  ESCALATED    #221 Jane   "damaged item, refund…" 🔍⚡📤   12m ago    │
│    Config  │──────────────────────────────────────────────────────────────────────│
│ 🔧 Settings│  RESOLVED     #219        "where's my order"      🔍       34m ago    │
│            │──────────────────────────────────────────────────────────────────────│
│            │  IN PROGRESS  #223        "billing question"      🔍       51m ago    │
│            │──────────────────────────────────────────────────────────────────────│
│            │  ESCALATED    #217        "refund dispute"        🔍⚡📤   1h ago     │
│            │──────────────────────────────────────────────────────────────────────│
│            │  RESOLVED     #215        "return policy Q"       🔍       2h ago     │
│            │──────────────────────────────────────────────────────────────────────│
│            │  RESOLVED     #211        "order status"          🔍       3h ago     │
│            │──────────────────────────────────────────────────────────────────────│
│────────────│                                                                      │
│ [User /    │                                                                      │
│  Logout]   │                                                                      │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

**Layout (row clicked — slide-over):**

```
┌──────────────────────┬───────────────────────────────────────────────┐
│  (list, dimmed)       │  Customer #221 · Jane K.              [✕]    │
│                       │  ─────────────────────────────────────────   │
│  ESCALATED  #221 ...  │  Retrieval · Action · Escalation             │
│  RESOLVED   #219 ...  │                                               │
│  ...                  │  Jane: My order arrived damaged, I need a    │
│                       │  refund.                                     │
│                       │                                               │
│                       │  Agent: I'm sorry to hear that. Let me       │
│                       │  check your order details.                  │
│                       │  [🔍 Retrieved: return policy §4.2]          │
│                       │                                               │
│                       │  Agent: I can see order #4471 qualifies      │
│                       │  for a refund. Since it's above our auto-    │
│                       │  approval limit, I've routed this for        │
│                       │  review.                                     │
│                       │                                               │
│                       │  → Refund approved ($84) ✓   View approval → │
│                       │                                               │
│                       │  Agent: Good news — your refund of $84       │
│                       │  has been approved and is on its way.        │
│                       │                                               │
│                       │  Jane: Thank you!                            │
└──────────────────────┴───────────────────────────────────────────────┘
```

### 7.6 Knowledge Base

**Route:** `/knowledge-base`

**Components:**
1. **Upload section** (top, static) — drag-and-drop zone, accepts multiple files at
   once, plus metadata tagging (product line/category) applied at upload time. Placed
   at the top since it's a one-time action per upload and doesn't scale with content,
   unlike the list below it.
2. **File list** (below, grows) — per file: ingestion status (Processing / Ready /
   Failed), tags, size, chunk count, upload date, delete action. Failed rows show an
   inline error reason + Retry action rather than a silent failure state.
3. **Search/filter bar** — scoped to the file list (search by filename, filter by
   status).
4. **Delete confirmation** — lightweight "Are you sure?" before removing a file from
   retrieval entirely.
5. **Retrieval test tool** — separate self-contained module below the list: type a
   question, see which chunks would be retrieved, from which doc, with similarity
   scores. Operates on the whole KB rather than a single file, so it's visually
   distinct from the list.
6. **Empty state** — "No documents yet — upload your first doc" for a fresh
   workspace.

**Layout:**

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│            │  [Search...]                                      🔔    [Avatar]     │
│ [Workspace │──────────────────────────────────────────────────────────────────────│
│  Switcher] │                                                                      │
│            │  Knowledge Base                                                     │
│────────────│                                                                      │
│ 🏠 Home    │  ┌────────────────────────────────────────────────────────────────┐ │
│ ✅ Approvals│  │                                                                │ │
│ 💬 Convos  │  │       ⬆  Drag & drop files here, or click to browse            │ │
│ 📚 KB      │  │          (multiple files supported)                            │ │
│ 📊 Stats   │  │                                                                │ │
│ ⚙️ Agent   │  │  Tag this upload:  Product line [▾]   Category [▾]            │ │
│    Config  │  │                                                                │ │
│ 🔧 Settings│  └────────────────────────────────────────────────────────────────┘ │
│            │──────────────────────────────────────────────────────────────────────│
│            │  [🔍 Search files...]        [All statuses ▾]                       │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Name              Status      Tags         Size   Chunks  Date     │
│            │──────────────────────────────────────────────────────────────────────│
│            │  return-policy.pdf ● Ready     Policy       82 KB  14      2d ago 🗑 │
│            │──────────────────────────────────────────────────────────────────────│
│            │  faq-billing.md    ● Ready     Billing      12 KB  6       2d ago 🗑 │
│            │──────────────────────────────────────────────────────────────────────│
│            │  shipping.docx     ◐ Processing Shipping    45 KB  —       5m ago 🗑 │
│            │──────────────────────────────────────────────────────────────────────│
│            │  old-terms.pdf     ✕ Failed    Policy       120 KB —      1h ago  🗑 │
│            │                    ⚠ Unsupported format — Retry                    │
│            │──────────────────────────────────────────────────────────────────────│
│            │                                                                      │
│            │  ┌────────────────────────────────────────────────────────────────┐ │
│            │  │  Test Retrieval                                                │ │
│            │  │  [Type a question to test against your knowledge base...]     │ │
│            │  │  ┌──────────────────────────────────────────────────────┐ Run │ │
│            │  │  └──────────────────────────────────────────────────────┘     │ │
│            │  │                                                                │ │
│            │  │  Results:                                                     │ │
│            │  │  1. return-policy.pdf (chunk 3) — score 0.91                  │ │
│            │  │     "Items may be returned within 30 days..."                 │ │
│            │  │  2. faq-billing.md (chunk 1) — score 0.74                     │ │
│            │  └────────────────────────────────────────────────────────────────┘ │
│────────────│                                                                      │
│ [User /    │                                                                      │
│  Logout]   │                                                                      │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

**Placement logic:** Upload zone + tagging at the top, static block. Search/filter bar
directly above the list, scoped to it. List leads with status icon (●/◐/✕) since
that's the first thing to notice; tags shown inline for at-a-glance metadata; delete
icon per row. Test Retrieval sits at the bottom as its own bordered, self-contained
module — a separate task from managing files.

### 7.7 Agent Stats Dashboard

**Route:** `/agent-stats`

**Components:**
1. **Time range selector** — 24h / 7d / 30d / Custom, governs every metric on the
   page.
2. **Headline metric cards** — resolution success rate, active/total conversations,
   avg latency (p50/p95/p99), guardrail block rate, model fallback rate, retrieval
   hit-rate. Same numbers as the homepage snapshot, with trend arrows added.
3. **Trend charts** — one metric per chart (resolution rate, latency, guardrail
   blocks, fallback rate) so drift/regressions are visible over time, not just a
   snapshot.
4. **Per-agent breakdown list** — one row per agent (Orchestrator, Retrieval, Action,
   Escalation): calls made, avg latency, fallback %, error %. Ordered to match actual
   request flow.
5. **Cost/token tracking** — deferred to v2 (depends on model harness reporting
   per-agent usage).
6. **Link-out to full Langfuse** — persistent "Open in Langfuse" for trace-level
   debugging beyond this page's scope.

**Layout:**

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│            │  [Search...]                                      🔔    [Avatar]     │
│ [Workspace │──────────────────────────────────────────────────────────────────────│
│  Switcher] │                                                                      │
│            │  Agent Stats                          [24h] [7d] [30d] [Custom ▾]   │
│────────────│                                                                      │
│ 🏠 Home    │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│ ✅ Approvals│  │ Resolution │ │ Active     │ │ Avg        │ │ Guardrail  │            │
│ 💬 Convos  │  │ Rate       │ │ Convos     │ │ Latency    │ │ Block Rate │            │
│ 📚 KB      │  │ 87% ▲2%    │ │ 12         │ │ 1.4s ▼0.2s │ │ 2.1% ▲0.4% │            │
│ 📊 Stats   │  └───────────┘ └───────────┘ └───────────┘ └───────────┘            │
│ ⚙️ Agent   │  ┌───────────┐ ┌───────────┐                                        │
│    Config  │  │ Fallback   │ │ Retrieval  │                                        │
│ 🔧 Settings│  │ Rate       │ │ Hit Rate   │                                        │
│            │  │ 0.8%       │ │ 91%        │                                        │
│            │  └───────────┘ └───────────┘                                        │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Resolution Rate (7d)                                               │
│            │  ╭─────────────────────────────────────────────────────────────╮   │
│            │  │      ___/‾‾‾\___/‾‾‾‾‾‾‾‾‾                                  │   │
│            │  ╰─────────────────────────────────────────────────────────────╯   │
│            │                                                                      │
│            │  Latency (p50/p95/p99, 7d)                                          │
│            │  ╭─────────────────────────────────────────────────────────────╮   │
│            │  │  ‾‾\__/‾‾\___/‾‾\__                                          │   │
│            │  ╰─────────────────────────────────────────────────────────────╯   │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Per-Agent Breakdown                                                │
│            │  Agent          Calls    Avg Latency    Fallback %   Error %        │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Orchestrator   1,204    0.6s           0.2%         0.1%           │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Retrieval      842      1.1s           0.5%         0.8%           │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Action         310      0.9s           0.0%         0.3%           │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Escalation     58       2.0s           1.7%         0.0%           │
│            │──────────────────────────────────────────────────────────────────────│
│            │                                              [Open in Langfuse ↗]   │
│────────────│                                                                      │
│ [User /    │                                                                      │
│  Logout]   │                                                                      │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

**Placement logic:** Time range selector sits top-right of the page header — governs
everything below, visible before any number is read. Headline metric cards come
first, grid layout — the "glance and know if something's wrong" layer. Trend charts
next, one metric per chart, each independently readable. Per-agent breakdown table
after the aggregate view, ordered Orchestrator → Retrieval → Action → Escalation to
match actual request flow. "Open in Langfuse" sits bottom-right, low-emphasis but
always visible — the escape hatch for trace-level depth this page doesn't provide.

### 7.8 Agent Configuration

**Route:** `/agent-config`

**Pattern:** rail (agent list) + tabs (config areas), per the consolidation in
Section 3.

**Rail:** Orchestrator, Retrieval, Action, Escalation, separated by a divider from a
**Global** entry (system-wide guardrail defaults + breakpoint expiry policy not tied
to one agent).

**Tabs (per selected agent):**
1. **Model & Keys** — model provider dropdown (Anthropic/OpenAI/Ollama/etc.), model
   selector scoped to the chosen provider, API key field (masked, with a "test
   connection" action), fallback model option (ties into the Model Router's failover
   design).
2. **Prompt & Tools** — system prompt editor, read-only tool allowlist (chips/list —
   reassurance the agent can't call arbitrary tools), "reset to default prompt"
   action.
3. **Guardrails** — toggles for library-based checks (PII detection, prompt-injection
   screening, toxicity), numeric fields for hand-rolled policy checks (refund cap,
   discount limit — fields shown vary per agent, e.g. refund cap only makes sense on
   Action Agent).
4. **HITL Breakpoints** — per-breakpoint-type row (e.g. "Refund above cap," "Low
   confidence") with expiry behavior dropdown (auto-escalate/auto-reject) and SLA
   window input.

**Layout:**

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│            │  [Search...]                                      🔔    [Avatar]     │
│ [Workspace │──────────────────────────────────────────────────────────────────────│
│  Switcher] │                                                                      │
│            │  Agent Configuration                                                │
│────────────│                                                                      │
│ 🏠 Home    │  ┌──────────┐  [Model & Keys] [Prompt & Tools] [Guardrails] [HITL]   │
│ ✅ Approvals│  │Orchestr. │──────────────────────────────────────────────────────│
│ 💬 Convos  │  │Retrieval │                                                      │
│ 📚 KB      │  │Action ◄──┼─ (selected)                                          │
│ 📊 Stats   │  │Escalation│  Provider        [ Anthropic          ▾]             │
│ ⚙️ Agent   │  │──────────│  Model           [ claude-sonnet-4-6  ▾]             │
│    Config  │  │Global    │  API Key         [ sk-ant-••••••••1234 ]  Test →     │
│ 🔧 Settings│  └──────────┘  Fallback model  [ claude-haiku-4-5    ▾]             │
│            │                                                                      │
│            │                                            [ Save changes ]         │
│            │                                                                      │
│            │                                                                      │
│            │                                                                      │
│            │                                                                      │
│            │                                                                      │
│────────────│                                                                      │
│ [User /    │                                                                      │
│  Logout]   │                                                                      │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

**Placement logic:** Rail sits at the far left of the content area (not the app-wide
sidebar) — picking an agent is a page-local decision, so it gets its own sub-nav.
"Global" is visually separated by a divider since it's policy, not an agent. Tabs sit
directly under the page title, spanning the content pane, not the rail — the rail
decides *which agent*, tabs decide *which aspect*, two independent axes that shouldn't
visually merge. Form fields flow top-to-bottom in fill-out order (provider → model →
key → fallback). A single **Save changes** button, bottom-right, rather than
autosaving — config changes here are consequential enough to want an explicit commit.
Switching tabs keeps the same agent selected; switching agents keeps the same tab
selected.

### 7.9 Team & Roles

**Route:** `/team`

**Pattern:** standalone list — promoted to its own top-level sidebar page (between
Agent Configuration and Settings) rather than a Settings tab, since access
management is a frequently-referenced admin concern, not a background setting — and
it now governs workspace deletion, which needs to be easy to find.

**Roles (kept simple for v1 — expandable later):**
- **Owner** — the person who created the workspace, by default. Full access, plus
  the only role that can delete the workspace or transfer ownership to another
  member. Exactly one per workspace.
- **Admin** — full access (approvals, agent config, billing, team management) except
  cannot delete the workspace.
- **Operator** — can work approvals and conversations; no access to billing, agent
  config, or team management.
- **Read-only** — view-only across dashboards/conversations/stats; cannot approve,
  reject, or change configuration.

**Components:**
1. **Page-local search** — search members by name or email (handles pending invites,
   which may have no name yet).
2. **"+ Invite member"** — primary action, top-right, opens an invite form (email +
   role, editable after they join).
3. **Member table** — name, email, role (editable dropdown for non-Owner rows),
   status (Active/Invited/Pending), last active, `⋮` overflow menu (remove member;
   for the Owner's own row, "Transfer ownership" instead). Owner is always listed
   first with a fixed role label, not a dropdown.
4. **Pending invites** — shown in the same table with a "Pending" status, `—` for
   last active, and a "Resend" action alongside the overflow menu.
5. **Role permissions legend** — read-only reference table at the bottom, showing
   what each role can/can't do, so an Admin knows exactly what they're granting when
   inviting someone.
6. **Remove member** — immediate, no grace period (this revokes access, it doesn't
   destroy workspace data).

**Layout:**

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│            │  [Search...]                                      🔔    [Avatar]     │
│ [Workspace │──────────────────────────────────────────────────────────────────────│
│  Switcher] │                                                                      │
│            │  Team & Roles                                    [ + Invite member ]│
│────────────│                                                                      │
│ 🏠 Home    │  [🔍 Search by name or email...]                                    │
│ ✅ Approvals│──────────────────────────────────────────────────────────────────────│
│ 💬 Convos  │  Name          Email               Role      Status    Last Active   │
│ 📚 KB      │──────────────────────────────────────────────────────────────────────│
│ 📊 Stats   │  Gigito        gigito@example.com  Owner     Active    Just now      │
│ ⚙️ Agent   │──────────────────────────────────────────────────────────────────────│
│    Config  │  Jane K.       jane@example.com     Admin  ▾  Active    2h ago    ⋮   │
│ 👥 Team    │──────────────────────────────────────────────────────────────────────│
│ 🔧 Settings│  Sam O.        sam@example.com      Operator▾ Active    1d ago    ⋮   │
│            │──────────────────────────────────────────────────────────────────────│
│            │  m.wanjiru@... —                    Operator▾ Pending   —   Resend  ⋮│
│            │──────────────────────────────────────────────────────────────────────│
│            │                                                                      │
│            │  Role permissions                                                    │
│            │  ──────────────────────────────────────────────────────────────────  │
│            │  Role        Approvals   Agent Config   Billing   Team   Delete WS   │
│            │──────────────────────────────────────────────────────────────────────│
│            │  Owner       ✓           ✓              ✓         ✓      ✓          │
│            │  Admin       ✓           ✓              ✓         ✓      —          │
│            │  Operator    ✓           —              —         —      —          │
│            │  Read-only   view only   —              —         —      —          │
│            │──────────────────────────────────────────────────────────────────────│
│────────────│                                                                      │
│ [User /    │                                                                      │
│  Logout]   │                                                                      │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

**Placement logic:** New sidebar entry ("👥 Team"), sitting between Agent
Configuration and Settings — grouped near the other admin-facing pages rather than
up near Home/Approvals, since it's an occasional-use admin task, not daily-driver
content. Page-local search sits directly under the page title, same convention as
Conversations. "+ Invite member" is top-right, the primary action, same placement
convention as other primary actions across the app. Owner is pinned first in the
table with no role dropdown — Owner isn't a selectable role, it's a fixed status of
who created the workspace. Pending invites show `—` for last active and a "Resend"
action instead of prominent role editing. The role permissions legend at the bottom
directly encodes the rule that only Owner can delete the workspace — Admin cannot.
Transfer ownership lives in the Owner's own row's `⋮` menu, visible only to the
current Owner, since it's their action to give up.

### 7.10 Settings

**Route:** `/settings`

**Pattern:** rail (sections) + tabs, same shape as Agent Configuration — consistent
visual language, different content axis (sections instead of agents).

**Rail:** Profile, Notifications, Billing, Integrations. *(Team & Roles lives on its
own sidebar page — Section 7.9 — rather than as a tab here.)*

**Sections:**
1. **Profile** — avatar (with change photo), name, email, password change,
   timezone/locale, log out action, and a workspace-deletion action at the bottom
   (plain divided section, not a callout — destructive but not alarm-styled). Visible
   only to the Owner, per the Team & Roles permissions (Section 7.9) — Admins cannot
   delete the workspace. Default/first tab (least consequential, safest landing spot).

   **Deletion sequence:**
   1. Owner clicks "Delete workspace" — opens a modal listing what will be lost
      (data, agents, config, billing cancellation) and flags any active state
      (pending approvals, active subscription).
   2. **Password re-entry** to confirm (single confirmation step — no separate
      type-to-confirm field).
   3. Workspace is marked for deletion with a **24–48hr grace period** — restorable
      by the Owner logging back in and cancelling the deletion within that window.
   4. Confirmation email sent to the Owner; Owner is logged out immediately.
   5. Other members (Admin/Operator/Read-only) are **not notified in advance** — if
      they try to log in during the grace period, they see a message that the
      workspace has been scheduled for deletion by the Owner, instead of the normal
      dashboard.
   6. Permanent deletion runs via a background job once the grace period lapses (or
      immediately if the Owner cancels — the workspace and all member access is
      restored to normal).
2. **Notifications** — connected channels (list view: channel, destination, status,
   actions) and available channels to connect (list view), plus webhook URL and
   per-event toggles for which events trigger a notification (new escalation, SLA
   breach, approval expired, guardrail block).
3. **Billing** — current plan + usage, payment methods (card, PayPal, M-Pesa, bank
   transfer for enterprise), billing address/VAT, promo code, and invoice history
   with downloadable PDFs.
4. **Integrations** — connected connectors (list view: connector, status, last sync,
   actions) and available premade connectors to browse/search (list view, grouped by
   category, e.g. E-commerce, Support/CRM) — this is the customer-facing catalog of
   the MCP adapters built for the product — plus a separate "Add custom connector"
   option for backends without a premade adapter. Same underlying data the
   Onboarding Wizard sets up initially, just the ongoing management view.

**Layout (Profile):**

```
┌──────────────┐  Profile
│ Profile   ◄──┼─ (selected)
│ Notifications│  ──────────────────────────────────────────────────
│ Billing      │
│ Integrations │   ┌────────┐
└──────────────┘   │ [Avatar]│  Change photo
                    └────────┘

                    Name          [ Gigito                    ]
                    Email         [ gigito@example.com        ]
                    Password      [ Change password → ]
                    Timezone      [ Africa/Nairobi         ▾]

                                            [ Save changes ]

                    ──────────────────────────────────────────────
                    [ Log out ]

                    ──────────────────────────────────────────────
                    Deleting your workspace is permanent and cannot
                    be undone after the 48hr grace period. All
                    workspace data will be removed. (Owner only)

                    [ Delete workspace ]  (red, opens confirm modal)
```

**Layout (Billing):**

```
┌──────────────┐  Billing
│ Profile      │  ──────────────────────────────────────────────────
│ Notifications│
│ Billing   ◄──┼─ (selected)   Current Plan: Pro — $49/mo
│ Integrations │                Usage: 1,204 / 5,000 conversations
└──────────────┘                [ Upgrade plan ]  [ Cancel plan ]

                    Payment Method
                    ● Card ending 4417        [ Edit ]
                    ○ Add PayPal
                    ○ Add M-Pesa
                    ○ Add bank transfer (enterprise)

                    Billing Details
                    Billing address  [ .......................... ]
                    Tax ID / VAT     [ .......................... ]
                    Promo code       [ ...................... ] [Apply]

                    Invoice History
                    ──────────────────────────────────────────────
                    Sep 2026   $49.00   Paid    [ Download PDF ]
                    Aug 2026   $49.00   Paid    [ Download PDF ]
                    Jul 2026   $49.00   Paid    [ Download PDF ]
```

**Layout (Integrations):**

```
┌──────────────┐  Integrations
│ Profile      │  ──────────────────────────────────────────────────
│ Notifications│
│ Billing      │  My Connectors
│ Integrations │──────────────────────────────────────────────────────
└──────────────┘  Connector      Status        Last Sync    Actions
                  ──────────────────────────────────────────────────
                  🛍 Shopify      ● Connected   5m ago       Manage
                  ──────────────────────────────────────────────────
                  🏢 Custom       ● Connected   2h ago       Manage
                  (in-house)
                  ──────────────────────────────────────────────────

                  Available Connectors
                  [🔍 Search connectors...]
                  ──────────────────────────────────────────────────
                  Connector          Category      Action
                  ──────────────────────────────────────────────────
                  WooCommerce        E-commerce    [ Connect ]
                  ──────────────────────────────────────────────────
                  Magento            E-commerce    [ Connect ]
                  ──────────────────────────────────────────────────
                  BigCommerce        E-commerce    [ Connect ]
                  ──────────────────────────────────────────────────
                  Wix                E-commerce    [ Connect ]
                  ──────────────────────────────────────────────────
                  Zendesk            Support/CRM   [ Connect ]
                  ──────────────────────────────────────────────────
                  Salesforce         Support/CRM   [ Connect ]
                  ──────────────────────────────────────────────────

                  Don't see your platform?
                  [ + Add custom connector ]
```

**Layout (Notifications):**

```
┌──────────────┐  Notifications
│ Profile      │  ──────────────────────────────────────────────────
│ Notifications◄┼─ (selected)
│ Billing      │  Connected Channels
│ Integrations │──────────────────────────────────────────────────────
└──────────────┘  Channel       Destination            Status      Actions
                  ──────────────────────────────────────────────────
                  💬 Slack       #support-alerts        ● Connected  Manage
                  ──────────────────────────────────────────────────
                  ✉️ Email       ops@yourco.com          ● Connected  Manage
                  ──────────────────────────────────────────────────

                  Available Channels
                  ──────────────────────────────────────────────────
                  Channel            Action
                  ──────────────────────────────────────────────────
                  Microsoft Teams    [ Connect ]
                  ──────────────────────────────────────────────────
                  Discord            [ Connect ]
                  ──────────────────────────────────────────────────
                  WhatsApp           [ Connect ]
                  ──────────────────────────────────────────────────
                  Telegram           [ Connect ]
                  ──────────────────────────────────────────────────

                  ──────────────────────────────────────────────
                  Webhook
                  URL   [ .......................................... ]

                  Notify me when:
                  ☑ New escalation        ☑ SLA breach
                  ☑ Approval expired      ☐ Guardrail block

                  [ Save changes ]
```

**Placement logic:** Same rail+tabs shape as Agent Configuration, but the rail here is
*sections* rather than *agents*. **Profile** leads with the avatar (most visually
identifying element), keeps the existing field order, then Log Out as a clear
secondary action below Save Changes, and workspace deletion as its own divided
section at the very bottom — separated from routine actions but not styled as an
alarm, gated to the Owner role, and requiring password re-entry plus a 24–48hr grace
period since it's irreversible after that window (full sequence above). **Billing**
puts plan/usage up top for an at-a-glance read, payment methods as selectable options
rather than a single field (a buyer may add more than one over time), and invoice
history as a scrollable table since that's what accounting teams return to
repeatedly. **Integrations** and **Notifications** share a "connected / available"
list pattern instead of cards — thin table rows (matching the Knowledge Base file
list) scale to dozens of premade connectors/channels without turning into a wall of
boxes; a search bar and category column help users scan the larger Available
Connectors list, while the shorter Available Channels list doesn't need one. Webhook
and event toggles stay their own section beneath the channel lists.

### 7.11 Onboarding Wizard

**Route:** `/onboarding` (one-time flow, run right after signup; not a persistent
sidebar destination)

**Purpose:** guided, multi-step setup that runs once after signup, so a new workspace
doesn't land on an empty dashboard with no clear next step. Each step maps to a
decision the backend needs before the product is meaningfully usable — but every step
is skippable, so someone can explore or finish setup later. Skipped steps just leave
the corresponding persistent page (Integrations, Agent Configuration, Knowledge Base,
Settings) in its natural "not configured yet" state.

**Steps:**
1. **Workspace basics** (name your workspace) — *Important*
2. **Connect your backend** (choose Shopify or in-house adapter, enter credentials)
   — *Important*
3. **Global model configuration** (pick one provider + model + API key, applied to
   all 4 agents by default — editable per-agent later in Agent Configuration) —
   *Important*
4. **Upload initial knowledge base docs** (optional starter docs for the Retrieval
   Agent) — *Optional*
5. **Invite your team** (add teammates by email) — *Optional*
6. **Review & finish** (summary of what's set up, "Go to Dashboard" button) —
   *Important (trivial — confirms and exits, not asking for input)*

"Important" describes what's needed for a fully working system, not what's enforced
by the UI — every step has Skip + Next, none are blocking.

**Layout:**

```
┌───────────────────────────────────────────────────────────┐
│                                                             │
│                       [Logo]                               │
│                                                             │
│   ●───●───○───○───○───○   Step 2 of 6                     │
│                                                             │
│              Connect your backend                          │
│        Link Agent-I to where your orders and               │
│        customer data live.                                 │
│                                                             │
│   ┌─────────────────┐    ┌─────────────────┐              │
│   │   🛍  Shopify    │    │  🏢  In-house   │              │
│   │   [Connect]      │    │   [Connect]      │              │
│   └─────────────────┘    └─────────────────┘              │
│                                                             │
│                                                             │
│   [ ← Back ]              [ Skip for now ]   [ Next → ]    │
│                                                             │
└───────────────────────────────────────────────────────────┘
```

**Placement logic:** Same centered single-card shell as Login/Signup — consistent
"simple, one thing at a time" language, since this is still a pre-dashboard flow.
Progress dots + "Step X of 6" at the top, filled dots for completed steps. Heading +
one-line description under the progress indicator explains why each step is asking,
not just what. Step-specific content fills the middle — the only thing that changes
between steps, frame stays constant. Footer nav is consistent across every step:
Back (left, disabled/hidden on step 1), Skip for now (center, always available),
Next/Finish (right, primary). Step 6 replaces "Next" with "Go to Dashboard" and drops
"Skip" since there's nothing left to skip.

---

## 8. Tech Stack

**Core:**
- **Next.js** — framework/routing
- **Tailwind CSS** — styling
- **Lucide** (`lucide-react`) — icons. Chosen over Heroicons for consistent line-icon
  style across dense UI (status badges, nav, tables), tree-shakeable imports, and
  broad coverage of the small functional icons this app needs throughout.

**Supporting (needed to build the 10 designed pages):**
- **shadcn/ui** — component primitives (dropdowns, dialogs/modals, tabs, toasts)
  built on Radix + Tailwind, owned/customizable directly rather than a black-box
  library. Pairs natively with Lucide.
- **Recharts** — trend charts on the Agent Stats Dashboard.
- **React Hook Form + Zod** — form handling + validation across the form-heavy pages
  (Agent Configuration, Settings, Onboarding Wizard).
- **TanStack Query (React Query)** — data fetching/caching against the FastAPI
  backend; handles polling for the Approvals queue (SLA countdowns need fresh data)
  and loading/error states consistently across pages.
- **WebSocket or polling (via TanStack Query)** — real-time updates for the
  Approvals queue; matches the backend's Redis pub/sub → resume signal design.
  Exact mechanism still to be decided.
- **react-dropzone** — drag-and-drop file upload on the Knowledge Base page.

---

## 9. Visual Design System

**Style:** Swiss design (International Typographic Style) — grid-based, typographic
hierarchy, restraint. Fits a data-dense ops tool better than a decorative style.

**Typography:** a single sans-serif used consistently, hierarchy carried by
size/weight contrast rather than multiple fonts. **Inter** — free, legible at small
sizes (tables, badges), the practical web equivalent of Helvetica/Akzidenz-Grotesk.

**Layout language:**
- Strict grid alignment, generous whitespace
- **Sharp corners on structural elements** — page layout, tables, dividers,
  cards/panels, sidebar — keeps the "structure" precise
- **Small-radius rounded corners (4–6px) on interactive elements** — buttons,
  inputs, badges keep their rectangular shape with softened corners (not circular or
  pill-shaped) — softens the parts users directly touch without fighting the grid
  discipline elsewhere. Pure sharp corners everywhere read as too severe/aggressive
  for daily-use software; small-radius on touchpoints only keeps the Swiss grid/
  typography/restraint intact while taking the edge off repeated interactions (e.g.
  clicking a button)
- Thin hairline dividers instead of heavy borders/shadows (used throughout the
  tables and rail+tabs pages)
- Flat — no drop shadows, gradients, or skeuomorphism

**Color system: black, white, and gray only — no accent color.**
- Structure and actions are carried by black/white/gray and typographic
  weight/position, not color — a legitimate Swiss approach in its own right (no
  color pop, weight/size/position do the work instead)
- **Primary buttons** — solid black fill, white text
- **Secondary buttons** — white fill, black border, black text (outline style)
- **Active nav item / active tab** — black text + black underline or left-bar;
  inactive = gray text
- **Links** — black text, underlined
- **Selected row** — light gray background, not a color highlight
- **Focus rings** — black (accepted minor accessibility tradeoff vs. a colored
  ring, given the grayscale-only approach)
- **Color is reserved exclusively for the semantic status system** — never used
  decoratively, never doubles as a brand/accent color:
  - Green — Ready / Resolved / Approved
  - Amber/Orange — Processing / Pending / Medium risk
  - Red — Failed / Rejected / High risk / errors

---

## 10. Component Architecture

**Principle:** build modular, reusable components — not one-off implementations per
page — for easier coding and debugging.

Given the two repeating page templates already identified (Section 5), the natural
reusable component set includes:
- **List + Detail template** components (list row, detail panel/slide-over, status
  filter tabs) — shared between Approvals and Conversations
- **Rail + Tabs template** components (rail item, tab bar) — shared between Agent
  Configuration and Settings
- **Status badge** (risk level, ingestion status, conversation status, connector/
  channel status) — one component, color/label driven by props, used across
  Approvals, Conversations, Knowledge Base, Team & Roles, and Settings
- **Metric card** — shared between the Homepage snapshot and the Agent Stats
  Dashboard headline cards
- **Data table / list row** — thin table-style rows with an actions column, shared
  across Knowledge Base, Conversations, Team & Roles, and the Settings
  Integrations/Notifications lists
- **Empty state** — shared shape across Approvals, Conversations, Knowledge Base
- **Form field / Save changes footer** — shared across Agent Configuration, Settings,
  and the Onboarding Wizard steps

---

## 11. Suggested File Structure

Next.js App Router, split by route group (auth vs. dashboard shell) and by whether a
component is a generic reusable piece (`components/`) or tied to one page's data/
behavior (`features/`).

```
frontend/
├── app/
│   ├── (auth)/                    # unauthenticated routes, no sidebar shell
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx               # multi-step wizard, own layout (no sidebar)
│   ├── (dashboard)/                # authenticated routes, shares the app shell
│   │   ├── layout.tsx              # sidebar + top bar (Section 7.1)
│   │   ├── page.tsx                # Homepage "/"
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
│   │   ├── team/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── layout.tsx                  # root layout (fonts, providers)
│
├── components/
│   ├── ui/                         # shadcn primitives (button, input, dialog, tabs...)
│   ├── shared/                     # reusable pieces (Section 10)
│   │   ├── status-badge.tsx
│   │   ├── metric-card.tsx
│   │   ├── empty-state.tsx
│   │   ├── save-changes-footer.tsx
│   │   └── sla-countdown.tsx
│   ├── templates/                  # the two repeating page templates
│   │   ├── list-detail/
│   │   │   ├── list-detail-layout.tsx
│   │   │   ├── list-pane.tsx
│   │   │   └── detail-panel.tsx    # or slide-over variant
│   │   └── rail-tabs/
│   │       ├── rail-tabs-layout.tsx
│   │       ├── rail.tsx
│   │       └── tab-bar.tsx
│   └── shell/                      # app shell pieces
│       ├── sidebar.tsx
│       ├── top-bar.tsx
│       ├── workspace-switcher.tsx
│       └── notifications-center.tsx
│
├── features/                       # page-specific logic/components, grouped by domain
│   ├── approvals/
│   │   ├── approval-row.tsx
│   │   ├── approval-detail.tsx
│   │   └── use-approvals.ts        # TanStack Query hooks
│   ├── conversations/
│   ├── knowledge-base/
│   ├── agent-stats/
│   ├── agent-config/
│   ├── team/
│   └── settings/
│
├── lib/
│   ├── api-client.ts               # FastAPI client setup
│   ├── query-client.ts             # TanStack Query config
│   └── utils.ts
│
├── hooks/
│   └── use-websocket.ts            # real-time approvals updates
│
└── types/
    └── (shared TS types/interfaces, mirroring backend Pydantic schemas)
```

**Key decisions:**
- `components/` holds pure, reusable pieces with no page-specific logic (matches
  Section 10 directly)
- `features/` holds anything tied to one domain's data/behavior — keeps
  `components/` from accumulating one-off logic
- Route groups `(auth)` and `(dashboard)` split by which layout wraps them — auth
  pages get no sidebar, dashboard pages all share the shell from Section 7.1
- `templates/` makes the two shared page shapes (list+detail, rail+tabs) literal
  reusable components, not just a design pattern re-implemented per page