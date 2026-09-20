"use client";

import { Trash2, FileText, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import type { KnowledgeDocument } from "./use-knowledge";
import { formatBytes } from "./use-knowledge";

interface DocumentRowProps {
  doc: KnowledgeDocument;
  onDelete: (id: string) => void;
}

export function DocumentRow({ doc, onDelete }: DocumentRowProps) {
  const isReady = doc.status === "READY";
  const isProcessing = doc.status === "PROCESSING";
  const isFailed = doc.status === "FAILED";

  return (
    <div className="flex flex-col border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] transition-colors group">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Status Icon */}
        <div className="w-5 shrink-0 flex justify-center">
          {isReady && <CheckCircle2 size={16} className="text-[var(--color-success)]" />}
          {isProcessing && <Loader2 size={16} className="text-[var(--fg-subtle)] animate-spin" />}
          {isFailed && <AlertCircle size={16} className="text-[var(--color-danger)]" />}
        </div>

        {/* Name */}
        <div className="w-48 shrink-0 flex items-center gap-2">
          <FileText size={14} className="text-[var(--fg-subtle)] shrink-0" />
          <span className="text-sm font-medium text-[var(--fg-base)] truncate" title={doc.name}>
            {doc.name}
          </span>
        </div>

        {/* Status Text (Hidden on small, mostly decorative since icon is there) */}
        <div className="w-24 shrink-0 text-xs hidden sm:block">
          <span className={cn(
            isReady && "text-[var(--color-success)]",
            isProcessing && "text-[var(--fg-muted)]",
            isFailed && "text-[var(--color-danger)]"
          )}>
            {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Tags */}
        <div className="flex-1 min-w-0 flex gap-1.5 items-center">
          {doc.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--bg-subtle)] text-[var(--fg-muted)] border border-[var(--border-hairline)]">
              {tag}
            </span>
          ))}
        </div>

        {/* Size */}
        <div className="w-16 shrink-0 text-right text-xs text-[var(--fg-muted)] tabular-nums">
          {formatBytes(doc.sizeBytes)}
        </div>

        {/* Chunks */}
        <div className="w-16 shrink-0 text-right text-xs text-[var(--fg-muted)] tabular-nums">
          {doc.chunks ?? "—"}
        </div>

        {/* Date */}
        <div className="w-20 shrink-0 text-right text-xs text-[var(--fg-muted)] tabular-nums">
          {relativeTime(doc.uploadedAt)}
        </div>

        {/* Delete */}
        <div className="w-8 shrink-0 flex justify-end">
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${doc.name}? It will be removed from retrieval immediately.`)) {
                onDelete(doc.id);
              }
            }}
            className="text-[var(--fg-subtle)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100 p-1"
            title="Delete document"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Inline Error (if failed) */}
      {isFailed && (
        <div className="px-4 pb-3 pl-[3.25rem] flex items-center gap-2 text-xs">
          <AlertCircle size={12} className="text-[var(--color-warning)]" />
          <span className="text-[var(--color-warning)]">
            {doc.errorReason || "Processing failed"}
          </span>
          <span className="text-[var(--fg-subtle)] mx-1">•</span>
          <button className="text-[var(--fg-base)] font-medium hover:underline flex items-center gap-1">
            <RefreshCw size={10} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
