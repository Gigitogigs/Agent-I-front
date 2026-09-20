import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { Metric } from "./use-stats";

export function MetricCard({ metric }: { metric: Metric }) {
  const hasTrend = !!metric.trend;
  
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-2">
        {metric.label}
      </h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-[var(--fg-base)] tabular-nums leading-none">
          {metric.value}
        </span>
        {hasTrend && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium tabular-nums px-1.5 py-0.5 rounded",
              metric.trend!.isGood
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
            )}
          >
            {metric.trend!.direction === "up" && <ArrowUpRight size={14} />}
            {metric.trend!.direction === "down" && <ArrowDownRight size={14} />}
            {metric.trend!.direction === "flat" && <Minus size={14} />}
            {metric.trend!.value}
          </div>
        )}
      </div>
    </div>
  );
}
