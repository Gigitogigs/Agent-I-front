import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export type ConfigRailItem = "orchestrator" | "retrieval" | "action" | "escalation" | "global";
export type ConfigTabId = "models" | "prompt" | "guardrails" | "hitl";

export interface Provider {
  id: string;
  name: string;
  models: string[];
}

export const PROVIDERS: Provider[] = [
  { id: "anthropic", name: "Anthropic", models: ["claude-3-5-sonnet-20240620", "claude-3-haiku-20240307", "claude-3-opus-20240229"] },
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"] },
  { id: "ollama", name: "Ollama (Local)", models: ["llama3", "mistral", "phi3"] },
];

export interface HitlBreakpoint {
  id: string;
  label: string;
  expiryBehavior: "auto-escalate" | "auto-reject";
  slaWindowMins: number;
}

export interface AgentConfig {
  id: ConfigRailItem;
  provider: string | null;
  model: string | null;
  fallbackModel: string | null;
  systemPrompt: string | null;
  tools: string[] | null;
  guardrails: any | null;
  hitlBreakpoints: HitlBreakpoint[] | null;
  apiKeyHint: string | null;
}

export interface AgentConfigOut {
  global: AgentConfig;
  orchestrator: AgentConfig;
  retrieval: AgentConfig;
  action: AgentConfig;
  escalation: AgentConfig;
}

export function useAgentConfigs() {
  const { activeWorkspaceId } = useAuth();

  return useQuery<AgentConfigOut>({
    queryKey: ["workspaces", activeWorkspaceId, "agents"],
    queryFn: async () => {
      const raw = await apiClient.get<any>(`/workspaces/${activeWorkspaceId}/agents`);
      return {
        global: mapAgentConfigOut(raw.global, "global"),
        orchestrator: mapAgentConfigOut(raw.orchestrator, "orchestrator"),
        retrieval: mapAgentConfigOut(raw.retrieval, "retrieval"),
        action: mapAgentConfigOut(raw.action, "action"),
        escalation: mapAgentConfigOut(raw.escalation, "escalation"),
      };
    },
    enabled: !!activeWorkspaceId,
  });
}

export function useUpdateAgentConfig(agentType: ConfigRailItem) {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();

  return useMutation({
    mutationFn: (data: Partial<AgentConfig>) => {
      const payload: Record<string, any> = {};
      if (data.provider !== undefined) payload.provider = data.provider;
      if (data.model !== undefined) payload.model = data.model;
      if (data.fallbackModel !== undefined) payload.fallback_model = data.fallbackModel;
      if (data.systemPrompt !== undefined) payload.system_prompt = data.systemPrompt;
      if (data.tools !== undefined) payload.tools = data.tools;
      if (data.guardrails !== undefined) payload.guardrails = data.guardrails;
      if (data.hitlBreakpoints !== undefined) payload.hitl_breakpoints = data.hitlBreakpoints;
      
      return apiClient.patch(`/workspaces/${activeWorkspaceId}/agents/${agentType}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "agents"] });
    },
  });
}

export function useUpdateProviderApiKey() {
  const { activeWorkspaceId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerId, apiKey }: { providerId: string; apiKey: string }) =>
      apiClient.put(
        `/workspaces/${activeWorkspaceId}/providers/${providerId}/api-key`,
        { apiKey: apiKey }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "agents"] });
    },
  });
}

function mapAgentConfigOut(raw: any, id: ConfigRailItem): AgentConfig {
  if (!raw) return {
    id,
    provider: null,
    model: null,
    fallbackModel: null,
    systemPrompt: null,
    tools: null,
    guardrails: null,
    hitlBreakpoints: null,
    apiKeyHint: null,
  };
  return {
    id,
    provider: raw.provider ?? null,
    model: raw.model ?? null,
    fallbackModel: raw.fallback_model ?? null,
    systemPrompt: raw.system_prompt ?? null,
    tools: raw.tools ?? null,
    guardrails: raw.guardrails ?? null,
    hitlBreakpoints: raw.hitl_breakpoints ?? null,
    apiKeyHint: raw.api_key_hint ?? null,
  };
}
