"use client";

import { useState, useEffect } from "react";
import { Bot, Search, Shield, AlertTriangle, Globe, Loader2 } from "lucide-react";
import { RailTabsLayout } from "@/components/templates/rail-tabs/rail-tabs-layout";
import { RailItem } from "@/components/templates/rail-tabs/rail";
import { TabBar } from "@/components/templates/rail-tabs/tab-bar";
import { SaveChangesFooter } from "@/components/shared/save-changes-footer";
import { ModelsKeysTab } from "@/features/agent-config/tabs/models-keys-tab";
import { PromptToolsTab } from "@/features/agent-config/tabs/prompt-tools-tab";
import { GuardrailsTab } from "@/features/agent-config/tabs/guardrails-tab";
import { HitlTab } from "@/features/agent-config/tabs/hitl-tab";
import {
  PROVIDERS,
  useAgentConfigs,
  useUpdateAgentConfig,
  useUpdateProviderApiKey,
  type ConfigRailItem,
  type ConfigTabId,
  type AgentConfig,
  type AgentConfigOut,
} from "@/features/agent-config/use-agent-config";

const AGENT_ITEMS = [
  { id: "orchestrator", label: "Orchestrator" },
  { id: "retrieval", label: "Retrieval" },
  { id: "action", label: "Action" },
  { id: "escalation", label: "Escalation" },
];

const TABS = [
  { id: "models", label: "Model & Keys" },
  { id: "prompt", label: "Prompt & Tools" },
  { id: "guardrails", label: "Guardrails" },
  { id: "hitl", label: "HITL Breakpoints" },
];

export default function AgentConfigPage() {
  const [activeRail, setActiveRail] = useState<ConfigRailItem>("action");
  const [activeTab, setActiveTab] = useState<ConfigTabId>("models");
  
  const { data: serverConfigs, isLoading, error } = useAgentConfigs();
  const [configs, setConfigs] = useState<AgentConfigOut | null>(null);
  
  // Track which rails have unsaved changes to only save those
  const [dirtyRails, setDirtyRails] = useState<Set<ConfigRailItem>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // We need a mutation per rail. But since we dynamically patch, we can just use the hook directly inside handleSave.
  // We'll create one hook per rail just in case or use the API client directly.
  // Actually, we can just use the activeRail's hook if we only save active, or use multiple.
  const orchestratorMutation = useUpdateAgentConfig("orchestrator");
  const retrievalMutation = useUpdateAgentConfig("retrieval");
  const actionMutation = useUpdateAgentConfig("action");
  const escalationMutation = useUpdateAgentConfig("escalation");
  const globalMutation = useUpdateAgentConfig("global");

  const mutations = {
    orchestrator: orchestratorMutation,
    retrieval: retrievalMutation,
    action: actionMutation,
    escalation: escalationMutation,
    global: globalMutation,
  };

  const apiKeyMutation = useUpdateProviderApiKey();

  useEffect(() => {
    if (serverConfigs && dirtyRails.size === 0) {
      setConfigs(serverConfigs);
    }
  }, [serverConfigs, dirtyRails.size]);

  const activeConfig = configs ? configs[activeRail] : null;

  const handleConfigChange = (updates: Partial<AgentConfig>) => {
    if (!configs) return;
    setConfigs((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [activeRail]: { ...prev[activeRail], ...updates },
      };
    });
    setDirtyRails((prev) => new Set(prev).add(activeRail));
  };

  const handleSave = async () => {
    if (!configs || dirtyRails.size === 0) return;
    setIsSaving(true);
    try {
      const promises = Array.from(dirtyRails).map((rail) => {
        const dataToSave = configs[rail];
        return mutations[rail].mutateAsync({
          provider: dataToSave.provider || undefined,
          model: dataToSave.model,
          fallbackModel: dataToSave.fallbackModel,
          systemPrompt: dataToSave.systemPrompt,
          tools: dataToSave.tools,
          guardrails: dataToSave.guardrails,
          hitlBreakpoints: dataToSave.hitlBreakpoints,
        });
      });
      await Promise.all(promises);
      setDirtyRails(new Set());
    } catch (e) {
      console.error("Failed to save configs", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (serverConfigs) {
      setConfigs(serverConfigs);
      setDirtyRails(new Set());
    }
  };

  const hasUnsavedChanges = dirtyRails.size > 0;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* ── Page Header (Outside RailLayout) ───────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <h1 className="text-lg font-semibold text-[var(--fg-base)]">Agent Configuration</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Manage models, prompts, tools, and safety guardrails per agent.
        </p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--fg-muted)]" size={32} />
        </div>
      ) : error || !configs ? (
        <div className="p-4 m-6 text-sm text-[var(--color-danger)] bg-[var(--bg-surface)] border border-[var(--color-danger)] rounded">
          Failed to load agent configurations.
        </div>
      ) : (
        <>
          {/* ── Main Layout ───────────────────────────────────────────── */}
          <RailTabsLayout
            rail={
              <div className="py-4">
                {AGENT_ITEMS.map((item) => (
                  <RailItem
                    key={item.id}
                    label={item.label}
                    active={activeRail === item.id}
                    onClick={() => setActiveRail(item.id as ConfigRailItem)}
                  />
                ))}
                <RailItem
                  label="Global Policy"
                  active={activeRail === "global"}
                  onClick={() => setActiveRail("global" as ConfigRailItem)}
                  dividerAbove
                />
              </div>
            }
            tabs={
              <TabBar
                items={TABS}
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as ConfigTabId)}
                className="px-6"
              />
            }
            content={
              <div className="h-full relative pb-20">
                {activeConfig && (
                  <>
                    {activeTab === "models" && (
                      <ModelsKeysTab
                        config={activeConfig}
                        providers={PROVIDERS}
                        onChange={handleConfigChange}
                        isGlobal={activeRail === "global"}
                        onSaveApiKey={async (providerId, apiKey) => {
                          await apiKeyMutation.mutateAsync({ providerId, apiKey });
                        }}
                        isSavingApiKey={apiKeyMutation.isPending}
                      />
                    )}
                    {activeTab === "prompt" && (
                      <PromptToolsTab
                        config={activeConfig}
                        onChange={handleConfigChange}
                      />
                    )}
                    {activeTab === "guardrails" && (
                      <GuardrailsTab
                        config={activeConfig}
                        onChange={handleConfigChange}
                      />
                    )}
                    {activeTab === "hitl" && (
                      <HitlTab
                        config={activeConfig}
                        onChange={handleConfigChange}
                      />
                    )}
                  </>
                )}
              </div>
            }
          />

          {/* ── Save Footer ───────────────────────────────────────────── */}
          <SaveChangesFooter
            isDirty={hasUnsavedChanges}
            isSaving={isSaving}
            onSave={handleSave}
            onDiscard={handleDiscard}
            className="px-6 pb-4 pt-0 mt-0 border-t-0"
          />
        </>
      )}
    </div>
  );
}
