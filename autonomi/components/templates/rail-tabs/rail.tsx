import { cn } from "@/lib/utils";

interface RailItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  dividerAbove?: boolean;
}

export function RailItem({ label, active, onClick, dividerAbove }: RailItemProps) {
  return (
    <>
      {dividerAbove && (
        <div className="my-1 mx-3 border-t border-[var(--border-hairline)]" />
      )}
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left px-4 py-2.5 text-sm transition-colors",
          active
            ? "text-[var(--fg-base)] font-semibold bg-[var(--bg-muted)] border-l-2 border-[var(--fg-base)]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg-base)] hover:bg-[var(--bg-muted)] border-l-2 border-transparent"
        )}
      >
        {label}
      </button>
    </>
  );
}
