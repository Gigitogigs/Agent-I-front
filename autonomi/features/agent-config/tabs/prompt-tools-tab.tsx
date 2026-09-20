import { RotateCcw } from "lucide-react";
import type { AgentConfig } from "../use-agent-config";

interface PromptToolsTabProps {
  config: AgentConfig;
  onChange: (updates: Partial<AgentConfig>) => void;
}

export function PromptToolsTab({ config, onChange }: PromptToolsTabProps) {
  return (
    <div className="max-w-2xl space-y-8">
      {/* System Prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[var(--fg-base)]">System Prompt</label>
          <button 
            className="flex items-center gap-1.5 text-xs text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors"
            title="Reset to default prompt for this agent"
          >
            <RotateCcw size={12} />
            Reset to default
          </button>
        </div>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => onChange({ systemPrompt: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 text-sm font-mono bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors resize-y"
          placeholder="You are a helpful assistant..."
        />
        <p className="text-xs text-[var(--fg-muted)] mt-2">
          This prompt is injected before every turn. Use it to define the agent's persona and constraints.
        </p>
      </div>

      {/* Tool Allowlist */}
      <div>
        <label className="text-sm font-medium text-[var(--fg-base)] mb-2 block">Tool Allowlist</label>
        {config.tools.length === 0 ? (
          <div className="px-4 py-3 text-sm text-[var(--fg-muted)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded italic">
            This agent has no tools available.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {config.tools.map((tool) => (
              <div 
                key={tool}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded-full flex items-center"
              >
                {tool}
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-[var(--fg-muted)] mt-3">
          Read-only list of tools this agent is permitted to call. Managed via code deployment.
        </p>
      </div>
    </div>
  );
}
