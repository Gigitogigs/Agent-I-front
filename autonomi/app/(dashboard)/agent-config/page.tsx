"use client";

import { useState } from "react";
import { Bot, Search, Shield, AlertTriangle, Globe } from "lucide-react";
import { RailTabsLayout } from "@/components/templates/rail-tabs/rail-tabs-layout";
import { RailItem } from "@/components/templates/rail-tabs/rail";
import { TabBar } from "@/components/templates/rail-tabs/tab-bar";
import { SaveChangesFooter } from "@/components/shared/save-changes-footer";
import { ModelsKeysTab } from "@/features/agent-config/tabs/models-keys-tab";
import { PromptToolsTab } from "@/features/agent-config/tabs/prompt-tools-tab";
import { GuardrailsTab } from "@/features/agent-config/tabs/guardrails-tab";
import { HitlTab } from "@/features/agent-config/tabs/hitl-tab";
import {
  STUB_CONFIG,
  PROVIDERS,
  type ConfigRailItem,
  type ConfigTabId,
  type AgentConfig,
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
  const [configs, setConfigs] = useState<Record<ConfigRailItem, AgentConfig>>(STUB_CONFIG);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const activeConfig = configs[activeRail];

  const handleConfigChange = (updates: Partial<AgentConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [activeRail]: { ...prev[activeRail], ...updates },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Simulate API save
    setTimeout(() => {
      setHasUnsavedChanges(false);
    }, 500);
  };

  const handleDiscard = () => {
    setConfigs(STUB_CONFIG);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* ── Page Header (Outside RailLayout) ───────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <h1 className="text-lg font-semibold text-[var(--fg-base)]">Agent Configuration</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Manage models, prompts, tools, and safety guardrails per agent.
        </p>
      </div>

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
            {activeTab === "models" && (
              <ModelsKeysTab
                config={activeConfig}
                providers={PROVIDERS}
                onChange={handleConfigChange}
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
          </div>
        }
      />

      {/* ── Save Footer ───────────────────────────────────────────── */}
      <SaveChangesFooter
        isDirty={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
        className="px-6 pb-4 pt-0 mt-0 border-t-0"
      />
    </div>
  );
}
