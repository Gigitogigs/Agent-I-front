import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AgentConfig, Provider } from "../use-agent-config";

interface ModelsKeysTabProps {
  config: AgentConfig;
  providers: Provider[];
  onChange: (updates: Partial<AgentConfig>) => void;
}

export function ModelsKeysTab({ config, providers, onChange }: ModelsKeysTabProps) {
  const [showKey, setShowKey] = useState(false);

  const selectedProvider = providers.find((p) => p.id === config.provider);
  const availableModels = selectedProvider?.models || [];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Provider */}
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <label className="text-sm font-medium text-[var(--fg-base)] mt-2">Provider</label>
        <select
          value={config.provider}
          onChange={(e) => {
            const provider = e.target.value;
            const models = providers.find((p) => p.id === provider)?.models || [];
            onChange({ provider, model: models[0] || "" });
          }}
          className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
        >
          {providers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <label className="text-sm font-medium text-[var(--fg-base)] mt-2">Model</label>
        <select
          value={config.model}
          onChange={(e) => onChange({ model: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
        >
          {availableModels.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* API Key */}
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <label className="text-sm font-medium text-[var(--fg-base)] mt-2">API Key</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => onChange({ apiKey: e.target.value })}
              placeholder={`sk-${config.provider}-...`}
              className="w-full pl-3 pr-10 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)] hover:text-[var(--fg-base)] p-1 transition-colors"
              title={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded hover:bg-[var(--bg-muted)] transition-colors">
            Test
          </button>
        </div>
      </div>

      {/* Fallback Model */}
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <div className="mt-2">
          <label className="text-sm font-medium text-[var(--fg-base)]">Fallback Model</label>
          <p className="text-xs text-[var(--fg-muted)] mt-1 pr-4">Used by Model Router if primary fails.</p>
        </div>
        <select
          value={config.fallbackModel}
          onChange={(e) => onChange({ fallbackModel: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
        >
          <option value="">None</option>
          {/* In a real app, this would be a grouped dropdown of all models across all providers */}
          <option value="gpt-4o">gpt-4o (OpenAI)</option>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo (OpenAI)</option>
          <option value="claude-3-haiku-20240307">claude-3-haiku (Anthropic)</option>
        </select>
      </div>
    </div>
  );
}
