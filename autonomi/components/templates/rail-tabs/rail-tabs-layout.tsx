import { cn } from "@/lib/utils";

interface RailTabsLayoutProps {
  rail: React.ReactNode;
  tabs: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

/**
 * Rail + Tabs template — used by Agent Configuration and Settings.
 * Rail picks *which agent / section*. Tabs pick *which aspect*.
 * They are independent axes and don't visually merge.
 */
export function RailTabsLayout({ rail, tabs, content, className }: RailTabsLayoutProps) {
  return (
    <div className={cn("flex h-full overflow-hidden", className)}>
      {/* Rail (agent / section list) */}
      <aside className="w-44 shrink-0 flex flex-col border-r border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-y-auto">
        {rail}
      </aside>
      {/* Main: tabs + content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="shrink-0 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
          {tabs}
        </div>
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-subtle)]">
          {content}
        </div>
      </div>
    </div>
  );
}
