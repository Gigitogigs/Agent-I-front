import type { AgentConfig } from "../use-agent-config";

interface GuardrailsTabProps {
  config: AgentConfig;
  onChange: (updates: Partial<AgentConfig>) => void;
}

export function GuardrailsTab({ config, onChange }: GuardrailsTabProps) {
  const { guardrails } = config;

  const updateGuardrails = (updates: Partial<AgentConfig["guardrails"]>) => {
    onChange({ guardrails: { ...guardrails, ...updates } });
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Policy Checks (Toggles) */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Policy Checks</h3>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={guardrails.pii}
              onChange={(e) => updateGuardrails({ pii: e.target.checked })}
              className="mt-1 shrink-0 cursor-pointer"
            />
            <div>
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors">
                PII Detection
              </div>
              <div className="text-xs text-[var(--fg-muted)]">
                Redact or block Personally Identifiable Information in inputs and outputs.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={guardrails.toxicity}
              onChange={(e) => updateGuardrails({ toxicity: e.target.checked })}
              className="mt-1 shrink-0 cursor-pointer"
            />
            <div>
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors">
                Toxicity Filter
              </div>
              <div className="text-xs text-[var(--fg-muted)]">
                Block harmful, offensive, or inappropriate language.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={guardrails.promptInjection}
              onChange={(e) => updateGuardrails({ promptInjection: e.target.checked })}
              className="mt-1 shrink-0 cursor-pointer"
            />
            <div>
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors">
                Prompt Injection Screening
              </div>
              <div className="text-xs text-[var(--fg-muted)]">
                Detect and block attempts to override system instructions.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Hand-rolled Limits (Numeric) - Only show if applicable to this agent */}
      {(guardrails.refundCap !== undefined || guardrails.discountLimit !== undefined) && (
        <div className="pt-6 border-t border-[var(--border-hairline)]">
          <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Business Limits</h3>
          <div className="space-y-6">
            {guardrails.refundCap !== undefined && (
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label className="text-sm font-medium text-[var(--fg-base)]">Max Refund ($)</label>
                <input
                  type="number"
                  value={guardrails.refundCap}
                  onChange={(e) => updateGuardrails({ refundCap: Number(e.target.value) })}
                  className="w-32 px-3 py-1.5 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
                />
              </div>
            )}
            
            {guardrails.discountLimit !== undefined && (
              <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                <label className="text-sm font-medium text-[var(--fg-base)]">Max Discount (%)</label>
                <input
                  type="number"
                  value={guardrails.discountLimit}
                  onChange={(e) => updateGuardrails({ discountLimit: Number(e.target.value) })}
                  className="w-32 px-3 py-1.5 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
