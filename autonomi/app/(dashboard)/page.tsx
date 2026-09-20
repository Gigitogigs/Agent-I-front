import type { Metadata } from "next";
import { CheckCircle, BarChart2, Wifi, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/shared/metric-card";
import { SlaCountdown } from "@/components/shared/sla-countdown";
import { StatusBadge } from "@/components/shared/status-badge";

export const metadata: Metadata = {
  title: "Home — Autonomi",
  description: "Dashboard overview for Autonomi",
};

// ── Stub data (replace with TanStack Query fetches) ──────────────────────
const PENDING_APPROVALS = [
  { id: "1", summary: "Refund $84 — order #4471",   risk: "HIGH" as const, expiresAt: new Date(Date.now() + 4  * 60_000).toISOString() },
  { id: "2", summary: "Cancel order #4502",          risk: "MED"  as const, expiresAt: new Date(Date.now() + 12 * 60_000).toISOString() },
  { id: "3", summary: "Address change — #4498",      risk: "LOW"  as const, expiresAt: new Date(Date.now() + 60 * 60_000).toISOString() },
];

const RECENT_CONVERSATIONS = [
  { id: "221", status: "ESCALATED" as const, summary: "damaged item, refund request" },
  { id: "219", status: "RESOLVED"  as const, summary: "where's my order" },
  { id: "217", status: "ESCALATED" as const, summary: "refund dispute" },
];

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-[var(--fg-base)]">Home</h1>

      {/* ── Pending Approvals ── */}
      <section className="border border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--fg-base)]">
            <CheckCircle size={14} className="text-[var(--fg-muted)]" />
            Pending Approvals
          </div>
          <Link
            href="/approvals"
            className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-hairline)]">
          {PENDING_APPROVALS.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3">
              <StatusBadge variant={a.risk} />
              <span className="flex-1 text-sm text-[var(--fg-base)] truncate">{a.summary}</span>
              <SlaCountdown expiresAt={a.expiresAt} />
            </div>
          ))}
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
            <MetricCard label="Resolution Rate"    value="87"   unit="%" delta={2}    deltaLabel="+2%" className="border-none" />
            <MetricCard label="Active Convos"      value={12}               className="border-none" />
            <MetricCard label="Avg Latency"        value="1.4"  unit="s" delta={-1} deltaLabel="↓0.2s" className="border-none" />
            <MetricCard label="Guardrail Blocks"   value="2.1"  unit="%" delta={0.4} deltaLabel="+0.4%" className="border-none" />
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
            {[
              { label: "Shopify adapter",  ok: true },
              { label: "Orchestrator",     ok: true },
              { label: "Retrieval Agent",  ok: true },
              { label: "Action Agent",     ok: true },
              { label: "Escalation Agent", ok: true },
            ].map((item) => (
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
          {RECENT_CONVERSATIONS.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3">
              <StatusBadge variant={c.status} />
              <span className="text-xs text-[var(--fg-muted)] shrink-0">#{c.id}</span>
              <span className="flex-1 text-sm text-[var(--fg-base)] truncate">{c.summary}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
