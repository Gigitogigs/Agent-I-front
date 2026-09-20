"use client";

import { ChevronsUpDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceSwitcherProps {
  collapsed: boolean;
}

export default function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 p-3 text-left",
        "text-[var(--fg-base)] hover:bg-[var(--bg-muted)] transition-colors"
      )}
      title={collapsed ? "Switch workspace" : undefined}
    >
      <div className="w-7 h-7 rounded flex items-center justify-center bg-[var(--bg-muted)] shrink-0">
        <Building2 size={14} className="text-[var(--fg-muted)]" />
      </div>
      {!collapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--fg-base)] truncate">Demo Workspace</p>
            <p className="text-xs text-[var(--fg-muted)]">Free plan</p>
          </div>
          <ChevronsUpDown size={12} className="text-[var(--fg-subtle)] shrink-0" />
        </>
      )}
    </button>
  );
}
