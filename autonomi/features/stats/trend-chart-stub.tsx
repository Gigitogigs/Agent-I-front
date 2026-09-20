export function TrendChartStub({ title, description, variant = "line" }: { title: string, description: string, variant?: "line" | "bar" }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg p-5">
      <h3 className="text-sm font-semibold text-[var(--fg-base)]">{title}</h3>
      <p className="text-xs text-[var(--fg-muted)] mb-4">{description}</p>
      
      {/* SVG stub since we don't have recharts/chart.js yet */}
      <div className="h-32 w-full flex items-end justify-between gap-1 opacity-50">
        {variant === "bar" ? (
          // Bar chart stub
          Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--fg-base)] w-full rounded-t-sm"
              style={{ height: `${20 + Math.random() * 80}%` }}
            />
          ))
        ) : (
          // Line chart stub (using a simple polyline)
          <svg className="w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points="0,80 10,75 20,85 30,50 40,60 50,20 60,30 70,10 80,40 90,20 100,5"
              fill="none"
              stroke="var(--fg-base)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Gradient fill under the line */}
            <polygon
              points="0,100 0,80 10,75 20,85 30,50 40,60 50,20 60,30 70,10 80,40 90,20 100,5 100,100"
              fill="var(--fg-base)"
              opacity="0.1"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
