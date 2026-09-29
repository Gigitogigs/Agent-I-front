import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, axiosInstance } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { Approval, ApprovalStatus, RiskLevel } from "@/types";

export const STATUS_TABS: { id: ApprovalStatus | "ALL"; label: string }[] = [
  { id: "PENDING",   label: "Pending" },
  { id: "APPROVED",  label: "Approved" },
  { id: "REJECTED",  label: "Rejected" },
  { id: "EXPIRED",   label: "Expired" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "ALL",       label: "All" },
];

export function useApprovals(status: ApprovalStatus | "ALL") {
  const { activeWorkspaceId } = useAuth();

  return useQuery<Approval[]>({
    queryKey: ["workspaces", activeWorkspaceId, "approvals", status],
    queryFn: async () => {
      const url = new URL(`/api/v1/workspaces/${activeWorkspaceId}/approvals`, window.location.origin);
      if (status !== "ALL") {
        url.searchParams.set("status", status);
      }
      // Note: apiClient already prefixes with baseURL, so we just pass the path
      const path = `/workspaces/${activeWorkspaceId}/approvals${url.search}`;
      const raw = await apiClient.get<any[]>(path);
      return raw.map(mapApprovalOut);
    },
    enabled: !!activeWorkspaceId,
  });
}

export function useApproveAction() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();

  return useMutation({
    mutationFn: (approvalId: string) =>
      axiosInstance.post(`/workspaces/${activeWorkspaceId}/approvals/${approvalId}/approve`, {}, {
        headers: { 'Idempotency-Key': `${approvalId}:approve` }
      }).then(r => r.data),
    onSuccess: () => {
      // Invalidate the approvals list and homepage summary
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "approvals"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "summary"] });
    },
  });
}

export function useRejectAction() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();

  return useMutation({
    mutationFn: ({ approvalId, reason }: { approvalId: string; reason: string }) =>
      axiosInstance.post(`/workspaces/${activeWorkspaceId}/approvals/${approvalId}/reject`, { reason }, {
        headers: { 'Idempotency-Key': `${approvalId}:reject` }
      }).then(r => r.data),
    onSuccess: () => {
      // Invalidate the approvals list and homepage summary
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "approvals"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "summary"] });
    },
  });
}

function mapApprovalOut(a: any): Approval {
  return {
    id: a.id,
    status: a.status as ApprovalStatus,
    riskLevel: a.risk_level as RiskLevel,
    actionSummary: a.action_type ?? 'Action',
    agentName: a.agent_id ?? 'Agent',
    conversationId: a.conversation_id,
    slaExpiresAt: a.expires_at ?? '',
    createdAt: a.created_at,
    resolvedAt: a.resolved_at ?? undefined,
    resolvedBy: a.resolvedBy ?? undefined,
    rejectReason: a.operator_note ?? undefined,
    parameters: a.payload,
    conversationSummary: a.conversationSummary ?? '',
  };
}
