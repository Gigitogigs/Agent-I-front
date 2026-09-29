"use client";

import { CheckCircle, BarChart2, Wifi, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/shared/metric-card";
import { SlaCountdown } from "@/components/shared/sla-countdown";
import { StatusBadge } from "@/components/shared/status-badge";
import { useHomepageSummary } from "@/hooks/use-homepage-summary";

export default function HomePage() {
  const { data: summary, isPending, error } = useHomepageSummary();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[var(--fg-muted)]" size={24} />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-4 text-sm text-[var(--color-danger)] bg-[var(--bg-surface)] border border-[var(--color-danger)] rounded">
        Failed to load dashboard summary.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-[var(--fg-base)]">Home</h1>

      {/* ── Pending Approvals ── */}
      <section className="border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-base)]">
            <CheckCircle size={14} className="text-[var(--fg-muted)]" />
            Pending Approvals ({summary.pendingApprovalCount})
          </div>
          <Link
            href="/approvals"
            className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-hairline)]">
          {summary.pendingApprovals.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3">
              <StatusBadge variant={a.riskLevel} />
              <span className="flex-1 text-sm text-[var(--fg-base)] truncate">{a.summary}</span>
              <SlaCountdown expiresAt={a.slaExpiresAt} />
            </div>
          ))}
          {summary.pendingApprovals.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[var(--fg-muted)]">
              No pending approvals.
            </div>
          )}
        </div>
      </section>

      {/* ── Stats + Health row ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Agent Stats snapshot */}
        <section className="border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-hairline)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-base)]">
              <BarChart2 size={14} className="text-[var(--fg-muted)]" />
              Agent Stats
            </div>
            <Link
              href="/agent-stats"
              className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
            >
              View full stats <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[var(--border-hairline)] border-t border-[var(--border-hairline)]">
            <MetricCard label="Resolution Rate"    value={summary.stats.resolutionRate} className="border-none" />
            <MetricCard label="Active Convos"      value={summary.stats.activeConversations} className="border-none" />
            <MetricCard label="Avg Latency"        value={summary.stats.avgLatency} className="border-none" />
            <MetricCard label="Guardrail Blocks"   value={summary.stats.guardrailBlockRate} className="border-none" />
          </div>
        </section>

        {/* System Health */}
        <section className="border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-hairline)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-base)]">
              <Wifi size={14} className="text-[var(--fg-muted)]" />
              System Health
            </div>
            <Link
              href="/settings"
              className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
            >
              View integrations <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="px-5 py-4 space-y-2.5">
            {summary.systemHealth.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.ok ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`} />
                <span className="text-[var(--fg-base)]">{item.label}</span>
                <span className="ml-auto text-xs text-[var(--fg-muted)]">{item.ok ? "connected" : "error"}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Recent Conversations ── */}
      <section className="border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-base)]">
            <MessageSquare size={14} className="text-[var(--fg-muted)]" />
            Recent Conversations
          </div>
          <Link
            href="/conversations"
            className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-hairline)]">
          {summary.recentConversations.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3">
              <StatusBadge variant={c.status} />
              <span className="text-xs text-[var(--fg-muted)] shrink-0">#{c.id}</span>
              <span className="flex-1 text-sm text-[var(--fg-base)] truncate">{c.summary}</span>
            </div>
          ))}
          {summary.recentConversations.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[var(--fg-muted)]">
              No recent conversations.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
