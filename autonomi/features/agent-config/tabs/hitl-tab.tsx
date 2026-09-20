import { Plus, Trash2 } from "lucide-react";
import type { AgentConfig } from "../use-agent-config";

interface HitlTabProps {
  config: AgentConfig;
  onChange: (updates: Partial<AgentConfig>) => void;
}

export function HitlTab({ config, onChange }: HitlTabProps) {
  const breakpoints = config.hitlBreakpoints;

  const updateBreakpoint = (index: number, updates: Partial<AgentConfig["hitlBreakpoints"][0]>) => {
    const newBreakpoints = [...breakpoints];
    newBreakpoints[index] = { ...newBreakpoints[index], ...updates };
    onChange({ hitlBreakpoints: newBreakpoints });
  };

  const removeBreakpoint = (index: number) => {
    const newBreakpoints = breakpoints.filter((_, i) => i !== index);
    onChange({ hitlBreakpoints: newBreakpoints });
  };

  const addBreakpoint = () => {
    const newBreakpoints = [
      ...breakpoints,
      { id: `b_${Date.now()}`, label: "New Condition", expiryBehavior: "auto-escalate" as const, slaWindowMins: 60 }
    ];
    onChange({ hitlBreakpoints: newBreakpoints });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-base)]">Human-in-the-Loop Breakpoints</h3>
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Conditions that trigger manual review before the agent proceeds.
          </p>
        </div>
        <button 
          onClick={addBreakpoint}
          className="flex items-center gap-1.5 text-xs font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Add Breakpoint
        </button>
      </div>

      {breakpoints.length === 0 ? (
        <div className="px-6 py-8 text-center bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg text-[var(--fg-muted)] text-sm">
          No active HITL breakpoints for this agent. It operates fully autonomously.
        </div>
      ) : (
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/3">Trigger Condition</th>
                <th className="px-4 py-2 font-semibold w-1/4">Expiry Behavior</th>
                <th className="px-4 py-2 font-semibold w-1/4">SLA Window (mins)</th>
                <th className="px-4 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {breakpoints.map((bp, i) => (
                <tr key={bp.id} className="hover:bg-[var(--bg-muted)] transition-colors group">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={bp.label}
                      onChange={(e) => updateBreakpoint(i, { label: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent focus:border-[var(--fg-base)] focus:outline-none transition-colors"
                      placeholder="e.g. Low Confidence"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={bp.expiryBehavior}
                      onChange={(e) => updateBreakpoint(i, { expiryBehavior: e.target.value as "auto-escalate" | "auto-reject" })}
                      className="w-full bg-transparent focus:outline-none text-sm"
                    >
                      <option value="auto-escalate">Auto-escalate to human</option>
                      <option value="auto-reject">Auto-reject action</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={bp.slaWindowMins}
                      onChange={(e) => updateBreakpoint(i, { slaWindowMins: Number(e.target.value) })}
                      className="w-20 bg-transparent text-right tabular-nums border-b border-transparent focus:border-[var(--fg-base)] focus:outline-none transition-colors"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeBreakpoint(i)}
                      className="text-[var(--fg-subtle)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100 p-1"
                      title="Remove breakpoint"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
