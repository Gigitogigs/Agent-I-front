"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MetricCard } from "@/features/stats/metric-card";
import { TrendChartStub } from "@/features/stats/trend-chart-stub";
import { AgentBreakdownTable } from "@/features/stats/agent-breakdown-table";
import { STUB_METRICS, type TimeRange } from "@/features/stats/use-stats";
import { cn } from "@/lib/utils";

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
];

export default function AgentStatsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header + Time Range Selector ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--fg-base)]">Agent Stats</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Aggregate performance, latency, and success rates across all agents.
          </p>
        </div>

        {/* Time range toggle */}
        <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-md p-0.5 shrink-0">
          {TIME_RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors",
                timeRange === range.id
                  ? "bg-[var(--bg-surface)] text-[var(--fg-base)] shadow-sm border border-[var(--border-hairline)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg-base)] border border-transparent"
              )}
            >
              {range.label}
            </button>
          ))}
          <select 
            className="bg-transparent text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg-base)] px-2 py-1.5 focus:outline-none cursor-pointer"
            defaultValue="custom"
            onChange={(e) => {
              if (e.target.value !== "custom") setTimeRange(e.target.value as TimeRange);
            }}
          >
            <option value="custom" disabled>Custom</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* ── Headline Metric Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STUB_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* ── Trend Charts ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <TrendChartStub
          title={`Resolution Rate (${timeRange})`}
          description="Percentage of conversations resolved without human escalation."
          variant="line"
        />
        <TrendChartStub
          title={`Latency (p50/p95/p99, ${timeRange})`}
          description="End-to-end response time across all agent turns."
          variant="line"
        />
      </div>

      {/* ── Per-Agent Breakdown ──────────────────────────────────────── */}
      <AgentBreakdownTable />

      {/* ── External Link ────────────────────────────────────────────── */}
      <div className="flex justify-end mt-6">
        <Link
          href="https://langfuse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors px-4 py-2 border border-[var(--border-hairline)] rounded-md hover:bg-[var(--bg-subtle)]"
        >
          Open in Langfuse <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
