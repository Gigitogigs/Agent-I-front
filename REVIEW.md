# Agent-I Frontend Pre-Production Review

## 🚨 Findings

**Blocker | `autonomi/features/agent-config/use-agent-config.ts` (L71-L82)**
*   **What's wrong:** The UI allows users to type a new API key into the `apiKeyHint` input, but `useUpdateAgentConfig` strips it. Looking at the OpenAPI docs, API keys must be updated via `PUT /workspaces/{id}/providers/{provider_id}/api-key`, which the frontend never calls. Furthermore, `useUpdateAgentConfig` uses `PUT /workspaces/{id}/agents/{agentType}` but the backend swagger only exposes `PATCH` for this route.
*   **Real-world consequence:** Users cannot save or update LLM API keys. Furthermore, any agent configuration changes will fail with 405 Method Not Allowed due to the PUT vs PATCH mismatch.
*   **Minimal fix:** Hook up the API key input to a new mutation calling the provider API key endpoint, and change `apiClient.put` to `apiClient.patch` for agent config updates.

**Blocker | `autonomi/hooks/use-auth.ts` (L23) & `autonomi/components/shell/app-shell.tsx`**
*   **What's wrong:** There is zero route protection (no Next.js middleware, and `useAuth` doesn't redirect on failure). 
*   **Real-world consequence:** Anonymous users can navigate directly to `/approvals` or `/conversations`. While the backend API correctly enforces `HTTPBearer` auth (verified via OpenAPI), the frontend will render broken shells displaying 401 API errors instead of cleanly redirecting unauthenticated users to `/login`.
*   **Minimal fix:** Add a Next.js `middleware.ts` to block unauthenticated access to `/(dashboard)/*`, or update `AppShell` to redirect to `/login` if `!isLoading && error`.

**High | `autonomi/lib/api-client.ts` (L85)**
*   **What's wrong:** When an auth token refresh fails (401), the interceptor dispatches an `auth:logout` window event, but this event is never listened to anywhere in the codebase.
*   **Real-world consequence:** When a user's session naturally expires, they are left on a broken, frozen screen where clicks do nothing and data won't load, rather than being cleanly logged out.
*   **Minimal fix:** Add a `useEffect` in `providers.tsx` or `layout.tsx` that listens for `auth:logout` and calls `router.push('/login')`.

**Medium | `autonomi/components/shell/workspace-switcher.tsx` (L25)**
*   **What's wrong:** The workspace switcher is entirely hardcoded to `<p>Demo Workspace</p>`. Furthermore, `useAuth.ts` blindly selects `memberships[0]` and offers no way to change it.
*   **Real-world consequence:** The multi-tenant architecture is inaccessible. Users belonging to multiple workspaces (e.g. consultants, agencies) are permanently locked into the first workspace returned by the API. (The `GET /workspaces` endpoint exists in the backend but is ignored here).
*   **Minimal fix:** Fetch workspaces using `GET /workspaces`, wire the switcher to map over them, and store the `activeWorkspaceId` in a cookie or Context provider.

**Medium | `autonomi/package.json` (L30, L33) & Form Validation**
*   **What's wrong:** The `README.md` claims "React Hook Form + Zod" are used, but `grep` shows they are unused. The app relies entirely on HTML5 validation.
*   **Real-world consequence:** The client relies entirely on the backend to reject invalid data (e.g. `422 Validation Error`), which results in generic error messages rather than inline field validation for users.
*   **Minimal fix:** Implement `zod` schemas that match backend Pydantic models (from OpenAPI) for major forms (Agent Config, Settings) or update the README.

---

## 🏗️ Code Organization & Architecture

**Reusability vs Copy-Pasting**
- **Good**: Leaf components (`EmptyState`, `StatusBadge`, `MetricCard`) are built centrally and reused effectively.
- **Bad (Layouts)**: Page layouts are highly fragmented. `approvals/page.tsx` uses a centralized `ListDetailLayout` template (split-pane), but `conversations/page.tsx` ignores it entirely, building a custom full-screen list with a `SlideOver` detail panel. Both copy-paste identical HTML wrappers rather than sharing a standard list container. 
- **Bad (Tabs)**: There is no central `<Tabs>` component. `approvals`, `conversations`, and `knowledge-base` all copy-paste raw HTML (`<nav role="tablist">` with inline Tailwind classes) to render tabs. 

**Separation of Concerns**
- Data fetching logic is cleanly abstracted into hooks (`features/*/use-*.ts`).
- However, page-level files like `conversations/page.tsx` (160 lines) and `knowledge-base/page.tsx` (123 lines) are highly imperative. They mix large blocks of raw layout HTML with local state management (search filtering, active tabs) rather than splitting them out into focused subcomponents.

**Dead Code & Ghost Dependencies**
- `package.json` is bloated with heavy libraries that are **completely unused**:
  - **Radix UI**: 8 packages installed (`@radix-ui/react-tabs`, `dialog`, `dropdown-menu`, `select`, etc.), but the developer manually coded raw HTML equivalents instead. `components/ui/` is entirely empty.
  - **Form Validation**: `react-hook-form` and `zod` are installed but never imported.
  - **Others**: `react-dropzone` and `next-auth` are installed but bypassed (e.g., `knowledge/upload-zone.tsx` uses native HTML drag-and-drop instead).

**Visual Design Consistency**
- **Strong Foundation**: The use of CSS variables (`var(--bg-surface)`) ensures global colors and typography remain highly consistent.
- **Inconsistencies**: Because there are no shared structural UI components (Tables, Tabs), visual drift occurs. For example, the list header in `conversations/page.tsx` has no border radius, while `knowledge-base/page.tsx` implements a similar header but adds `rounded-t-lg` and `border-x`.

**Predictability of Adding a New Page**
- **Poor**. A developer adding a new page wouldn't know the "right" way to do it. They would have to guess whether to use `ListDetailLayout`, `SlideOver`, or build a custom list. They wouldn't know whether to use the installed `@radix-ui` libraries or follow the existing pattern of copy-pasting raw HTML templates. The architecture currently favors copy-pasting over true composition.

---

## ⚡ Real-world Data & Interaction Behavior

**Data Fetching & Freshness**
- **Stale Queues**: `providers.tsx` sets a global `staleTime: 60 * 1000` (1 minute) and disables `refetchOnWindowFocus`. The Approvals and Conversations queues do not use polling (`refetchInterval`). Therefore, users reviewing live support queues will sit on completely stale data unless they manually refresh the page.
- **SLA Countdown Drift**: The `SlaCountdown` component (`sla-countdown.tsx`) calculates `secondsLeft` on mount and then blindly subtracts 1 every second using `setInterval`. If the browser throttles the background tab, the timer drifts significantly from real time, presenting users with inaccurate SLAs.

**Double-Click & Destructive Action Protections**
- **Idempotency Flaw**: `use-approvals.ts` generates a new `Idempotency-Key` (via `crypto.randomUUID()`) *inside the mutation function* rather than tying it to the approval ID. This defeats the purpose of the key, as every double-click sends a fresh, unique UUID to the backend.
- **Missing Loading States**: Action buttons (like `Approve` in `approval-detail.tsx`) and the global `SaveChangesFooter` in `agent-config/page.tsx` do not bind their disabled attributes to the mutation's `isPending` state. Users on slow networks can repeatedly double-click these buttons while waiting for a response.
- **Premature UI Updates**: When rejecting an approval, the rejection form (`handleRejectConfirm` in `approval-detail.tsx`) immediately closes before the API promise resolves. If the network drops, the user assumes the rejection succeeded, but the queue will silently fail to update.

**Session Expiry Mid-Use**
- Because the `auth:logout` event (dispatched on 401 refresh failure) is ignored, a user whose session naturally expires mid-use will not be redirected. If they have unsaved work in Agent Config, they will click "Save", the API will 401, no error will appear on screen, and they will be trapped on a frozen page. (Note: Once `auth:logout` is properly wired up to redirect, they *will* lose their unsaved work upon forced redirection).

**Loading, Error, and Empty States**
- **Good**: Every page gracefully handles `isLoading`, `error`, and empty states (using the `EmptyState` component) rather than crashing or showing blank screens.
- **Bad**: Mutation errors (like a failed save or approval) are generally swallowed or logged to the console without showing toast notifications to the user.

---

## 🚀 Infrastructure, Deployment & Operations

**Critical Missing Artifacts**
The repository currently contains **only the Next.js frontend code** (`autonomi/`). There are absolutely no infrastructure-as-code files, deployment scripts, or backend services present in this workspace. Because the code is the source of truth, the following operational requirements must be marked as **Cannot Verify / Missing**:

- **Compose/Infra & Environment Separation:** No `docker-compose.yml`, `Dockerfile`, or Kubernetes manifests exist in this repository. There is no configuration for environment separation (dev/staging/prod), pinned image versions, or resource limits.
- **Security Posture:** Without Dockerfiles or compose setups, it is impossible to verify if containers run as non-root, if secrets are baked into images, or how Redis/Postgres authenticate.
- **Deployment & Migrations:** There are no backend migration scripts (e.g., Alembic for Python) or CI/CD pipelines (`.github/workflows`) present to define the deployment order, zero-downtime updates, or rollback procedures.
- **Graceful Shutdown & Background Workers:** The backend worker logic (LangGraph agents, FastAPI servers, WebSocket handling, background expiry) is entirely absent from this repository.
- **Backups & Recovery:** There is no documentation or scripting for database backups, point-in-time recovery, or restore procedures.

**Conclusion for Operations:**
If this is intended to be a complete pre-production repository, it **fails operational readiness entirely** because the infrastructure and backend are completely missing. To conduct this part of the review, the infrastructure repository (or the missing backend/ops folders) must be provided.

---

## 📚 Documentation & Operator Readiness

**Clone to Working System?**
- **FAIL.** A new engineer cannot spin this up based on the docs. The `README.md` provides generic `npm run dev` instructions but completely omits critical environment variables (e.g., `NEXT_PUBLIC_API_URL`), backend service setup instructions, and database provisioning steps. `autonomi/README.md` is simply the unedited output of `create-next-app`.

**Accuracy of Docs vs. Code**
- **Stale Claims**: The root `README.md` claims the app uses `React Hook Form + Zod` and `shadcn/ui (Radix)` — all of these are completely unused in the code.
- **Stale Typography**: `README.md` claims the font is Inter; `autonomi/README.md` and the actual `layout.tsx` use Geist.
- **Dead Features**: `Frontend-Architecture.md` boasts about "real-time approvals updates" managed via `hooks/use-websocket.ts`. While the file exists, it is **never imported** anywhere in the codebase.
- **API Contract Drift**: The file `API-Contract.md` is dangerously out of date. It dictates camelCase payload schemas and `/auth/signup`, while the actual codebase rightfully implements snake_case and `/auth/register` to match the real backend OpenAPI spec.

**Missing Runbooks (Operator Knowledge)**
- There are **zero runbooks** included in the documentation. An operator facing a stuck approval, a failed KB document ingestion, an LLM provider outage, or needing to rotate API credentials has no instructions to rely on. 

**Limits & Escalations**
- Operators have no documentation regarding system limits. What happens when the $50 auto-approval cap is breached? How does the SLA expiry mechanism actually behave on the backend if an agent misses the threshold? None of this is documented for the end customer or IT person.

**Prioritized List of Docs to Write Before Launch**
1. **Local Setup Guide:** Document the required environment variables (`.env.local`), required Node version, and instructions on how to stand up the companion backend (or point it to a staging URL).
2. **Operator Manual (Runbooks):** Document exactly how to rotate LLM provider keys, how to retry failed knowledge base ingestions, and what happens when an SLA timer expires.
3. **Deprecate `API-Contract.md`:** Delete this file immediately. Replace it with a single line in the README pointing developers directly to the backend's `/docs` or `/redoc` OpenAPI endpoint to ensure the UI stays synchronized with reality.
4. **Cleanup Tech Stack Claims:** Update the README to remove false claims about Zod, React Hook Form, and Radix UI to prevent confusing new developers.

---

## 🏆 What's Done Well
- **API Parity over Contract:** Despite `API-Contract.md` being highly outdated, the frontend actually implements the correct real-world backend schemas (snake_case mappings in `use-approvals.ts`, uppercase enums for `StatusBadge`, and `/auth/register`). The code was successfully written to the reality of the API rather than outdated docs!
- **Axios Interceptor Queueing:** The `api-client.ts` implementation handles token refresh races gracefully. It pauses concurrent requests while refreshing the token and resolves the queue afterward.
- **TanStack Query Setup:** Excellent usage of `queryClient.invalidateQueries` to ensure the UI stays synchronized with backend state across complex mutations (like approving an action updating both the list and the summary stats).
- **Design System Isolation:** Using strict CSS variables (`--bg-surface`, `--color-danger`) makes the platform highly maintainable and ready for theming.

---

## 📊 Summary Table

| Category | Finding | Backend Match |
| :--- | :--- | :--- |
| **API Types** | Handwritten (`types/index.ts`); not auto-generated. | ✅ Matches Swagger (despite contract diff) |
| **Validation** | Zod/RHF missing; HTML5 basic only. | ⚠️ Relies entirely on 422 errors |
| **Auth & Routes** | UI has no route protection or redirect logic. | ❌ UI broken on 401 |
| **Context** | Workspace ID is stuck on index 0; switcher is hardcoded. | ❌ Breaks multi-tenancy |
| **Secrets** | API Keys cannot be updated (wrong endpoint). | ❌ Broken mutation logic |

---

## 🛠️ Top 5 Fixes Before Launch
1. **Fix API Key saving** by wiring the input to the actual `PUT /workspaces/{id}/providers/{provider_id}/api-key` endpoint.
2. **Fix Agent Config saving** by changing `apiClient.put` to `apiClient.patch` in `use-agent-config.ts` and passing `isSaving` to the Footer.
3. **Add route protection** (Next.js middleware) so unauthenticated users cannot access dashboard layouts and see frozen broken screens.
4. **Fix Interaction Bugs:** Bind `isPending` states to all action buttons to prevent double-submissions, and tie Idempotency-Keys to entity IDs.
5. **Implement Workspace Switching** using the `GET /workspaces` endpoint.
