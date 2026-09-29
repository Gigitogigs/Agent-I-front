"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SlideOver } from "@/components/templates/list-detail/detail-panel";
import { ConversationRow } from "@/features/conversations/conversation-row";
import { ConversationDetail } from "@/features/conversations/conversation-detail";
import {
  STATUS_TABS,
  useConversations,
  useConversationDetail,
} from "@/features/conversations/use-conversations";
import type { ConversationStatus } from "@/types";
import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/use-auth";

export default function ConversationsPage() {
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

  const { activeWorkspaceId, isLoading: isAuthLoading } = useAuth();
  const { data: conversations = [], isLoading, error } = useConversations(searchQuery, activeTab);
  const { data: detailData, isLoading: detailLoading } = useConversationDetail(selectedId);

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

        {isAuthLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-[var(--fg-muted)]" size={24} />
          </div>
        ) : !activeWorkspaceId ? (
          <div className="flex items-center justify-center p-8 text-[var(--fg-muted)]">
            No active workspace found.
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-[var(--fg-muted)]" size={24} />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-[var(--color-danger)] text-center">
            Failed to load conversations.
          </div>
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={searchQuery || activeTab !== "ALL" ? "No matches found" : "No conversations yet"}
            description={
              searchQuery || activeTab !== "ALL"
                ? "Try adjusting your search terms or filters."
                : "When agents chat with your customers, they'll show up here."
            }
          />
        ) : (
          <div className="pb-4">
            {conversations.map((c) => (
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
        {detailLoading ? (
          <div className="flex items-center justify-center h-full p-8">
            <Loader2 className="animate-spin text-[var(--fg-muted)]" size={24} />
          </div>
        ) : selected && detailData ? (
          <ConversationDetail
            conversation={selected}
            transcript={detailData.transcript}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-8 text-sm text-[var(--fg-muted)]">
            Failed to load conversation details.
          </div>
        )}
      </SlideOver>
    </div>
  );
}
