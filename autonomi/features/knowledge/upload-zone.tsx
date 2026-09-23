"use client";

import { UploadCloud, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTag, setSelectedTag] = useState("General");

  return (
    <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded-lg overflow-hidden">
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
          // Stub: handle file drop
        }}
        className={cn(
          "block px-6 py-10 text-center transition-colors border-b border-[var(--border-hairline)] cursor-pointer",
          isDragging ? "bg-[var(--bg-muted)] border-dashed border-[var(--fg-base)]" : "hover:bg-[var(--bg-subtle)]"
        )}
      >
        <input
          id="kb-file-upload"
          type="file"
          multiple
          accept=".pdf, .doc, .docx, .csv, .xlsx, .xls, .txt, .md, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/plain, text/markdown"
          className="hidden"
          onChange={(e) => {
            // Stub: handle file selection via dialog
            if (e.target.files && e.target.files.length > 0) {
              console.log("Files selected:", e.target.files);
            }
          }}
        />
        <UploadCloud className="mx-auto mb-3 text-[var(--fg-subtle)]" size={24} />
        <p className="text-sm font-medium text-[var(--fg-base)]">
          Drag & drop files here, or click to browse
        </p>
        <p className="text-xs text-[var(--fg-muted)] mt-1">
          (Multiple files supported: PDF, DOC(X), CSV, XLS(X), TXT, MD)
        </p>
      </label>

      {/* Metadata tagging */}
      <div className="px-4 py-3 bg-[var(--bg-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-[var(--fg-muted)]">Apply tag:</span>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-transparent border border-[var(--border-hairline)] text-[var(--fg-base)] rounded px-2 py-1 focus:outline-none focus:border-[var(--fg-base)]"
          >
            <option value="General">General</option>
            <option value="Policy">Policy</option>
            <option value="Billing">Billing</option>
            <option value="Shipping">Shipping</option>
            <option value="Product">Product Specs</option>
          </select>
          <button className="text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors p-1" title="Create new tag">
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
