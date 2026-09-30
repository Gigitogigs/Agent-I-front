"use client";

import { useState } from "react";
import { ChevronsUpDown, Building2, Check, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { AddWorkspaceModal } from "@/components/workspace/add-workspace-modal";
import { RenameWorkspaceModal } from "@/components/workspace/rename-workspace-modal";

const WORKSPACE_COLORS = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "bg-rose-500/10 text-rose-500 border-rose-500/20",
  "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
];

function getWorkspaceColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return WORKSPACE_COLORS[Math.abs(hash) % WORKSPACE_COLORS.length];
}

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

interface WorkspaceSwitcherProps {
  collapsed: boolean;
}

export default function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const { memberships, activeWorkspaceId, setActiveWorkspace } = useAuth();
  const [open, setOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameWorkspaceId, setRenameWorkspaceId] = useState("");
  const [renameWorkspaceName, setRenameWorkspaceName] = useState("");

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
        <div className={cn(
          "w-7 h-7 rounded flex items-center justify-center border shrink-0 font-medium text-xs shadow-sm",
          activeMembership ? getWorkspaceColor(activeMembership.workspace_id) : "bg-[var(--bg-muted)] border-transparent"
        )}>
          {activeMembership ? getInitials(activeMembership.workspace_name) : <Building2 size={14} className="text-[var(--fg-muted)]" />}
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
              <div
                key={m.workspace_id}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-xs",
                  "hover:bg-[var(--bg-muted)] transition-colors group",
                  m.workspace_id === activeWorkspaceId && "text-[var(--fg-base)]"
                )}
              >
                <button
                  onClick={() => {
                    setActiveWorkspace(m.workspace_id);
                    setOpen(false);
                  }}
                  className="flex-1 flex items-center gap-2 text-left min-w-0 pr-2"
                >
                  <div className="w-4 flex items-center justify-center shrink-0">
                    <Check
                      size={11}
                      className={cn(
                        m.workspace_id === activeWorkspaceId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center border shrink-0 font-medium text-[10px]",
                    getWorkspaceColor(m.workspace_id)
                  )}>
                    {getInitials(m.workspace_name)}
                  </div>
                  <div className="min-w-0 flex-1 ml-1">
                    <p className="font-medium truncate">{m.workspace_name}</p>
                    <p className="text-[var(--fg-muted)] capitalize text-[10px]">{m.role}</p>
                  </div>
                </button>
                {m.role === "owner" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameWorkspaceId(m.workspace_id);
                      setRenameWorkspaceName(m.workspace_name);
                      setRenameModalOpen(true);
                      setOpen(false);
                    }}
                    className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-all shrink-0"
                    title="Rename Workspace"
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
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
      {renameWorkspaceId && (
        <RenameWorkspaceModal
          open={renameModalOpen}
          onClose={() => setRenameModalOpen(false)}
          workspaceId={renameWorkspaceId}
          initialName={renameWorkspaceName}
        />
      )}
    </div>
  );
}
