"use client";

import { cn } from "@/lib/utils";

interface SaveChangesFooterProps {
  onSave: () => void;
  onDiscard?: () => void;
  isDirty?: boolean;
  isSaving?: boolean;
  className?: string;
}

export function SaveChangesFooter({
  onSave,
  onDiscard,
  isDirty = false,
  isSaving = false,
  className,
}: SaveChangesFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 pt-4 mt-6",
        "border-t border-[var(--border-hairline)]",
        className
      )}
    >
      {onDiscard && (
        <button
          type="button"
          onClick={onDiscard}
          disabled={!isDirty || isSaving}
          className="px-4 py-1.5 text-sm border border-[var(--border-hairline)] text-[var(--fg-base)] hover:bg-[var(--bg-muted)] disabled:opacity-40 transition-colors"
          style={{ borderRadius: "var(--radius-interactive)" }}
        >
          Discard
        </button>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className="px-4 py-1.5 text-sm bg-[var(--fg-base)] text-[var(--bg-surface)] hover:opacity-90 disabled:opacity-40 transition-opacity font-medium"
        style={{ borderRadius: "var(--radius-interactive)" }}
      >
        {isSaving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
