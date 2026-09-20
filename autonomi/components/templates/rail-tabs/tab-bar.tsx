import { cn } from "@/lib/utils";

interface TabBarItem {
  id: string;
  label: string;
}

interface TabBarProps {
  items: TabBarItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabBar({ items, activeId, onChange, className }: TabBarProps) {
  return (
    <nav className={cn("flex", className)} role="tablist">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              active
                ? "border-[var(--fg-base)] text-[var(--fg-base)]"
                : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-base)]"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
