import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { Conversation, ConversationStatus, TranscriptTurn } from "@/types";

export const STATUS_TABS: { id: ConversationStatus | "ALL"; label: string }[] = [
  { id: "RESOLVED",    label: "Resolved" },
  { id: "ESCALATED",   label: "Escalated" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "ALL",         label: "All" },
];

export function useConversations(
  searchQuery: string = "",
  status: ConversationStatus | "ALL" = "ALL"
) {
  const { activeWorkspaceId } = useAuth();

  return useQuery<Conversation[]>({
    queryKey: ["workspaces", activeWorkspaceId, "conversations", { searchQuery, status }],
    queryFn: async () => {
      const url = new URL(`/api/v1/workspaces/${activeWorkspaceId}/conversations`, window.location.origin);
      if (status !== "ALL") {
        url.searchParams.set("status", status);
      }
      if (searchQuery.trim()) {
        url.searchParams.set("search", searchQuery.trim());
      }
      const response = await apiClient.get<{ items: any[]; nextCursor?: string | null }>(
        `/workspaces/${activeWorkspaceId}/conversations${url.search}`
      );
      return response.items.map(mapConversationOut);
    },
    enabled: !!activeWorkspaceId,
  });
}

export interface ConversationDetailResponse {
  conversation: Conversation;
  transcript: TranscriptTurn[];
}

export function useConversationDetail(conversationId: string | null) {
  const { activeWorkspaceId } = useAuth();

  return useQuery<ConversationDetailResponse>({
    queryKey: ["workspaces", activeWorkspaceId, "conversations", conversationId],
    queryFn: async () => {
      const detail = await apiClient.get<any>(
        `/workspaces/${activeWorkspaceId}/conversations/${conversationId}`
      );
      return {
        conversation: mapConversationOut(detail),
        transcript: (detail.transcript ?? []).map(mapTurnOut),
      };
    },
    enabled: !!activeWorkspaceId && !!conversationId,
  });
}

function mapConversationOut(c: any): Conversation {
  return {
    id: c.id,
    status: c.status as ConversationStatus,
    customerRef: c.customer_identifier ?? '',
    customerName: c.customer_name ?? undefined,
    summary: c.summary ?? '',
    agentTypes: (c.agentsInvolved || []) as any[],
    createdAt: c.updated_at,
    updatedAt: c.updated_at,
  };
}

function mapTurnOut(t: any): TranscriptTurn {
  return {
    id: t.id || Math.random().toString(),
    role: t.role === "user" ? "customer" : "agent",
    content: t.content,
    timestamp: t.created_at,
  };
}
