import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AgentConfig, Provider } from "../use-agent-config";

interface ModelsKeysTabProps {
  config: AgentConfig;
  providers: Provider[];
  onChange: (updates: Partial<AgentConfig>) => void;
  isGlobal?: boolean;
  onSaveApiKey: (providerId: string, apiKey: string) => Promise<void>;
  isSavingApiKey?: boolean;
}

export function ModelsKeysTab({ config, providers, onChange, isGlobal = false, onSaveApiKey, isSavingApiKey = false }: ModelsKeysTabProps) {
  const [showKey, setShowKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");

  const selectedProvider = providers.find((p) => p.id === config.provider);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <div className="mt-2">
          <label className="text-sm font-medium text-[var(--fg-base)]">Provider</label>
        </div>
        <div>
          <select
            value={config.provider || ""}
            onChange={(e) => {
              const provider = e.target.value;
              onChange({ provider, model: "" });
            }}
            disabled={!isGlobal}
            className={`w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none transition-colors ${
              !isGlobal ? "opacity-70 cursor-not-allowed bg-[var(--bg-subtle)]" : "focus:border-[var(--fg-base)]"
            }`}
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {!isGlobal && (
            <p className="text-xs text-[var(--fg-muted)] mt-2">
              Provider selection is locked at the workspace level. Change this in the <strong>Global Config</strong> tab.
            </p>
          )}
        </div>
      </div>

      {/* Model */}
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <label className="text-sm font-medium text-[var(--fg-base)] mt-2">Model</label>
        <input
          type="text"
          value={config.model || ""}
          onChange={(e) => onChange({ model: e.target.value })}
          placeholder="e.g. gpt-4o, claude-3-5-sonnet"
          className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
        />
      </div>

      {/* API Key Hint */}
      {isGlobal && (
        <div className="grid grid-cols-[160px_1fr] items-start gap-4">
          <label className="text-sm font-medium text-[var(--fg-base)] mt-2">API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? "text" : "password"}
                value={newApiKey || config.apiKeyHint || ""}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder={`sk-${config.provider || "provider"}-...`}
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
            <button 
              onClick={() => config.provider && newApiKey && onSaveApiKey(config.provider, newApiKey)}
              disabled={!newApiKey || isSavingApiKey}
              className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded hover:bg-[var(--bg-muted)] disabled:opacity-50 transition-colors"
            >
              {isSavingApiKey ? "Saving..." : "Save Key"}
            </button>
          </div>
        </div>
      )}

      {/* Fallback Model */}
      <div className="grid grid-cols-[160px_1fr] items-start gap-4">
        <div className="mt-2">
          <label className="text-sm font-medium text-[var(--fg-base)]">Fallback Model</label>
          <p className="text-xs text-[var(--fg-muted)] mt-1 pr-4">Used by Model Router if primary fails.</p>
        </div>
        <input
          type="text"
          value={config.fallbackModel || ""}
          onChange={(e) => onChange({ fallbackModel: e.target.value })}
          placeholder="e.g. gpt-3.5-turbo (Optional)"
          className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
        />
      </div>
    </div>
  );
}
