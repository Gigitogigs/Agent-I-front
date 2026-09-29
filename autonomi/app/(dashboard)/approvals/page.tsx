"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

import { ListDetailLayout } from "@/components/templates/list-detail/list-detail-layout";
import { ListPane } from "@/components/templates/list-detail/list-pane";
import { DetailPanel } from "@/components/templates/list-detail/detail-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { ApprovalRow } from "@/features/approvals/approval-row";
import { ApprovalDetail } from "@/features/approvals/approval-detail";
import {
  STATUS_TABS,
  useApprovals,
  useApproveAction,
  useRejectAction,
} from "@/features/approvals/use-approvals";
import type { ApprovalStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<ApprovalStatus | "ALL">("PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: approvals = [], isLoading, error } = useApprovals(activeTab);
  const approveMutation = useApproveAction();
  const rejectMutation = useRejectAction();

  // Auto-select first item when data loads and nothing is selected
  const lastAutoSelectTab = useRef<ApprovalStatus | "ALL" | null>(null);

  useEffect(() => {
    // Only auto-select when we switch tabs and load new data, not every time selectedId is null
    if (approvals.length > 0 && !selectedId && !isLoading && lastAutoSelectTab.current !== activeTab) {
      setSelectedId(approvals[0].id);
      lastAutoSelectTab.current = activeTab;
    }
  }, [approvals, selectedId, isLoading, activeTab]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const selected = approvals.find((a) => a.id === selectedId) ?? null;

  function handleApprove(id: string) {
    approveMutation.mutate(id);
  }

  async function handleReject(id: string, reason: string): Promise<void> {
    await rejectMutation.mutateAsync({ approvalId: id, reason });
  }

  return (
    <div className="flex flex-col h-full -m-4">
      {/* ── Page header + filter tabs ─────────────────────────────── */}
      <div className="px-4 pt-4 pb-0 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] shrink-0">
        <h1 className="text-sm font-semibold text-[var(--fg-base)] mb-3">Approvals</h1>

        {/* Status filter tabs */}
        <nav className="flex" role="tablist">
          {STATUS_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedId(null); // Reset selection on tab change
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
                  active
                    ? "border-[var(--fg-base)] text-[var(--fg-base)]"
                    : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-base)]"
                )}
              >
                {tab.label}
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
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin text-[var(--fg-muted)]" size={20} />
                </div>
              ) : error ? (
                <div className="p-4 text-sm text-[var(--color-danger)] text-center">
                  Failed to load approvals.
                </div>
              ) : approvals.length === 0 ? (
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
                approvals.map((a) => (
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
                isApprovePending={approveMutation.isPending}
                isRejectPending={rejectMutation.isPending}
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
