"use client";

import { useState } from "react";
import { ChevronsUpDown, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { AddWorkspaceModal } from "@/components/workspace/add-workspace-modal";
import { Plus } from "lucide-react";

interface WorkspaceSwitcherProps {
  collapsed: boolean;
}

export default function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const { memberships, activeWorkspaceId, setActiveWorkspace } = useAuth();
  const [open, setOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const activeMembership = memberships.find((m) => m.workspace_id === activeWorkspaceId)
    ?? memberships[0];

  const hasMultiple = memberships.length > 1;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-2 p-3 text-left",
          "text-[var(--fg-base)] transition-colors hover:bg-[var(--bg-muted)] cursor-pointer"
        )}
        title={collapsed ? (activeMembership?.workspace_name ?? "Workspace") : undefined}
      >
        <div className="w-7 h-7 rounded flex items-center justify-center bg-[var(--bg-muted)] shrink-0">
          <Building2 size={14} className="text-[var(--fg-muted)]" />
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--fg-base)] truncate">
                {activeMembership?.workspace_name ?? "Loading…"}
              </p>
              <p className="text-xs text-[var(--fg-muted)] capitalize">
                {activeMembership?.role ?? ""}
              </p>
            </div>
            <ChevronsUpDown size={12} className="text-[var(--fg-subtle)] shrink-0" />
          </>
        )}
      </button>

      {/* Dropdown — only rendered when open */}
      {open && (
        <>
          {/* Click-away overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className={cn(
            "absolute left-2 right-2 z-20 mt-1 rounded border",
            "bg-[var(--bg-surface)] border-[var(--border-hairline)] shadow-lg",
            "top-full"
          )}>
            {memberships.map((m) => (
              <button
                key={m.workspace_id}
                onClick={() => {
                  setActiveWorkspace(m.workspace_id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-left text-xs",
                  "hover:bg-[var(--bg-muted)] transition-colors",
                  m.workspace_id === activeWorkspaceId && "text-[var(--fg-base)]"
                )}
              >
                <Check
                  size={11}
                  className={cn(
                    "shrink-0",
                    m.workspace_id === activeWorkspaceId
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.workspace_name}</p>
                  <p className="text-[var(--fg-muted)] capitalize">{m.role}</p>
                </div>
              </button>
            ))}
            
            <div className="h-px bg-[var(--border-hairline)] my-1 mx-2" />
            <button
              onClick={() => {
                setOpen(false);
                setAddModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-[var(--fg-base)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              <Plus size={12} className="text-[var(--fg-muted)] shrink-0" />
              <span className="font-medium">New Workspace</span>
            </button>
          </div>
        </>
      )}

      <AddWorkspaceModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}
