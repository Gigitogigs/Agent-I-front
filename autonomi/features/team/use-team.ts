export type Role = "Owner" | "Admin" | "Operator" | "Read-only";
export type MemberStatus = "Active" | "Pending";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  lastActive?: string; // e.g. "Just now", "2h ago", undefined if pending
}

export const STUB_TEAM: TeamMember[] = [
  {
    id: "m1",
    name: "Gigito",
    email: "gigito@example.com",
    role: "Owner",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "m2",
    name: "Jane K.",
    email: "jane@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2h ago",
  },
  {
    id: "m3",
    name: "Sam O.",
    email: "sam@example.com",
    role: "Operator",
    status: "Active",
    lastActive: "1d ago",
  },
  {
    id: "m4",
    name: "",
    email: "m.wanjiru@example.com",
    role: "Operator",
    status: "Pending",
  }
];

export const ROLE_PERMISSIONS = [
  { role: "Owner", approvals: "✓", config: "✓", billing: "✓", team: "✓", deleteWs: "✓" },
  { role: "Admin", approvals: "✓", config: "✓", billing: "✓", team: "✓", deleteWs: "—" },
  { role: "Operator", approvals: "✓", config: "—", billing: "—", team: "—", deleteWs: "—" },
  { role: "Read-only", approvals: "view only", config: "—", billing: "—", team: "—", deleteWs: "—" },
];
