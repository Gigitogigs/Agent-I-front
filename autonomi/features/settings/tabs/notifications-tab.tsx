import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Mail, Plus, Loader2, Play, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationChannel } from "../use-settings";
import { 
  useNotifications, 
  useUpdateNotificationChannel, 
  useAddNotificationChannel,
  useDeleteNotificationChannel,
  useTestNotificationChannel
} from "../use-settings";
import { ChannelFormModal, type ChannelPayload } from "./channel-form-modal";

export function NotificationsTab() {
  const { activeWorkspaceId, isLoading: isAuthLoading } = useAuth();
  const { data: channels, isLoading, error } = useNotifications();
  const updateMutation = useUpdateNotificationChannel();
  const addMutation = useAddNotificationChannel();
  const deleteMutation = useDeleteNotificationChannel();
  const testMutation = useTestNotificationChannel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState<any>(null);
  const [defaultType, setDefaultType] = useState<string>("slack");

  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 5000);
  };

  const handleToggleEvent = (channel: NotificationChannel, field: "on_escalation" | "on_sla_breach" | "is_active") => {
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

  const handleTest = async (id: string) => {
    try {
      await testMutation.mutateAsync(id);
      showToast("Test notification sent successfully.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to send test notification.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this channel?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalSubmit = async (data: ChannelPayload) => {
    if (modalMode === "create") {
      await addMutation.mutateAsync(data);
    } else {
      await updateMutation.mutateAsync(data as any);
    }
  };

  const openCreateModal = (type: string) => {
    setModalMode("create");
    setInitialData(null);
    setDefaultType(type);
    setIsModalOpen(true);
  };

  const openEditModal = (channel: NotificationChannel) => {
    setModalMode("edit");
    setInitialData(channel);
    setIsModalOpen(true);
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

  const connectedTypes = channels.map(c => c.channel_type);
  const allAvailable = [
    { type: "slack", name: "Slack", icon: MessageSquare },
    { type: "email", name: "Email", icon: Mail },
    { type: "teams", name: "Microsoft Teams", icon: MessageSquare },
    { type: "discord", name: "Discord", icon: MessageSquare },
  ];
  const availableChannels = allAvailable.filter(a => !connectedTypes.includes(a.type));

  return (
    <div className="max-w-4xl space-y-10 pb-12 relative">
      {toastMsg && (
        <div className={cn("fixed bottom-4 right-4 px-4 py-3 rounded shadow-lg z-50 border", toastType === "success" ? "bg-[var(--bg-surface)] border-[var(--color-success)] text-[var(--color-success)]" : "bg-[var(--color-danger)]/10 border-[var(--color-danger)] text-[var(--color-danger)]")}>
          {toastMsg}
        </div>
      )}

      {/* Connected Channels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--fg-base)]">Connected Channels</h3>
          <button onClick={() => openCreateModal("slack")} className="text-xs font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] px-3 py-1.5 rounded hover:opacity-90 flex items-center gap-1">
            <Plus size={14} /> Add Channel
          </button>
        </div>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/4">Channel</th>
                <th className="px-4 py-2 font-semibold text-center">Active</th>
                <th className="px-4 py-2 font-semibold text-center">On Escalation</th>
                <th className="px-4 py-2 font-semibold text-center">On SLA Breach</th>
                <th className="px-4 py-2 font-semibold text-right w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {channel.channel_type === "slack" && <MessageSquare size={16} className="text-[var(--fg-subtle)]" />}
                      {channel.channel_type === "discord" && <MessageSquare size={16} className="text-[var(--fg-subtle)]" />}
                      {channel.channel_type === "teams" && <MessageSquare size={16} className="text-[var(--fg-subtle)]" />}
                      {channel.channel_type === "email" && <Mail size={16} className="text-[var(--fg-subtle)]" />}
                      <span className="font-medium capitalize">{channel.name || channel.channel_type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={channel.is_active} 
                      onChange={() => handleToggleEvent(channel, "is_active")}
                      className="cursor-pointer"
                    />
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleTest(channel.id)} 
                        disabled={testMutation.isPending}
                        className="text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors flex items-center gap-1 disabled:opacity-50"
                        title="Send Test Notification"
                      >
                        <Play size={14} /> <span className="text-xs">Test</span>
                      </button>
                      <button 
                        onClick={() => openEditModal(channel)}
                        className="text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(channel.id)}
                        className="text-[var(--fg-muted)] hover:text-[var(--color-danger)] transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
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
      {availableChannels.length > 0 && (
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
                        onClick={() => openCreateModal(channel.type)}
                        className="flex items-center gap-1 text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-1 rounded hover:bg-[var(--bg-muted)] transition-colors"
                      >
                        <Plus size={12} /> Connect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ChannelFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        initialData={initialData}
        defaultType={defaultType}
      />
    </div>
  );
}
