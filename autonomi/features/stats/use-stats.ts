import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export type TimeRange = "24h" | "7d" | "30d" | "custom";

export interface Metric {
  id: string;
  label: string;
  value: string;
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;
    isGood: boolean;
  };
}

export interface AgentStatRow {
  agentName: string;
  calls: number;
  avgLatency: string;
  fallbackRate: string;
  errorRate: string;
}

export interface AgentStatsData {
  metrics: Metric[];
  agentStats: AgentStatRow[];
}

export function useStats(timeRange: TimeRange) {
  const { activeWorkspaceId } = useAuth();

  return useQuery<AgentStatsData>({
    queryKey: ["workspaces", activeWorkspaceId, "stats", timeRange],
    queryFn: () => {
      const url = new URL(`/api/v1/workspaces/${activeWorkspaceId}/stats`, window.location.origin);
      url.searchParams.set("timeRange", timeRange);
      return apiClient.get<AgentStatsData>(`/workspaces/${activeWorkspaceId}/stats${url.search}`);
    },
    enabled: !!activeWorkspaceId,
  });
}
