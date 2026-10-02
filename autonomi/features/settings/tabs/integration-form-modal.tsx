import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { ConnectorCatalogEntry, Integration } from "../use-settings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: "create" | "edit";
  initialData?: Integration | null;
  catalogEntry?: ConnectorCatalogEntry;
}

export function IntegrationFormModal({ isOpen, onClose, onSubmit, mode, initialData, catalogEntry }: Props) {
  const [name, setName] = useState("");
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setName(initialData.name);
        // We don't load the config as it's not returned by the backend, user has to re-enter
        setConfig({});
      } else {
        setName("");
        // Set default config values from schema
        const defaultCfg: Record<string, any> = {};
        if (catalogEntry?.config_schema?.properties) {
          Object.entries(catalogEntry.config_schema.properties).forEach(([key, field]) => {
            if (field.default !== undefined) {
              defaultCfg[key] = field.default;
            } else {
              defaultCfg[key] = field.type === "boolean" ? false : "";
            }
          });
        }
        setConfig(defaultCfg);
      }
      setErrorMsg("");
    }
  }, [isOpen, mode, initialData, catalogEntry]);

  if (!isOpen || !catalogEntry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Validate required fields
    const schema = catalogEntry.config_schema;
    if (schema?.required) {
      for (const req of schema.required) {
        if (!config[req] && config[req] !== false) {
          setErrorMsg(`Missing required field: ${schema.properties[req]?.title || req}`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      const payload: any = {
        name,
        config
      };
      
      if (mode === "create") {
        payload.integration_type = catalogEntry.id;
      } else if (mode === "edit" && initialData) {
        payload.id = initialData.id;
      }
      
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg-surface)] w-full max-w-md rounded-lg shadow-xl overflow-hidden border border-[var(--border-hairline)] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-hairline)] shrink-0">
          <h2 className="text-lg font-semibold text-[var(--fg-base)]">
            {mode === "create" ? `Connect ${catalogEntry.name}` : `Edit ${catalogEntry.name}`}
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
          {mode === "edit" && (
            <div className="mb-4 p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded text-xs text-[var(--color-warning)]">
              Note: Updating credentials will set this integration to "pending" status and require re-verification.
            </div>
          )}
          <form id="integration-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                placeholder="e.g. Production Store"
              />
            </div>
            
            {catalogEntry.config_schema?.properties && Object.entries(catalogEntry.config_schema.properties).map(([key, field]) => {
              const isRequired = catalogEntry.config_schema.required?.includes(key);
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-[var(--fg-base)] mb-1">
                    {field.title || key} {isRequired && <span className="text-[var(--color-danger)]">*</span>}
                  </label>
                  {field.type === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={!!config[key]}
                      onChange={(e) => updateConfig(key, e.target.checked)}
                      className="rounded border-[var(--border-hairline)] bg-transparent"
                    />
                  ) : (
                    <input
                      type={field.type === "password" || key.toLowerCase().includes("secret") || key.toLowerCase().includes("key") || key.toLowerCase().includes("password") || key.toLowerCase().includes("token") ? "password" : "text"}
                      required={isRequired}
                      value={config[key] || ""}
                      onChange={(e) => updateConfig(key, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] text-[var(--fg-base)] transition-colors"
                      placeholder={field.description || ""}
                    />
                  )}
                  {field.description && field.type !== "boolean" && (
                    <p className="text-[11px] text-[var(--fg-muted)] mt-1">{field.description}</p>
                  )}
                </div>
              );
            })}
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
            form="integration-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--fg-base)] rounded hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {mode === "create" ? "Connect" : "Save Credentials"}
          </button>
        </div>
      </div>
    </div>
  );
}
