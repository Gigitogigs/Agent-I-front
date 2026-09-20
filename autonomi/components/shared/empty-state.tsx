import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
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
      {action}
    </div>
  );
}
