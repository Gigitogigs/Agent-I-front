"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SlideOver, ListPane } from "@/components/templates/list-detail/detail-panel";
import { ConversationRow } from "@/features/conversations/conversation-row";
import { ConversationDetail } from "@/features/conversations/conversation-detail";
import {
  STUB_CONVERSATIONS,
  STUB_TRANSCRIPT,
  STATUS_TABS,
  filterConversations,
} from "@/features/conversations/use-conversations";
import type { Conversation, ConversationStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function ConversationsPage() {
  const [conversations] = useState<Conversation[]>(STUB_CONVERSATIONS);
  const [activeTab, setActiveTab] = useState<ConversationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setSelectedId(id);
      // Clean up the URL so the slide-over doesn't re-open on a normal refresh
      window.history.replaceState({}, '', '/conversations');
    }
  }, []);

  const visible = filterConversations(conversations, activeTab, searchQuery);
  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex flex-col h-full -m-4">
      {/* ── Page header + filter tabs ─────────────────────────────── */}
      <div className="px-4 pt-4 pb-0 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] shrink-0">
        <h1 className="text-sm font-semibold text-[var(--fg-base)] mb-3">Conversations</h1>

        <div className="flex items-center justify-between">
          {/* Status filter tabs */}
          <nav className="flex" role="tablist">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.id === "ALL"
                  ? conversations.length
                  : conversations.filter((c) => c.status === tab.id).length;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
                    active
                      ? "border-[var(--fg-base)] text-[var(--fg-base)]"
                      : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-base)]"
                  )}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={cn(
                        "text-[10px] px-1 py-0.5 rounded-sm tabular-nums",
                        active
                          ? "bg-[var(--fg-base)] text-[var(--bg-surface)]"
                          : "bg-[var(--bg-muted)] text-[var(--fg-muted)]"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Page-local search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]" size={14} />
            <input
              type="text"
              placeholder="Search customer, ID, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded text-[var(--fg-base)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--fg-base)] transition-colors w-64"
            />
          </div>
        </div>
      </div>

      {/* ── List (Full width) ─────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 bg-[var(--bg-surface)] overflow-y-auto relative">
        {/* Header row for list */}
        <div className="sticky top-0 z-10 flex items-center gap-4 px-4 py-2 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
          <div className="w-24 shrink-0">Status</div>
          <div className="w-32 shrink-0">Customer</div>
          <div className="flex-1 min-w-0">Summary</div>
          <div className="w-24 shrink-0">Agents</div>
          <div className="w-16 shrink-0 text-right">Time</div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={searchQuery ? "No matches found" : "No conversations yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms."
                : "When agents chat with your customers, they'll show up here."
            }
          />
        ) : (
          <div className="pb-4">
            {visible.map((c) => (
              <ConversationRow
                key={c.id}
                conversation={c}
                onClick={() => setSelectedId(c.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Slide-over Detail Panel ─────────────────────────────────── */}
      <SlideOver
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        title={selected ? `Customer ${selected.customerRef} · ${selected.customerName || "Unknown"}` : undefined}
      >
        {selected && (
          <ConversationDetail
            conversation={selected}
            // In a real app, this would be fetched based on selected.id.
            // Using stub data for now.
            transcript={STUB_TRANSCRIPT}
          />
        )}
      </SlideOver>
    </div>
  );
}
