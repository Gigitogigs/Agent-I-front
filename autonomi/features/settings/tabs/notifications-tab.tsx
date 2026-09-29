import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Mail, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationChannel } from "../use-settings";
import { useNotifications, useUpdateNotificationChannel, useAddNotificationChannel } from "../use-settings";

export function NotificationsTab() {
  const { activeWorkspaceId, isLoading: isAuthLoading } = useAuth();
  const { data: channels, isLoading, error } = useNotifications();
  const updateMutation = useUpdateNotificationChannel();
  const addMutation = useAddNotificationChannel();

  const handleToggleEvent = (channel: NotificationChannel, field: "on_escalation" | "on_sla_breach") => {
    updateMutation.mutate({
      id: channel.id,
      channel_type: channel.channel_type,
      name: channel.name,
      config: channel.config,
      is_active: channel.is_active,
      on_escalation: channel.on_escalation,
      on_sla_breach: channel.on_sla_breach,
      [field]: !channel[field]
    });
  };

  if (isAuthLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }

  if (!activeWorkspaceId) {
    return <div className="p-8 text-[var(--fg-muted)] text-center">No active workspace found.</div>;
  }

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }
  
  if (error || !channels) {
    return <div className="p-8 text-[var(--color-danger)] text-center">Failed to load notification settings.</div>;
  }

  // Define some available channels that aren't connected yet (mock logic for demo)
  const connectedTypes = channels.map(c => c.channel_type);
  const allAvailable = [
    { type: "slack", name: "Slack", icon: MessageSquare },
    { type: "email", name: "Email", icon: Mail },
    { type: "teams", name: "Microsoft Teams", icon: MessageSquare },
  ];
  const availableChannels = allAvailable.filter(a => !connectedTypes.includes(a.type));

  const handleAdd = (type: string, name: string) => {
    addMutation.mutate({
      channel_type: type,
      name,
      config: {},
      is_active: true,
      on_escalation: true,
      on_sla_breach: true
    });
  };

  return (
    <div className="max-w-4xl space-y-10 pb-12">
      {/* Connected Channels */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Connected Channels</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/4">Channel</th>
                <th className="px-4 py-2 font-semibold w-1/3">Destination / Config</th>
                <th className="px-4 py-2 font-semibold text-center">On Escalation</th>
                <th className="px-4 py-2 font-semibold text-center">On SLA Breach</th>
                <th className="px-4 py-2 font-semibold w-1/6">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {channel.channel_type === "slack" && <MessageSquare size={16} className="text-[var(--fg-subtle)]" />}
                      {channel.channel_type === "email" && <Mail size={16} className="text-[var(--fg-subtle)]" />}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    {JSON.stringify(channel.config) === "{}" ? "Not configured" : "Configured"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={channel.on_escalation} 
                      onChange={() => handleToggleEvent(channel, "on_escalation")}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={channel.on_sla_breach} 
                      onChange={() => handleToggleEvent(channel, "on_sla_breach")}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", channel.is_active ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]")} />
                      <span className="capitalize text-xs">{channel.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {channels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--fg-muted)]">
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
              {availableChannels.map((channel) => (
                <tr key={channel.type} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <channel.icon size={16} className="text-[var(--fg-subtle)]" /> {channel.name}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleAdd(channel.type, channel.name)}
                      className="flex items-center gap-1 text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-1 rounded hover:bg-[var(--bg-muted)] transition-colors"
                    >
                      <Plus size={12} /> Connect
                    </button>
                  </td>
                </tr>
              ))}
              {availableChannels.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                    All available channels are connected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
