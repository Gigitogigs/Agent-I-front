import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { SlaCountdown } from "@/components/shared/sla-countdown";
import type { Approval } from "@/types";

interface ApprovalRowProps {
  approval: Approval;
  selected: boolean;
  onClick: () => void;
}

export function ApprovalRow({ approval, selected, onClick }: ApprovalRowProps) {
  const isPending = approval.status === "PENDING";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-3 border-b border-[var(--border-hairline)]",
        "transition-colors hover:bg-[var(--bg-muted)]",
        selected && "bg-[var(--bg-muted)] border-l-2 border-l-[var(--fg-base)]"
      )}
    >
      {/* Row 1: risk badge + SLA / resolved timestamp */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <StatusBadge variant={approval.riskLevel} />
        {isPending ? (
          <SlaCountdown expiresAt={approval.slaExpiresAt} />
        ) : (
          <span className="text-[10px] text-[var(--fg-subtle)] tabular-nums">
            {approval.resolvedAt
              ? relativeTime(approval.resolvedAt)
              : relativeTime(approval.slaExpiresAt)}
          </span>
        )}
      </div>

      {/* Row 2: summary */}
      <p className="text-xs font-medium text-[var(--fg-base)] leading-snug truncate">
        {approval.actionSummary}
      </p>

      {/* Row 3: agent + created */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-[var(--fg-subtle)]">{approval.agentName}</span>
        <span className="text-[10px] text-[var(--fg-subtle)]">{relativeTime(approval.createdAt)}</span>
      </div>
    </button>
  );
}
