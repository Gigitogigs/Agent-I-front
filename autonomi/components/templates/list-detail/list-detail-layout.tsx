import { cn } from "@/lib/utils";

interface ListDetailLayoutProps {
  listPane: React.ReactNode;
  detailPane: React.ReactNode;
  className?: string;
}

/**
 * List + Detail template — used by Approvals (fixed split) and Conversations (slide-over variant).
 * The list pane is narrower; the detail pane gets the majority of the space.
 */
export function ListDetailLayout({ listPane, detailPane, className }: ListDetailLayoutProps) {
  return (
    <div className={cn("flex h-full overflow-hidden", className)}>
      {/* List pane */}
      <div className="w-72 shrink-0 flex flex-col border-r border-[var(--border-hairline)] overflow-hidden">
        {listPane}
      </div>
      {/* Detail pane */}
      <div className="flex-1 min-w-0 overflow-y-auto bg-[var(--bg-subtle)]">
        {detailPane}
      </div>
    </div>
  );
}
