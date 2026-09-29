import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-10 h-10 rounded flex items-center justify-center bg-[var(--bg-muted)] mb-4">
          <Icon size={20} className="text-[var(--fg-subtle)]" />
        </div>
      )}
      <p className="text-sm font-semibold text-[var(--fg-base)] mb-1">{title}</p>
      {description && (
        <p className="text-xs text-[var(--fg-muted)] max-w-xs mb-4">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-4 py-2 text-xs font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] hover:opacity-90 transition-opacity"
          style={{ borderRadius: "var(--radius-interactive)" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
