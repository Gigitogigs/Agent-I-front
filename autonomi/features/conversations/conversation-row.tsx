import { cn, relativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { Search, Zap, AlertTriangle, Cpu } from "lucide-react";
import type { Conversation, AgentType } from "@/types";

interface ConversationRowProps {
  conversation: Conversation;
  onClick: () => void;
}

const AGENT_ICONS: Record<AgentType, React.ElementType> = {
  retrieval: Search,
  action: Zap,
  escalation: AlertTriangle,
  orchestrator: Cpu,
};

export function ConversationRow({ conversation, onClick }: ConversationRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-2.5 border-b border-[var(--border-hairline)]",
        "text-left transition-colors hover:bg-[var(--bg-muted)]"
      )}
    >
      {/* Status */}
      <div className="w-24 shrink-0">
        <StatusBadge variant={conversation.status} />
      </div>

      {/* Customer */}
      <div className="w-32 shrink-0 flex items-center gap-2">
        <span className="text-xs font-medium text-[var(--fg-base)] truncate">
          {conversation.customerRef}
        </span>
        {conversation.customerName && (
          <span className="text-xs text-[var(--fg-muted)] truncate hidden sm:inline-block">
            {conversation.customerName}
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-[var(--fg-base)] truncate block">
          {conversation.summary}
        </span>
      </div>

      {/* Agents */}
      <div className="w-24 shrink-0 flex items-center gap-1.5">
        {conversation.agentTypes.map((type) => {
          const Icon = AGENT_ICONS[type];
          return (
            <div
              key={type}
              title={`Agent: ${type}`}
              className="w-5 h-5 rounded flex items-center justify-center bg-[var(--bg-muted)] text-[var(--fg-subtle)]"
            >
              <Icon size={12} />
            </div>
          );
        })}
      </div>

      {/* Time */}
      <div className="w-16 shrink-0 text-right">
        <span className="text-[11px] text-[var(--fg-muted)] tabular-nums">
          {relativeTime(conversation.createdAt)}
        </span>
      </div>
    </button>
  );
}
