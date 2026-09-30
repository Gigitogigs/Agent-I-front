"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { useCreateWorkspace } from "@/features/workspace/use-workspace";
import { useAuth } from "@/hooks/use-auth";

interface AddWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddWorkspaceModal({ open, onClose }: AddWorkspaceModalProps) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending, error } = useCreateWorkspace();
  const { setActiveWorkspace } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      // Add a tiny delay to ensure focus works when modal animates in
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await mutateAsync(name.trim());
      // On success, set the new workspace as active
      if (res.data?.id) {
        setActiveWorkspace(res.data.id);
      }
      onClose();
    } catch (_) {
      // Error is caught and stored in the hook state
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm mx-4 sm:mx-0 rounded-xl bg-[var(--bg-surface)] p-6 shadow-2xl">
        <button
          className="absolute right-4 top-4 text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-lg font-semibold text-[var(--fg-base)]">
          Add New Workspace
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-[var(--border-hairline)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--fg-base)] focus:outline-none focus:border-[var(--fg-base)]"
            disabled={isPending}
            required
            aria-label="Workspace name"
          />

          {error && (
            <p className="text-sm text-[var(--color-danger)]" aria-live="assertive">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full flex items-center justify-center gap-2 rounded bg-[var(--accent)] py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating…</span>
              </>
            ) : (
              "Create Workspace"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
