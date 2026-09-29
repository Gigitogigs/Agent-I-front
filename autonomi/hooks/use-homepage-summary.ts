"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export interface HomepageSummary {
  pendingApprovals: Array<{
    id: string;
    summary: string;
    riskLevel: "HIGH" | "MED" | "LOW";
    slaExpiresAt: string;
  }>;
  pendingApprovalCount: number;
  stats: {
    resolutionRate: string;
    activeConversations: number;
    avgLatency: string;
    guardrailBlockRate: string;
  };
  systemHealth: Array<{
    label: string;
    ok: boolean;
  }>;
  recentConversations: Array<{
    id: string;
    status: "RESOLVED" | "ESCALATED" | "IN_PROGRESS";
    summary: string;
  }>;
}

export function useHomepageSummary() {
  const { activeWorkspaceId } = useAuth();

  return useQuery<HomepageSummary>({
    queryKey: ["workspaces", activeWorkspaceId, "summary"],
    queryFn: async () => {
      const raw = await apiClient.get<any>(
        `/workspaces/${activeWorkspaceId}/summary`
      );
      return mapHomepageSummary(raw);
    },
    enabled: !!activeWorkspaceId,
  });
}

function mapHomepageSummary(raw: any): HomepageSummary {
  return {
    pendingApprovals: raw.urgent_approvals.map((a: any) => ({
      id: a.id,
      summary: a.action_type,
      riskLevel: a.risk_level as 'HIGH' | 'MED' | 'LOW',
      slaExpiresAt: a.created_at,
    })),
    pendingApprovalCount: raw.urgent_approvals.length,
    stats: {
      resolutionRate: '—',
      activeConversations: raw.stats.active_conversations_today,
      avgLatency: '—',
      guardrailBlockRate: '—',
    },
    systemHealth: [{
      label: 'Integrations',
      ok: raw.health.integrations_status === 'ok',
    }],
    recentConversations: raw.recent_conversations.map((c: any) => ({
      id: c.id,
      status: c.status as 'RESOLVED' | 'ESCALATED' | 'IN_PROGRESS',
      summary: c.preview ?? '',
    })),
  };
}
