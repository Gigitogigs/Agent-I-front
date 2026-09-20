import type { Conversation, ConversationStatus, TranscriptTurn } from "@/types";

// ── Stub Data ──
export const STUB_CONVERSATIONS: Conversation[] = [
  {
    id: "221",
    status: "ESCALATED",
    customerRef: "#221",
    customerName: "Jane K.",
    summary: "damaged item, refund request",
    agentTypes: ["retrieval", "action", "escalation"],
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "219",
    status: "RESOLVED",
    customerRef: "#219",
    summary: "where's my order",
    agentTypes: ["retrieval"],
    createdAt: new Date(Date.now() - 34 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
  {
    id: "223",
    status: "IN_PROGRESS",
    customerRef: "#223",
    summary: "billing question",
    agentTypes: ["retrieval"],
    createdAt: new Date(Date.now() - 51 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60_000).toISOString(),
  },
  {
    id: "217",
    status: "ESCALATED",
    customerRef: "#217",
    summary: "refund dispute",
    agentTypes: ["retrieval", "action", "escalation"],
    createdAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 55 * 60_000).toISOString(),
  },
  {
    id: "215",
    status: "RESOLVED",
    customerRef: "#215",
    summary: "return policy Q",
    agentTypes: ["retrieval"],
    createdAt: new Date(Date.now() - 120 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 110 * 60_000).toISOString(),
  },
  {
    id: "211",
    status: "RESOLVED",
    customerRef: "#211",
    summary: "order status",
    agentTypes: ["retrieval"],
    createdAt: new Date(Date.now() - 180 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 170 * 60_000).toISOString(),
  },
];

export const STUB_TRANSCRIPT: TranscriptTurn[] = [
  {
    id: "t1",
    role: "customer",
    content: "My order arrived damaged, I need a refund.",
    timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: "t2",
    role: "agent",
    content: "I'm sorry to hear that. Let me check your order details.",
    timestamp: new Date(Date.now() - 11 * 60_000).toISOString(),
    citations: [
      {
        docName: "return policy",
        chunk: 4,
        excerpt: "Items damaged in transit are eligible for a full refund within 30 days.",
      }
    ]
  },
  {
    id: "t3",
    role: "agent",
    content: "I can see order #4471 qualifies for a refund. Since it's above our auto-approval limit, I've routed this for review.",
    timestamp: new Date(Date.now() - 10 * 60_000).toISOString(),
    approvalOutcome: {
      approvalId: "a1",
      summary: "Refund $84",
      approved: true,
    }
  },
  {
    id: "t4",
    role: "agent",
    content: "Good news — your refund of $84 has been approved and is on its way.",
    timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "t5",
    role: "customer",
    content: "Thank you!",
    timestamp: new Date(Date.now() - 1 * 60_000).toISOString(),
  }
];

export const STATUS_TABS: { id: ConversationStatus | "ALL"; label: string }[] = [
  { id: "RESOLVED",    label: "Resolved" },
  { id: "ESCALATED",   label: "Escalated" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "ALL",         label: "All" },
];

export function filterConversations(
  conversations: Conversation[],
  status: ConversationStatus | "ALL",
  searchQuery: string
): Conversation[] {
  let filtered = conversations;
  
  if (status !== "ALL") {
    filtered = filtered.filter((c) => c.status === status);
  }
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.customerRef.toLowerCase().includes(q) ||
        c.customerName?.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
    );
  }
  
  return filtered;
}
