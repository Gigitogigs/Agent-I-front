import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Store, Workflow, Plus, Search, Loader2, Play, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useIntegrations, 
  useAddIntegration, 
  useUpdateIntegration, 
  useVerifyIntegration, 
  useDeleteIntegration,
  useConnectorCatalog,
  type Integration,
  type ConnectorCatalogEntry
} from "../use-settings";
import { IntegrationFormModal } from "./integration-form-modal";

export function IntegrationsTab() {
  const { activeWorkspaceId, isLoading: isAuthLoading } = useAuth();
  
  const { data: connected, isLoading: isIntegrationsLoading, error: integrationsError } = useIntegrations();
  const { data: catalog, isLoading: isCatalogLoading, error: catalogError } = useConnectorCatalog();
  
  const addMutation = useAddIntegration();
  const updateMutation = useUpdateIntegration();
  const verifyMutation = useVerifyIntegration();
  const deleteMutation = useDeleteIntegration();

  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState<Integration | null>(null);
  const [selectedCatalogEntry, setSelectedCatalogEntry] = useState<ConnectorCatalogEntry | undefined>(undefined);

  if (isAuthLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }

  if (!activeWorkspaceId) {
    return <div className="p-8 text-[var(--fg-muted)] text-center">No active workspace found.</div>;
  }

  if (isIntegrationsLoading || isCatalogLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }
  
  if (integrationsError || catalogError || !connected || !catalog) {
    return <div className="p-8 text-[var(--color-danger)] text-center">Failed to load integrations.</div>;
  }

  const filteredCatalog = catalog.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.domains.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openCreateModal = (entry: ConnectorCatalogEntry) => {
    setModalMode("create");
    setInitialData(null);
    setSelectedCatalogEntry(entry);
    setIsModalOpen(true);
  };

  const openEditModal = (integration: Integration) => {
    const entry = catalog.find(c => c.id === integration.integration_type);
    if (!entry) return;
    setModalMode("edit");
    setInitialData(integration);
    setSelectedCatalogEntry(entry);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (modalMode === "create") {
      await addMutation.mutateAsync(data);
    } else {
      await updateMutation.mutateAsync(data);
    }
  };

  const handleTogglePrimary = (id: string, is_primary: boolean) => {
    updateMutation.mutate({ id, is_primary });
  };

  const handleVerify = (id: string) => {
    verifyMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this integration?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-4xl space-y-10 pb-12">
      {/* My Connectors */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">My Connectors</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/3">Connector</th>
                <th className="px-4 py-2 font-semibold text-center w-24">Primary</th>
                <th className="px-4 py-2 font-semibold w-24">Status</th>
                <th className="px-4 py-2 font-semibold w-32">Domain</th>
                <th className="px-4 py-2 font-semibold text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {connected.map((integration) => (
                <tr key={integration.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Store size={16} className="text-[var(--fg-subtle)]" />
                      <span className="font-medium">{integration.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox"
                      checked={integration.is_primary || false}
                      onChange={(e) => handleTogglePrimary(integration.id, e.target.checked)}
                      className="cursor-pointer rounded border-[var(--border-hairline)] text-[var(--fg-base)] bg-transparent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", integration.status === "active" ? "bg-[var(--color-success)]" : integration.status === "pending" ? "bg-[var(--color-warning)]" : "bg-[var(--color-danger)]")} />
                      <span className="capitalize text-xs">{integration.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    <span className="text-xs bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full capitalize">{integration.domain?.replace("_", " ") || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {integration.status === "pending" && (
                        <button 
                          onClick={() => handleVerify(integration.id)} 
                          disabled={verifyMutation.isPending}
                          className="text-[var(--color-warning)] hover:text-[var(--color-success)] transition-colors flex items-center gap-1 disabled:opacity-50"
                          title="Verify Connection"
                        >
                          <CheckCircle2 size={14} /> <span className="text-xs">Verify</span>
                        </button>
                      )}
                      <button 
                        onClick={() => openEditModal(integration)}
                        className="text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(integration.id)}
                        className="text-[var(--fg-muted)] hover:text-[var(--color-danger)] transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {connected.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--fg-muted)]">
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
                placeholder="Search connectors by name or domain..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-[var(--bg-muted)] text-[var(--fg-base)] border border-transparent rounded focus:outline-none focus:border-[var(--border-hairline)] transition-colors"
              />
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold w-1/3">Connector</th>
                <th className="px-4 py-2 font-semibold w-1/2">Domains</th>
                <th className="px-4 py-2 font-semibold w-1/6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {filteredCatalog.map((entry) => (
                <tr key={entry.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="px-4 py-3 font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    <div className="flex flex-wrap gap-1.5">
                      {entry.domains.map(d => (
                        <span key={d} className="text-[10px] bg-[var(--bg-subtle)] px-2 py-0.5 rounded border border-[var(--border-hairline)] capitalize">{d.replace("_", " ")}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => openCreateModal(entry)}
                      className="flex items-center gap-1 text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-1 rounded hover:bg-[var(--bg-muted)] transition-colors"
                    >
                      <Plus size={12} /> Connect
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCatalog.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                    No connectors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IntegrationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        initialData={initialData}
        catalogEntry={selectedCatalogEntry}
      />
    </div>
  );
}
