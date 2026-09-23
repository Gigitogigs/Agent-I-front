# Agent-I API Contract

This document outlines the REST API specification required by the Agent-I frontend. The backend engineer can use this as a reference to build compatible endpoints. 

The frontend expects a standard JSON REST API. All endpoints are expected to be prefixed with a base URL (e.g., `/api/v1/`).

> **Note:** The frontend currently assumes session-based authentication (e.g., HTTP-only cookies) or Bearer token authentication. If using tokens, the frontend will need to be updated to pass the `Authorization` header.

---

## 1. Authentication

### `POST /auth/login`
- **Request:** `{"email": "...", "password": "..."}`
- **Response:** `200 OK` (with session cookie or token). Returns user profile + active workspace ID.

### `POST /auth/signup`
- **Request:** `{"name": "...", "email": "...", "password": "..."}`
- **Response:** `201 Created`

### `POST /auth/logout`
- **Request:** empty body
- **Response:** `200 OK` (clears session)

---

## 2. Workspaces & Accounts

### `GET /workspaces`
- **Response:** 
  ```json
  [
    {
      "id": "ws_123",
      "name": "Acme Corp",
      "role": "owner"
    }
  ]
  ```

### `POST /workspaces`
- **Request:** `{"name": "..."}`
- **Response:** `201 Created` returning the new workspace object.

### `DELETE /workspaces/{id}`
- **Request:** `{"password": "..."}`
- **Response:** `202 Accepted`
- **Behavior:** This doesn't delete the workspace immediately. It schedules it for deletion (48-hour grace period). The frontend will check this status upon login.

### `POST /workspaces/{id}/cancel-deletion`
- **Response:** `200 OK` (cancels the 48-hour grace period).

### `DELETE /account`
- **Request:** `{"password": "..."}`
- **Response:** `202 Accepted`
- **Behavior:** Schedules the user account (and any workspaces they own) for deletion (48-hour grace period).

---

## 3. Team & Roles (Scoped to Active Workspace)

### `GET /workspaces/{id}/members`
- **Response:** 
  ```json
  [
    {
      "id": "usr_123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "owner",
      "status": "active",
      "lastActive": "2023-10-01T12:00:00Z"
    }
  ]
  ```
  *(Status can be `active` or `pending`)*

### `POST /workspaces/{id}/members`
- **Request:** `{"email": "...", "role": "admin"}` (Roles: `owner`, `admin`, `operator`, `read-only`)
- **Response:** `201 Created` (Sends an invite email).

### `PATCH /workspaces/{ws_id}/members/{user_id}`
- **Request:** `{"role": "operator"}`
- **Response:** `200 OK`

### `DELETE /workspaces/{ws_id}/members/{user_id}`
- **Response:** `200 OK`

---

## 4. Approvals (HITL Queue)

### `GET /workspaces/{id}/approvals`
- **Query Params:** `?status=pending|approved|rejected|expired|all`
- **Response:**
  ```json
  [
    {
      "id": "app_123",
      "status": "pending",
      "riskLevel": "HIGH",
      "slaExpiresAt": "2023-10-01T14:00:00Z",
      "actionSummary": "Refund $84",
      "context": "Customer requested refund...",
      "parameters": {"amount": 84, "orderId": "4471"},
      "requestedBy": "Action Agent",
      "flagReason": "Refund amount above $50 auto-cap",
      "createdAt": "2023-10-01T12:00:00Z"
    }
  ]
  ```

### `POST /workspaces/{id}/approvals/{app_id}/approve`
- **Request:** empty body
- **Response:** `200 OK`

### `POST /workspaces/{id}/approvals/{app_id}/reject`
- **Request:** `{"reason": "..."}` (Reason is required).
- **Response:** `200 OK`

---

## 5. Conversations

### `GET /workspaces/{id}/conversations`
- **Query Params:** `?status=resolved|escalated|in_progress|all&search=...`
- **Response:**
  ```json
  [
    {
      "id": "conv_123",
      "status": "escalated",
      "customerName": "Jane K.",
      "summary": "Damaged item, refund requested",
      "agentsInvolved": ["retrieval", "action", "escalation"],
      "lastUpdatedAt": "2023-10-01T12:00:00Z"
    }
  ]
  ```

### `GET /workspaces/{id}/conversations/{conv_id}`
- **Response:** Returns full transcript array.
  ```json
  {
    "id": "conv_123",
    "transcript": [
      {
        "speaker": "customer",
        "text": "My order arrived damaged.",
        "timestamp": "..."
      },
      {
        "speaker": "agent",
        "text": "Let me check that...",
        "citations": [{"source": "return-policy.pdf", "chunk": "4.2"}],
        "inlineApprovalId": "app_123"
      }
    ]
  }
  ```

---

## 6. Knowledge Base

### `GET /workspaces/{id}/knowledge-base`
- **Response:**
  ```json
  [
    {
      "id": "doc_123",
      "filename": "return-policy.pdf",
      "status": "ready",
      "tags": {"category": "Policy"},
      "sizeBytes": 82000,
      "chunkCount": 14,
      "uploadedAt": "..."
    }
  ]
  ```
  *(Status: `processing`, `ready`, `failed`)*

### `POST /workspaces/{id}/knowledge-base/upload`
- **Request:** `multipart/form-data` with `file`, `tags`
- **Response:** `202 Accepted` (processing started).

### `DELETE /workspaces/{id}/knowledge-base/{doc_id}`
- **Response:** `200 OK`

### `POST /workspaces/{id}/knowledge-base/test-retrieval`
- **Request:** `{"query": "what is the return policy?"}`
- **Response:**
  ```json
  [
    {
      "documentId": "doc_123",
      "filename": "return-policy.pdf",
      "chunkText": "Items may be returned within 30 days...",
      "score": 0.91
    }
  ]
  ```

---

## 7. Agent Configuration

### `GET /workspaces/{id}/agents`
- **Response:** Returns settings for all agents (Orchestrator, Retrieval, Action, Escalation) and Global defaults.

### `PATCH /workspaces/{id}/agents/{agent_type}`
- **Request:** Deep merge update to agent settings (e.g. updating the LLM model, API key, prompt overrides, tools).
- **Response:** `200 OK`

---

## 8. Agent Stats

### `GET /workspaces/{id}/stats`
- **Query Params:** `?timeRange=24h|7d|30d`
- **Response:** Returns headline metrics (Resolution rate, Active convos, Avg latency, Guardrail block rate, Fallback rate) and timeseries data for charts.

---

## 9. Settings (Profile & Billing)

### `GET /profile`
- **Response:** `{"name": "...", "email": "...", "timezone": "...", "avatarUrl": "..."}`

### `PATCH /profile`
- **Request:** Partial update.
- **Response:** `200 OK`

### `GET /workspaces/{id}/billing`
- **Response:** Returns active plan details, usage metrics, invoice history, and registered payment methods.
