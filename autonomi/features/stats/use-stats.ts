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

// ── Stub Data ──
export const STUB_METRICS: Metric[] = [
  {
    id: "resolution",
    label: "Resolution Rate",
    value: "87%",
    trend: { direction: "up", value: "2%", isGood: true },
  },
  {
    id: "active",
    label: "Active Convos",
    value: "12",
  },
  {
    id: "latency",
    label: "Avg Latency",
    value: "1.4s",
    trend: { direction: "down", value: "0.2s", isGood: true },
  },
  {
    id: "guardrail",
    label: "Guardrail Block Rate",
    value: "2.1%",
    trend: { direction: "up", value: "0.4%", isGood: false },
  },
  {
    id: "fallback",
    label: "Fallback Rate",
    value: "0.8%",
  },
  {
    id: "hitrate",
    label: "Retrieval Hit Rate",
    value: "91%",
  },
];

export const STUB_AGENT_STATS: AgentStatRow[] = [
  {
    agentName: "Orchestrator",
    calls: 1204,
    avgLatency: "0.6s",
    fallbackRate: "0.2%",
    errorRate: "0.1%",
  },
  {
    agentName: "Retrieval",
    calls: 842,
    avgLatency: "1.1s",
    fallbackRate: "0.5%",
    errorRate: "0.8%",
  },
  {
    agentName: "Action",
    calls: 310,
    avgLatency: "0.9s",
    fallbackRate: "0.0%",
    errorRate: "0.3%",
  },
  {
    agentName: "Escalation",
    calls: 58,
    avgLatency: "2.0s",
    fallbackRate: "1.7%",
    errorRate: "0.0%",
  },
];
