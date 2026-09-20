import { cn, relativeTime } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Search, CheckCircle } from "lucide-react";
import type { Conversation, TranscriptTurn } from "@/types";

interface ConversationDetailProps {
  conversation: Conversation;
  transcript: TranscriptTurn[];
}

export function ConversationDetail({ conversation, transcript }: ConversationDetailProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6">
        {transcript.map((turn, i) => {
          const isCustomer = turn.role === "customer";
          const isAgent = turn.role === "agent";

          return (
            <div key={turn.id} className="flex gap-4">
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                  isCustomer
                    ? "bg-[var(--color-gray-300)] dark:bg-[var(--color-gray-700)] text-[var(--fg-base)]"
                    : "bg-[var(--bg-muted)] text-[var(--fg-base)] border border-[var(--border-hairline)]"
                )}
              >
                {isCustomer ? conversation.customerName?.charAt(0) || "C" : "AI"}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--fg-base)]">
                    {isCustomer ? conversation.customerName || conversation.customerRef : "Agent"}
                  </span>
                  <span className="text-xs text-[var(--fg-subtle)]">
                    {relativeTime(turn.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm text-[var(--fg-base)] leading-relaxed bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3 rounded-md">
                  {turn.content}
                </div>

                {/* Inline Citations */}
                {turn.citations && turn.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {turn.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded text-xs text-[var(--fg-muted)] cursor-help"
                        title={cite.excerpt}
                      >
                        <Search size={10} />
                        Retrieved: {cite.docName} §{cite.chunk}
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Approval Outcome */}
                {turn.approvalOutcome && (
                  <div className="mt-3 p-3 bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[var(--fg-base)] font-medium">
                      <CheckCircle size={14} className={turn.approvalOutcome.approved ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"} />
                      {turn.approvalOutcome.summary} {turn.approvalOutcome.approved ? "approved" : "rejected"}
                    </div>
                    <Link
                      href="/approvals"
                      className="inline-flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] underline-offset-2 hover:underline transition-colors"
                    >
                      View approval <ArrowRight size={11} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
