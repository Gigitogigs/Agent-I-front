import type { Approval, ApprovalStatus, RiskLevel } from "@/types";

// ── Stub data — replace with TanStack Query fetches against the FastAPI backend ──
export const STUB_APPROVALS: Approval[] = [
  {
    id: "a1",
    status: "PENDING",
    riskLevel: "HIGH",
    actionSummary: "Refund $84 — Order #4471",
    agentName: "Action Agent",
    conversationId: "c221",
    slaExpiresAt: new Date(Date.now() + 4 * 60_000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    parameters: {
      "Order ID":  "#4471",
      "Amount":    "$84.00",
      "Reason":    "item arrived damaged",
      "Customer":  "#221 (Jane K.)",
    },
    conversationSummary:
      "Customer reported item damaged on arrival, requested refund. Order agent confirmed delivery, refund exceeds auto-approval cap.",
  },
  {
    id: "a2",
    status: "PENDING",
    riskLevel: "MED",
    actionSummary: "Cancel order #4502",
    agentName: "Action Agent",
    conversationId: "c222",
    slaExpiresAt: new Date(Date.now() + 12 * 60_000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60_000).toISOString(),
    parameters: {
      "Order ID":  "#4502",
      "Customer":  "#222 (Tom R.)",
      "Reason":    "customer changed mind",
    },
    conversationSummary:
      "Customer requested cancellation before shipment. Order is still in fulfilment centre.",
  },
  {
    id: "a3",
    status: "PENDING",
    riskLevel: "LOW",
    actionSummary: "Address change — #4498",
    agentName: "Action Agent",
    conversationId: "c220",
    slaExpiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    parameters: {
      "Order ID":     "#4498",
      "New address":  "12 Baker St, London, UK",
      "Customer":     "#220 (Alice M.)",
    },
    conversationSummary:
      "Customer asked to update delivery address. Order has not been dispatched yet.",
  },
  {
    id: "a4",
    status: "PENDING",
    riskLevel: "MED",
    actionSummary: "Subscription downgrade #88",
    agentName: "Action Agent",
    conversationId: "c219",
    slaExpiresAt: new Date(Date.now() + 40 * 60_000).toISOString(),
    createdAt: new Date(Date.now() - 32 * 60_000).toISOString(),
    parameters: {
      "Subscription ID": "#88",
      "From plan":       "Pro",
      "To plan":         "Starter",
      "Customer":        "#219 (Mark S.)",
    },
    conversationSummary:
      "Customer wants to downgrade from Pro to Starter mid-cycle. Proration applies.",
  },
  {
    id: "a5",
    status: "APPROVED",
    riskLevel: "MED",
    actionSummary: "Refund $42 — Order #4390",
    agentName: "Action Agent",
    conversationId: "c210",
    slaExpiresAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    resolvedBy: "admin@autonomi.ai",
    parameters: {
      "Order ID": "#4390",
      "Amount":   "$42.00",
      "Customer": "#210 (Sarah L.)",
    },
    conversationSummary: "Customer returned item in original packaging. Refund approved.",
  },
  {
    id: "a6",
    status: "REJECTED",
    riskLevel: "HIGH",
    actionSummary: "Refund $210 — Order #4350",
    agentName: "Action Agent",
    conversationId: "c205",
    slaExpiresAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    resolvedBy: "admin@autonomi.ai",
    rejectReason: "No proof of damage provided. Escalated to support team.",
    parameters: {
      "Order ID": "#4350",
      "Amount":   "$210.00",
      "Customer": "#205 (David W.)",
    },
    conversationSummary: "High-value refund claim. Customer could not provide evidence.",
  },
];

export const STATUS_TABS: { id: ApprovalStatus | "ALL"; label: string }[] = [
  { id: "PENDING",   label: "Pending" },
  { id: "APPROVED",  label: "Approved" },
  { id: "REJECTED",  label: "Rejected" },
  { id: "EXPIRED",   label: "Expired" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "ALL",       label: "All" },
];

export function filterApprovals(
  approvals: Approval[],
  status: ApprovalStatus | "ALL"
): Approval[] {
  if (status === "ALL") return approvals;
  return approvals.filter((a) => a.status === status);
}
