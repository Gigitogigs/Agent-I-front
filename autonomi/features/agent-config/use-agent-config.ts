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

export interface AgentConfig {
  id: ConfigRailItem;
  provider: string;
  model: string;
  apiKey: string;
  fallbackModel: string;
  systemPrompt: string;
  tools: string[];
  guardrails: {
    pii: boolean;
    toxicity: boolean;
    promptInjection: boolean;
    refundCap?: number;
    discountLimit?: number;
  };
  hitlBreakpoints: {
    id: string;
    label: string;
    expiryBehavior: "auto-escalate" | "auto-reject";
    slaWindowMins: number;
  }[];
}

export const STUB_CONFIG: Record<ConfigRailItem, AgentConfig> = {
  orchestrator: {
    id: "orchestrator",
    provider: "anthropic",
    model: "claude-3-5-sonnet-20240620",
    apiKey: "sk-ant-1234567890",
    fallbackModel: "gpt-4o",
    systemPrompt: "You are the orchestrator. Analyze user requests and route them to the appropriate specialized agent.",
    tools: ["route_request", "clarify_intent"],
    guardrails: { pii: true, toxicity: true, promptInjection: true },
    hitlBreakpoints: [
      { id: "b1", label: "Low Confidence Routing", expiryBehavior: "auto-escalate", slaWindowMins: 30 }
    ]
  },
  retrieval: {
    id: "retrieval",
    provider: "anthropic",
    model: "claude-3-haiku-20240307",
    apiKey: "sk-ant-1234567890",
    fallbackModel: "gpt-3.5-turbo",
    systemPrompt: "You are the retrieval agent. Given a query, extract the exact chunks from the vector database that answer it.",
    tools: ["semantic_search", "document_fetch"],
    guardrails: { pii: false, toxicity: false, promptInjection: true },
    hitlBreakpoints: []
  },
  action: {
    id: "action",
    provider: "openai",
    model: "gpt-4o",
    apiKey: "sk-proj-0987654321",
    fallbackModel: "claude-3-5-sonnet-20240620",
    systemPrompt: "You are the action agent. Execute transactions on behalf of the user using the available tools.",
    tools: ["issue_refund", "cancel_order", "apply_discount", "update_address"],
    guardrails: { pii: true, toxicity: false, promptInjection: true, refundCap: 50, discountLimit: 20 },
    hitlBreakpoints: [
      { id: "b2", label: "Refund Exceeds Cap", expiryBehavior: "auto-reject", slaWindowMins: 60 },
      { id: "b3", label: "Destructive Action (Cancel Order)", expiryBehavior: "auto-escalate", slaWindowMins: 120 }
    ]
  },
  escalation: {
    id: "escalation",
    provider: "anthropic",
    model: "claude-3-5-sonnet-20240620",
    apiKey: "sk-ant-1234567890",
    fallbackModel: "gpt-4o",
    systemPrompt: "You are the escalation agent. Summarize context for the human operator and draft initial responses.",
    tools: ["draft_email", "create_ticket"],
    guardrails: { pii: true, toxicity: true, promptInjection: true },
    hitlBreakpoints: [
      { id: "b4", label: "Draft Requires Review", expiryBehavior: "auto-reject", slaWindowMins: 1440 }
    ]
  },
  global: {
    id: "global",
    provider: "anthropic",
    model: "claude-3-haiku-20240307",
    apiKey: "",
    fallbackModel: "",
    systemPrompt: "Global system policies.",
    tools: [],
    guardrails: { pii: true, toxicity: true, promptInjection: true },
    hitlBreakpoints: []
  }
};
