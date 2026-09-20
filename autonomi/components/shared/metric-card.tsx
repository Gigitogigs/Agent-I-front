import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;         // positive = up, negative = down
  deltaLabel?: string;    // e.g. "+2%" or "↓0.2s"
  unit?: string;          // suffix, e.g. "%" or "s"
  className?: string;
}

export function MetricCard({ label, value, delta, deltaLabel, unit, className }: MetricCardProps) {
  const TrendIcon =
    delta == null ? null : delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  const trendColor =
    delta == null ? ""
    : delta > 0   ? "text-[var(--color-success)]"
    : delta < 0   ? "text-[var(--color-danger)]"
    : "text-[var(--fg-muted)]";

  return (
    <div
      className={cn(
        "p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)]",
        className
      )}
    >
      <p className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[var(--fg-base)] tabular-nums">
        {value}{unit}
      </p>
      {TrendIcon && (
        <div className={cn("flex items-center gap-1 mt-1 text-xs", trendColor)}>
          <TrendIcon size={12} />
          <span>{deltaLabel ?? (delta > 0 ? `+${delta}` : delta)}</span>
        </div>
      )}
    </div>
  );
}
