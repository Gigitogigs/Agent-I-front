"use client";

import { useState } from "react";
import { Search, Database, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { UploadZone } from "@/features/knowledge/upload-zone";
import { DocumentRow } from "@/features/knowledge/document-row";
import { RetrievalTester } from "@/features/knowledge/retrieval-tester";
import {
  STATUS_OPTIONS,
  useKnowledgeDocuments,
  useDeleteDocument,
  useRetryDocument,
} from "@/features/knowledge/use-knowledge";
import type { DocStatus } from "@/features/knowledge/use-knowledge";
import { cn } from "@/lib/utils";

export default function KnowledgeBasePage() {
  const [activeStatus, setActiveStatus] = useState<DocStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documents = [], isLoading, error } = useKnowledgeDocuments(searchQuery, activeStatus);
  const deleteMutation = useDeleteDocument();
  const retryMutation = useRetryDocument();

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-7 pb-12">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-semibold text-[var(--fg-base)]">Knowledge Base</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Upload and manage the documents that power your agents' retrieval capabilities.
        </p>
      </div>

      {/* ── Upload Section (Static top block) ─────────────────────────── */}
      <UploadZone />

      {/* ── File List Section ───────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]" size={14} />
            <input
              type="text"
              placeholder="Search files or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded text-[var(--fg-base)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--fg-base)] transition-colors"
            />
          </div>
          
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value as DocStatus | "ALL")}
            className="text-xs bg-[var(--bg-subtle)] border border-[var(--border-hairline)] text-[var(--fg-base)] rounded px-3 py-1.5 focus:outline-none focus:border-[var(--fg-base)] transition-colors"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* List Header */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider rounded-t-lg border-x border-t">
          <div className="w-5 shrink-0"></div>
          <div className="w-48 shrink-0">Name</div>
          <div className="w-24 shrink-0 hidden sm:block">Status</div>
          <div className="flex-1 min-w-0">Tags</div>
          <div className="w-16 shrink-0 text-right">Size</div>
          <div className="w-16 shrink-0 text-right">Chunks</div>
          <div className="w-20 shrink-0 text-right">Date</div>
          <div className="w-8 shrink-0"></div>
        </div>

        {/* List Body */}
        <div className="border-x border-[var(--border-hairline)] rounded-b-lg overflow-hidden border-b -mt-4 bg-[var(--bg-surface)]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin text-[var(--fg-muted)]" size={24} />
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-[var(--color-danger)] text-center">
              Failed to load knowledge base documents.
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              icon={Database}
              title={searchQuery || activeStatus !== "ALL" ? "No matching documents" : "No documents yet"}
              description={
                searchQuery || activeStatus !== "ALL"
                  ? "Try adjusting your search terms or filters."
                  : "Upload your first document above to start building your knowledge base."
              }
            />
          ) : (
            <div>
              {documents.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  onDelete={handleDelete}
                  onRetry={(id) => retryMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Test Retrieval Module ──────────────────────────────────── */}
      <RetrievalTester />
    </div>
  );
}
