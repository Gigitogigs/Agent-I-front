import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export interface MemberOut {
  id: string | null;
  name: string | null;
  email: string;
  avatar_url: string | null;
  role: string;
  status: string;
  last_active_at: string | null;
}

export function useMembers() {
  const { activeWorkspaceId } = useAuth();
  return useQuery<MemberOut[]>({
    queryKey: ['workspaces', activeWorkspaceId, 'members'],
    queryFn: () =>
      apiClient.get<MemberOut[]>(`/workspaces/${activeWorkspaceId}/members`),
    enabled: !!activeWorkspaceId,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      apiClient.post<MemberOut>(`/workspaces/${activeWorkspaceId}/members`, { email, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', activeWorkspaceId, 'members'] });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      apiClient.patch(`/workspaces/${activeWorkspaceId}/members/${memberId}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', activeWorkspaceId, 'members'] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient.delete(`/workspaces/${activeWorkspaceId}/members/${memberId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', activeWorkspaceId, 'members'] });
    },
  });
}

export function useResendInvite() {
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient.post(`/workspaces/${activeWorkspaceId}/members/${memberId}/resend-invite`),
  });
}

export const ROLE_PERMISSIONS = [
  { role: "owner", approvals: "✓", config: "✓", billing: "✓", team: "✓", deleteWs: "✓" },
  { role: "admin", approvals: "✓", config: "✓", billing: "✓", team: "✓", deleteWs: "—" },
  { role: "operator", approvals: "✓", config: "—", billing: "—", team: "—", deleteWs: "—" },
  { role: "read-only", approvals: "view only", config: "—", billing: "—", team: "—", deleteWs: "—" },
];
