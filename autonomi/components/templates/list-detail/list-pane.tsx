import { cn } from "@/lib/utils";

interface ListPaneProps {
  header?: React.ReactNode;   // e.g. filter tabs
  children: React.ReactNode;
  className?: string;
}

export function ListPane({ header, children, className }: ListPaneProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {header && (
        <div className="shrink-0 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
          {header}
        </div>
      )}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
