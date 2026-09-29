"use client";

import { UploadCloud, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUploadDocument } from "@/features/knowledge/use-knowledge";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTag, setSelectedTag] = useState("General");
  const uploadMutation = useUploadDocument();

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    // Iterate over files and upload each.
    // The backend endpoint might only accept one file at a time based on our formData structure.
    Array.from(files).forEach((file) => {
      uploadMutation.mutate(file);
    });
  }

  return (
    <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded-lg overflow-hidden relative">
      {uploadMutation.isPending && (
        <div className="absolute inset-0 bg-[var(--bg-surface)]/50 flex items-center justify-center z-10">
          <Loader2 className="animate-spin text-[var(--fg-base)]" size={24} />
        </div>
      )}
      
      {/* Drop zone */}
      <label
        htmlFor="kb-file-upload"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "block px-6 py-10 text-center transition-colors border-b border-[var(--border-hairline)] cursor-pointer",
          isDragging ? "bg-[var(--bg-muted)] border-dashed border-[var(--fg-base)]" : "hover:bg-[var(--bg-subtle)]",
          uploadMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
        )}
      >
        <input
          id="kb-file-upload"
          type="file"
          multiple
          disabled={uploadMutation.isPending}
          accept=".pdf, .doc, .docx, .csv, .xlsx, .xls, .txt, .md, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain, text/markdown"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <UploadCloud className="mx-auto mb-3 text-[var(--fg-subtle)]" size={24} />
        <p className="text-sm font-medium text-[var(--fg-base)]">
          Drag & drop files here, or click to browse
        </p>
        <p className="text-xs text-[var(--fg-muted)] mt-1">
          (Multiple files supported: PDF, DOC(X), CSV, XLS(X), TXT, MD)
        </p>
        {uploadMutation.isError && (
          <p className="text-xs text-[var(--color-danger)] mt-2">
            Failed to upload document.
          </p>
        )}
      </label>

      {/* Metadata tagging */}
      <div className="px-4 py-3 bg-[var(--bg-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-[var(--fg-muted)]">Apply tag:</span>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            disabled={uploadMutation.isPending}
            className="bg-transparent border border-[var(--border-hairline)] text-[var(--fg-base)] rounded px-2 py-1 focus:outline-none focus:border-[var(--fg-base)] disabled:opacity-50"
          >
            <option value="General">General</option>
            <option value="Policy">Policy</option>
            <option value="Billing">Billing</option>
            <option value="Shipping">Shipping</option>
            <option value="Product">Product Specs</option>
          </select>
          <button 
            className="text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors p-1 disabled:opacity-50" 
            title="Create new tag"
            disabled={uploadMutation.isPending}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
