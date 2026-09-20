"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";

import { ListDetailLayout } from "@/components/templates/list-detail/list-detail-layout";
import { ListPane } from "@/components/templates/list-detail/list-pane";
import { DetailPanel } from "@/components/templates/list-detail/detail-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { ApprovalRow } from "@/features/approvals/approval-row";
import { ApprovalDetail } from "@/features/approvals/approval-detail";
import {
  STUB_APPROVALS,
  STATUS_TABS,
  filterApprovals,
} from "@/features/approvals/use-approvals";
import type { Approval, ApprovalStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(STUB_APPROVALS);
  const [activeTab, setActiveTab] = useState<ApprovalStatus | "ALL">("PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(
    STUB_APPROVALS.find((a) => a.status === "PENDING")?.id ?? null
  );

  const visible = filterApprovals(approvals, activeTab);
  const selected = approvals.find((a) => a.id === selectedId) ?? null;

  function handleApprove(id: string) {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "APPROVED", resolvedAt: new Date().toISOString(), resolvedBy: "admin@autonomi.ai" }
          : a
      )
    );
  }

  function handleReject(id: string, reason: string) {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "REJECTED", resolvedAt: new Date().toISOString(), resolvedBy: "admin@autonomi.ai", rejectReason: reason }
          : a
      )
    );
  }

  return (
    <div className="flex flex-col h-full -m-4">
      {/* ── Page header + filter tabs ─────────────────────────────── */}
      <div className="px-4 pt-4 pb-0 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] shrink-0">
        <h1 className="text-sm font-semibold text-[var(--fg-base)] mb-3">Approvals</h1>

        {/* Status filter tabs */}
        <nav className="flex" role="tablist">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.id === "ALL"
                ? approvals.length
                : approvals.filter((a) => a.status === tab.id).length;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Auto-select first item in new tab
                  const first = filterApprovals(approvals, tab.id)[0];
                  setSelectedId(first?.id ?? null);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
                  active
                    ? "border-[var(--fg-base)] text-[var(--fg-base)]"
                    : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-base)]"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] px-1 py-0.5 rounded-sm tabular-nums",
                      active
                        ? "bg-[var(--fg-base)] text-[var(--bg-surface)]"
                        : "bg-[var(--bg-muted)] text-[var(--fg-muted)]"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── List + Detail ─────────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <ListDetailLayout
          listPane={
            <ListPane>
              {visible.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  title={
                    activeTab === "PENDING"
                      ? "No pending approvals"
                      : `No ${activeTab.toLowerCase()} approvals`
                  }
                  description={
                    activeTab === "PENDING"
                      ? "All caught up — new approvals will appear here."
                      : undefined
                  }
                />
              ) : (
                visible.map((a) => (
                  <ApprovalRow
                    key={a.id}
                    approval={a}
                    selected={a.id === selectedId}
                    onClick={() => setSelectedId(a.id)}
                  />
                ))
              )}
            </ListPane>
          }
          detailPane={
            selected ? (
              <ApprovalDetail
                key={selected.id}
                approval={selected}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-[var(--fg-subtle)]">
                  Select an approval to view details
                </p>
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
