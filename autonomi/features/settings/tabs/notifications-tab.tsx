import { MessageSquare, Mail, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationSettings } from "../use-settings";

interface NotificationsTabProps {
  settings: NotificationSettings;
  onChange: (updates: Partial<NotificationSettings>) => void;
}

export function NotificationsTab({ settings, onChange }: NotificationsTabProps) {
  const updateEvents = (updates: Partial<NotificationSettings["events"]>) => {
    onChange({ events: { ...settings.events, ...updates } });
  };

  return (
    <div className="max-w-3xl space-y-10 pb-12">
      {/* Connected Channels */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Connected Channels</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/4">Channel</th>
                <th className="px-4 py-2 font-semibold w-1/3">Destination</th>
                <th className="px-4 py-2 font-semibold w-1/4">Status</th>
                <th className="px-4 py-2 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {settings.connectedChannels.map((channel) => (
                <tr key={channel.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {channel.type === "slack" && <MessageSquare size={16} className="text-[var(--fg-subtle)]" />}
                      {channel.type === "email" && <Mail size={16} className="text-[var(--fg-subtle)]" />}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{channel.destination}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", channel.status === "connected" ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]")} />
                      <span className="capitalize text-xs">{channel.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-medium text-[var(--fg-base)] hover:underline">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {settings.connectedChannels.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                    No connected channels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Channels */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Available Channels</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-3/4">Channel</th>
                <th className="px-4 py-2 font-semibold w-1/4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {settings.availableChannels.map((channel) => (
                <tr key={channel.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3 font-medium">{channel.name}</td>
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

      {/* Settings / Webhook */}
      <div className="pt-8 border-t border-[var(--border-hairline)] space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Webhook</h3>
          <div className="max-w-xl grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">URL</label>
            <input
              type="url"
              value={settings.webhookUrl}
              onChange={(e) => onChange({ webhookUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
              placeholder="https://hooks.yourdomain.com/..."
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Notify me when:</h3>
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.events.newEscalation}
                onChange={(e) => updateEvents({ newEscalation: e.target.checked })}
                className="mt-1 shrink-0 cursor-pointer"
              />
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors mt-0.5">
                New escalation
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.events.slaBreach}
                onChange={(e) => updateEvents({ slaBreach: e.target.checked })}
                className="mt-1 shrink-0 cursor-pointer"
              />
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors mt-0.5">
                SLA breach
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.events.approvalExpired}
                onChange={(e) => updateEvents({ approvalExpired: e.target.checked })}
                className="mt-1 shrink-0 cursor-pointer"
              />
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors mt-0.5">
                Approval expired
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.events.guardrailBlock}
                onChange={(e) => updateEvents({ guardrailBlock: e.target.checked })}
                className="mt-1 shrink-0 cursor-pointer"
              />
              <div className="text-sm font-medium text-[var(--fg-base)] group-hover:text-[var(--fg-base)] transition-colors mt-0.5">
                Guardrail block
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
