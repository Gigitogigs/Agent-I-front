// ── Shared TypeScript types ────────────────────────────────────────────────
// These mirror the backend Pydantic schemas. Extend as the API evolves.

// ── Auth ─────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
}

// ── Workspace ────────────────────────────────────────────────────────────
export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

// ── Approvals ────────────────────────────────────────────────────────────
export type RiskLevel = "HIGH" | "MED" | "LOW";
export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export interface Approval {
  id: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  actionSummary: string;
  agentName: string;
  conversationId: string;
  slaExpiresAt: string;   // ISO datetime
  createdAt: string;      // ISO datetime
  resolvedAt?: string;
  resolvedBy?: string;
  rejectReason?: string;
  parameters: Record<string, unknown>;
  conversationSummary: string;
}

// ── Conversations ────────────────────────────────────────────────────────
export type ConversationStatus = "RESOLVED" | "ESCALATED" | "IN_PROGRESS";

export interface Conversation {
  id: string;
  status: ConversationStatus;
  customerRef: string;
  customerName?: string;
  summary: string;
  agentTypes: AgentType[];
  createdAt: string;
  updatedAt: string;
}

export type AgentType = "retrieval" | "action" | "escalation" | "orchestrator";

export interface TranscriptTurn {
  id: string;
  role: "customer" | "agent";
  content: string;
  timestamp: string;
  citations?: Citation[];
  approvalOutcome?: { approvalId: string; summary: string; approved: boolean };
}

export interface Citation {
  docName: string;
  chunk: number;
  excerpt: string;
}

// ── Knowledge Base ───────────────────────────────────────────────────────
export type DocStatus = "PROCESSING" | "READY" | "FAILED";

export interface KBDocument {
  id: string;
  name: string;
  status: DocStatus;
  tags: string[];
  sizeBytes: number;
  chunkCount?: number;
  uploadedAt: string;
  errorReason?: string;
}

export interface RetrievalResult {
  docName: string;
  chunk: number;
  score: number;
  excerpt: string;
}

// ── Agent Stats ──────────────────────────────────────────────────────────
export type TimeRange = "24h" | "7d" | "30d" | "custom";

export interface HeadlineMetrics {
  resolutionRate: number;
  resolutionRateDelta: number;
  activeConversations: number;
  avgLatencyMs: number;
  avgLatencyDelta: number;
  guardrailBlockRate: number;
  guardrailBlockRateDelta: number;
  fallbackRate: number;
  retrievalHitRate: number;
}

export interface AgentBreakdown {
  agentName: string;
  calls: number;
  avgLatencyMs: number;
  fallbackPct: number;
  errorPct: number;
}

// ── Agent Config ─────────────────────────────────────────────────────────
export type AgentId =
  | "orchestrator"
  | "retrieval"
  | "action"
  | "escalation"
  | "global";

export interface AgentConfig {
  agentId: AgentId;
  provider: string;
  model: string;
  apiKeyMasked: string;
  fallbackModel?: string;
  systemPrompt: string;
  allowedTools: string[];
  guardrails: GuardrailConfig;
  hitlBreakpoints: HITLBreakpoint[];
}

export interface GuardrailConfig {
  piiDetection: boolean;
  promptInjectionScreening: boolean;
  toxicityFilter: boolean;
  refundCapUsd?: number;
  discountLimitPct?: number;
}

export interface HITLBreakpoint {
  id: string;
  label: string;
  expiryBehavior: "auto_escalate" | "auto_reject";
  slaWindowMinutes: number;
}

// ── Settings ─────────────────────────────────────────────────────────────
export interface Profile {
  name: string;
  email: string;
  timezone: string;
}

export interface NotificationSettings {
  email?: string;
  webhookUrl?: string;
  onNewEscalation: boolean;
  onSlaBreach: boolean;
  onApprovalExpired: boolean;
}

export interface Integration {
  id: string;
  type: "shopify" | "in_house";
  status: "connected" | "disconnected" | "error";
  label: string;
}
