import { cn } from "@/lib/utils";

interface DetailPanelProps {
  children: React.ReactNode;
  empty?: React.ReactNode;   // content shown when nothing is selected
  className?: string;
}

export function DetailPanel({ children, empty, className }: DetailPanelProps) {
  return (
    <div className={cn("h-full p-6", className)}>
      {children ?? empty}
    </div>
  );
}

/* ── Slide-over variant (Conversations) ──────────────────────────────── */
interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  if (!open) return null;
  return (
    <>
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-40 w-[70%] max-w-3xl bg-[var(--bg-surface)] border-l border-[var(--border-hairline)] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-hairline)] shrink-0">
          {title && <span className="text-sm font-semibold text-[var(--fg-base)]">{title}</span>}
          <button
            onClick={onClose}
            className="text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors text-xl leading-none ml-auto"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
}
