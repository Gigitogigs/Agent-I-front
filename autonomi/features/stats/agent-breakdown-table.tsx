import { STUB_AGENT_STATS } from "./use-stats";

export function AgentBreakdownTable() {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg overflow-hidden mt-8">
      <div className="px-4 py-3 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)]">
        <h3 className="text-sm font-semibold text-[var(--fg-base)]">Per-Agent Breakdown</h3>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
            <th className="px-4 py-2 font-semibold">Agent</th>
            <th className="px-4 py-2 font-semibold text-right">Calls</th>
            <th className="px-4 py-2 font-semibold text-right">Avg Latency</th>
            <th className="px-4 py-2 font-semibold text-right">Fallback %</th>
            <th className="px-4 py-2 font-semibold text-right">Error %</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
          {STUB_AGENT_STATS.map((stat, i) => (
            <tr key={stat.agentName} className="hover:bg-[var(--bg-muted)] transition-colors">
              <td className="px-4 py-3 font-medium flex items-center gap-2">
                {/* Visual ordering numbers to imply flow */}
                <span className="w-4 h-4 rounded-full bg-[var(--bg-muted)] text-[var(--fg-subtle)] text-[10px] flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {stat.agentName}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{stat.calls.toLocaleString()}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--fg-muted)]">{stat.avgLatency}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--fg-muted)]">{stat.fallbackRate}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--fg-muted)]">{stat.errorRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
