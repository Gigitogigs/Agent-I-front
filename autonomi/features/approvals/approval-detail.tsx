"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { SlaCountdown } from "@/components/shared/sla-countdown";
import { relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Approval } from "@/types";

interface ApprovalDetailProps {
  approval: Approval;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function ApprovalDetail({ approval, onApprove, onReject }: ApprovalDetailProps) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const isPending = approval.status === "PENDING";

  function handleRejectClick() {
    setRejecting(true);
  }

  function handleRejectConfirm() {
    if (!reason.trim()) {
      setReasonError("A reason is required when rejecting.");
      return;
    }
    onReject(approval.id, reason.trim());
    setRejecting(false);
    setReason("");
    setReasonError("");
  }

  function handleCancel() {
    setRejecting(false);
    setReason("");
    setReasonError("");
  }

  return (
    <div className="p-5 h-full flex flex-col gap-5 overflow-y-auto">

      {/* ── Header ── */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-sm font-semibold text-[var(--fg-base)] leading-snug">
            {approval.actionSummary}
          </h2>
          <StatusBadge variant={approval.status} className="shrink-0 mt-0.5" />
        </div>
        <div className="h-px bg-[var(--border-hairline)] my-3" />
        <div className="flex items-center gap-4 text-xs text-[var(--fg-muted)]">
          <span>Requested by: <span className="text-[var(--fg-base)] font-medium">{approval.agentName}</span></span>
          {isPending
            ? <SlaCountdown expiresAt={approval.slaExpiresAt} />
            : approval.resolvedAt && (
              <span>Resolved {relativeTime(approval.resolvedAt)}</span>
            )
          }
        </div>
      </div>

      {/* ── Flagged reason ── */}
      <div>
        <p className="text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider mb-1.5">
          Flagged because
        </p>
        <p className="text-xs text-[var(--fg-muted)]">
          Refund amount exceeds the $50 auto-approval cap.
        </p>
      </div>

      {/* ── Parameters ── */}
      <div>
        <p className="text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider mb-2">
          Parameters
        </p>
        <dl className="space-y-1.5">
          {Object.entries(approval.parameters).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_1fr] gap-2 text-xs">
              <dt className="text-[var(--fg-muted)] font-medium">{k}</dt>
              <dd className="text-[var(--fg-base)]">{String(v)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Conversation summary ── */}
      <div>
        <p className="text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider mb-2">
          Conversation summary
        </p>
        <p className="text-xs text-[var(--fg-muted)] italic leading-relaxed">
          &ldquo;{approval.conversationSummary}&rdquo;
        </p>
        <Link
          href={`/conversations?id=${approval.conversationId}`}
          className="inline-flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] underline-offset-2 hover:underline transition-colors mt-2"
        >
          View full conversation <ArrowRight size={11} />
        </Link>
      </div>

      {/* ── Resolved by (non-pending) ── */}
      {!isPending && approval.resolvedBy && (
        <div>
          <p className="text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider mb-1.5">
            {approval.status === "APPROVED" ? "Approved by" : "Rejected by"}
          </p>
          <p className="text-xs text-[var(--fg-base)]">{approval.resolvedBy}</p>
          {approval.rejectReason && (
            <p className="text-xs text-[var(--fg-muted)] mt-1 italic">
              &ldquo;{approval.rejectReason}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* ── Action buttons (pending only) ── */}
      {isPending && (
        <div className="mt-auto pt-4 border-t border-[var(--border-hairline)] space-y-3">
          {!rejecting ? (
            <div className="flex items-center gap-3">
              <button
                id="approve-btn"
                onClick={() => onApprove(approval.id)}
                className="
                  flex-1 py-2 text-xs font-semibold
                  bg-[var(--fg-base)] text-[var(--bg-surface)]
                  hover:opacity-90 transition-opacity
                "
                style={{ borderRadius: "var(--radius-interactive)" }}
              >
                Approve
              </button>
              <button
                id="reject-btn"
                onClick={handleRejectClick}
                className="
                  flex-1 py-2 text-xs font-semibold
                  border border-[var(--border-hairline)]
                  text-[var(--fg-base)]
                  hover:bg-[var(--bg-muted)] transition-colors
                "
                style={{ borderRadius: "var(--radius-interactive)" }}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--fg-muted)]">
                Reason{" "}
                <span className="text-[var(--color-danger)]">*</span>
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                placeholder="Explain why this action is being rejected…"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) setReasonError("");
                }}
                className={cn(
                  "w-full px-3 py-2 text-xs resize-none",
                  "bg-[var(--bg-subtle)] text-[var(--fg-base)]",
                  "border placeholder:text-[var(--fg-subtle)]",
                  "focus:outline-none focus:border-[var(--fg-base)] transition-colors"
                )}
                style={{
                  borderRadius: "var(--radius-interactive)",
                  borderColor: reasonError ? "var(--color-danger)" : "var(--border-hairline)",
                }}
              />
              {reasonError && (
                <p className="text-[10px] text-[var(--color-danger)]">{reasonError}</p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleRejectConfirm}
                  className="
                    flex-1 py-1.5 text-xs font-semibold
                    bg-[var(--color-danger)] text-white
                    hover:opacity-90 transition-opacity
                  "
                  style={{ borderRadius: "var(--radius-interactive)" }}
                >
                  Confirm rejection
                </button>
                <button
                  onClick={handleCancel}
                  className="
                    px-3 py-1.5 text-xs text-[var(--fg-muted)]
                    border border-[var(--border-hairline)]
                    hover:text-[var(--fg-base)] hover:bg-[var(--bg-muted)] transition-colors
                  "
                  style={{ borderRadius: "var(--radius-interactive)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
