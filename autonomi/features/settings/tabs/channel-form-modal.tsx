import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { NotificationChannel } from "../use-settings";

export type ConfigMap = {
  slack: { webhook_url: string };
  teams: { webhook_url: string };
  discord: { webhook_url: string };
  email: {
    smtp_host: string;
    smtp_user: string;
    smtp_password: string;
    sender: string;
    recipient: string;
    smtp_port?: number;
  };
};

export type ChannelPayload<T extends keyof ConfigMap = keyof ConfigMap> = {
  id?: string;
  name: string;
  channel_type: T;
  config: ConfigMap[T];
  is_active?: boolean;
  on_escalation?: boolean;
  on_sla_breach?: boolean;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: "create" | "edit";
  initialData?: any;
  defaultType?: string;
}

export function ChannelFormModal({ isOpen, onClose, onSubmit, mode, initialData, defaultType }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<keyof ConfigMap>("slack");
  const [webhookUrl, setWebhookUrl] = useState("");
  
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");

  const [isActive, setIsActive] = useState(true);
  const [onEscalation, setOnEscalation] = useState(true);
  const [onSlaBreach, setOnSlaBreach] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setName(initialData.name);
        setType(initialData.channel_type as keyof ConfigMap);
        setIsActive(initialData.is_active);
        setOnEscalation(initialData.on_escalation);
        setOnSlaBreach(initialData.on_sla_breach);
        
        // We do not load initial config as it's encrypted and backend doesn't send it,
        // unless we want to allow partial updates. Usually the user has to re-enter secrets.
        setWebhookUrl("");
        setSmtpHost("");
        setSmtpPort("587");
        setSmtpUser("");
        setSmtpPassword("");
        setSender("");
        setRecipient("");
      } else {
        setName("");
        setType((defaultType as keyof ConfigMap) || "slack");
        setWebhookUrl("");
        setSmtpHost("");
        setSmtpPort("587");
        setSmtpUser("");
        setSmtpPassword("");
        setSender("");
        setRecipient("");
        setIsActive(true);
        setOnEscalation(true);
        setOnSlaBreach(true);
      }
      setErrorMsg("");
    }
  }, [isOpen, mode, initialData, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    let config: any = {};
    if (type === "slack" || type === "teams" || type === "discord") {
      if (!webhookUrl) {
        setErrorMsg(`${type} config missing keys: ["webhook_url"]`);
        setIsSubmitting(false);
        return;
      }
      config = { webhook_url: webhookUrl };
    } else if (type === "email") {
      if (!smtpHost || !smtpUser || !smtpPassword || !sender || !recipient) {
        setErrorMsg(`email config missing keys`);
        setIsSubmitting(false);
        return;
      }
      config = {
        smtp_host: smtpHost,
        smtp_port: parseInt(smtpPort) || 587,
        smtp_user: smtpUser,
        smtp_password: smtpPassword,
        sender,
        recipient
      };
    }

    try {
      await onSubmit({
        id: initialData?.id,
        name,
        channel_type: type,
        config,
        is_active: isActive,
        on_escalation: onEscalation,
        on_sla_breach: onSlaBreach
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg-surface)] w-full max-w-md rounded-lg shadow-xl overflow-hidden border border-[var(--border-hairline)] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-hairline)] shrink-0">
          <h2 className="text-lg font-semibold text-[var(--fg-base)]">
            {mode === "create" ? "Add Channel" : "Edit Channel"}
          </h2>
          <button onClick={onClose} className="text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded text-sm text-[var(--color-danger)]">
              {errorMsg}
            </div>
          )}
          <form id="channel-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                placeholder="e.g. Ops Team Slack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                disabled={mode === "edit"}
                className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
              >
                <option value="slack">Slack</option>
                <option value="teams">Microsoft Teams</option>
                <option value="discord">Discord</option>
                <option value="email">Email</option>
              </select>
            </div>

            {(type === "slack" || type === "teams" || type === "discord") && (
              <div>
                <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Webhook URL</label>
                <input
                  type="password"
                  required
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  placeholder="https://..."
                />
              </div>
            )}

            {type === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">SMTP Host</label>
                  <input
                    type="text"
                    required
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">SMTP User</label>
                  <input
                    type="text"
                    required
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">SMTP Password</label>
                  <input
                    type="password"
                    required
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Sender Email</label>
                  <input
                    type="email"
                    required
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[var(--border-hairline)] bg-transparent text-[var(--fg-base)]"
                />
                <span className="text-sm text-[var(--fg-base)]">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onEscalation}
                  onChange={(e) => setOnEscalation(e.target.checked)}
                  className="rounded border-[var(--border-hairline)] bg-transparent text-[var(--fg-base)]"
                />
                <span className="text-sm text-[var(--fg-base)]">On Escalation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSlaBreach}
                  onChange={(e) => setOnSlaBreach(e.target.checked)}
                  className="rounded border-[var(--border-hairline)] bg-transparent text-[var(--fg-base)]"
                />
                <span className="text-sm text-[var(--fg-base)]">On SLA Breach</span>
              </label>
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] rounded hover:bg-[var(--bg-surface)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="channel-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--fg-base)] rounded hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {mode === "create" ? "Add Channel" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
