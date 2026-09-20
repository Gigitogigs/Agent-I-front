import { Store, Workflow, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectedIntegration, AvailableIntegration } from "../use-settings";

interface IntegrationsTabProps {
  connected: ConnectedIntegration[];
  available: AvailableIntegration[];
}

export function IntegrationsTab({ connected, available }: IntegrationsTabProps) {
  return (
    <div className="max-w-3xl space-y-10 pb-12">
      {/* My Connectors */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">My Connectors</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/3">Connector</th>
                <th className="px-4 py-2 font-semibold w-1/4">Status</th>
                <th className="px-4 py-2 font-semibold w-1/4">Last Sync</th>
                <th className="px-4 py-2 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {connected.map((integration) => (
                <tr key={integration.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {integration.type === "shopify" && <Store size={16} className="text-[var(--fg-subtle)]" />}
                      {integration.type === "in-house" && <Workflow size={16} className="text-[var(--fg-subtle)]" />}
                      <span className="font-medium">{integration.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", integration.status === "connected" ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]")} />
                      <span className="capitalize text-xs">{integration.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    {integration.lastSync || "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-medium text-[var(--fg-base)] hover:underline">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {connected.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                    No connected integrations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Connectors */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Available Connectors</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <div className="p-3 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]" size={14} />
              <input 
                type="text" 
                placeholder="Search connectors..." 
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-[var(--bg-muted)] text-[var(--fg-base)] border border-transparent rounded focus:outline-none focus:border-[var(--border-hairline)] transition-colors"
              />
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/2">Connector</th>
                <th className="px-4 py-2 font-semibold w-1/4">Category</th>
                <th className="px-4 py-2 font-semibold w-1/4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {available.map((integration) => (
                <tr key={integration.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3 font-medium">{integration.name}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{integration.category}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-1 rounded hover:bg-[var(--bg-muted)] transition-colors">
                      <Plus size={12} /> Connect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Connector */}
      <div className="pt-8 border-t border-[var(--border-hairline)]">
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-2">Don't see your platform?</h3>
        <p className="text-sm text-[var(--fg-muted)] mb-4">
          Connect your in-house database or a third-party platform using our universal MCP adapter.
        </p>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 rounded hover:bg-[var(--bg-muted)] transition-colors">
          <Plus size={14} /> Add custom connector
        </button>
      </div>
    </div>
  );
}
