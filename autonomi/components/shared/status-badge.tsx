import { cn } from "@/lib/utils";
import type { RiskLevel, ApprovalStatus, ConversationStatus, DocStatus } from "@/types";

type StatusVariant = RiskLevel | ApprovalStatus | ConversationStatus | DocStatus;

const VARIANT_STYLES: Record<StatusVariant, string> = {
  // Risk
  HIGH:        "bg-red-100   text-red-700   dark:bg-red-950   dark:text-red-400",
  MED:         "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  LOW:         "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  // Approval status
  PENDING:     "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  APPROVED:    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  REJECTED:    "bg-red-100   text-red-700   dark:bg-red-950   dark:text-red-400",
  EXPIRED:     "bg-gray-100  text-gray-600  dark:bg-gray-800  dark:text-gray-400",
  CANCELLED:   "bg-gray-100  text-gray-600  dark:bg-gray-800  dark:text-gray-400",
  // Conversation status
  RESOLVED:    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  ESCALATED:   "bg-red-100   text-red-700   dark:bg-red-950   dark:text-red-400",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  // KB doc status
  PROCESSING:  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  READY:       "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  FAILED:      "bg-red-100   text-red-700   dark:bg-red-950   dark:text-red-400",
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold tracking-wide rounded",
        VARIANT_STYLES[variant] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {label ?? variant}
    </span>
  );
}
