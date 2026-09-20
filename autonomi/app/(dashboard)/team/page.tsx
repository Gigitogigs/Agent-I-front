"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUB_TEAM, ROLE_PERMISSIONS, type TeamMember, type Role } from "@/features/team/use-team";

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(STUB_TEAM);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (id: string, newRole: Role) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-6 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--fg-base)]">Team & Roles</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Manage who has access to this workspace.
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] px-4 py-2 rounded hover:opacity-90 transition-opacity shadow-sm">
          <Plus size={16} /> Invite member
        </button>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-6 space-y-8">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors shadow-sm"
          />
        </div>

        {/* Member Table */}
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)] shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                <th className="px-5 py-3 w-1/4">Name</th>
                <th className="px-5 py-3 w-1/4">Email</th>
                <th className="px-5 py-3 w-40">Role</th>
                <th className="px-5 py-3 w-24">Status</th>
                <th className="px-5 py-3 w-32">Last Active</th>
                <th className="px-5 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[var(--bg-muted)] transition-colors group">
                  <td className="px-5 py-3 font-medium">
                    {member.name || <span className="text-[var(--fg-muted)] italic">Pending...</span>}
                  </td>
                  <td className="px-5 py-3 text-[var(--fg-muted)] truncate max-w-[200px]">
                    {member.email}
                  </td>
                  <td className="px-5 py-3">
                    {member.role === "Owner" ? (
                      <span className="font-medium text-[var(--fg-base)] px-2 py-1">Owner</span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                        className="bg-transparent text-[var(--fg-base)] focus:outline-none cursor-pointer px-1 py-1 rounded hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-hairline)] transition-colors"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                        <option value="Read-only">Read-only</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide",
                        member.status === "Active"
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                          : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                      )}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--fg-muted)]">
                    {member.lastActive || "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {member.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-xs font-medium text-[var(--fg-base)] hover:underline whitespace-nowrap">
                          Resend
                        </button>
                        <button className="p-1.5 text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors rounded hover:bg-[var(--bg-surface)]">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    ) : (
                      <button className="p-1.5 text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors rounded hover:bg-[var(--bg-surface)] opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[var(--fg-muted)]">
                    No members found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Role Permissions Legend */}
        <div className="pt-6">
          <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-3">Role permissions</h3>
          <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)] shadow-sm max-w-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] text-[11px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wider">
                  <th className="px-5 py-2.5">Role</th>
                  <th className="px-5 py-2.5 text-center">Approvals</th>
                  <th className="px-5 py-2.5 text-center">Agent Config</th>
                  <th className="px-5 py-2.5 text-center">Billing</th>
                  <th className="px-5 py-2.5 text-center">Team</th>
                  <th className="px-5 py-2.5 text-center">Delete WS</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[var(--border-hairline)]">
                {ROLE_PERMISSIONS.map((perm) => (
                  <tr key={perm.role} className="text-[var(--fg-muted)]">
                    <td className="px-5 py-2.5 font-medium text-[var(--fg-base)]">{perm.role}</td>
                    <td className="px-5 py-2.5 text-center">{perm.approvals}</td>
                    <td className="px-5 py-2.5 text-center">{perm.config}</td>
                    <td className="px-5 py-2.5 text-center">{perm.billing}</td>
                    <td className="px-5 py-2.5 text-center">{perm.team}</td>
                    <td className="px-5 py-2.5 text-center">{perm.deleteWs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
