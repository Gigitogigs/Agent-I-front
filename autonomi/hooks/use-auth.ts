"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient, axiosInstance } from "@/lib/api-client";
import { tokenStore } from "@/lib/token-store";
import { useRouter } from "next/navigation";

export interface MembershipOut {
  workspace_id: string;
  workspace_name: string;
  role: string;
}

export interface UserOut {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  created_at: string;
  memberships: MembershipOut[];
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Client-side active workspace — persisted in localStorage
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem("activeWorkspaceId") ?? undefined;
  });

  const { data: userOut, isLoading, error } = useQuery<UserOut>({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.get<UserOut>("/auth/me"),
    retry: false, // Don't retry auth checks if unauthorized
  });

  // When memberships load, initialize activeWorkspaceId if not yet set
  useEffect(() => {
    if (userOut?.memberships?.length && !activeWorkspaceId) {
      const firstId = userOut.memberships[0].workspace_id;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveWorkspaceId(firstId);
      localStorage.setItem("activeWorkspaceId", firstId);
    }
  }, [userOut, activeWorkspaceId]);

  function setActiveWorkspace(id: string) {
    setActiveWorkspaceId(id);
    localStorage.setItem("activeWorkspaceId", id);
    // Invalidate all workspace-scoped queries so they refetch for the new workspace
    queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes("workspaces") });
  }

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSuccess: () => {
      tokenStore.clear();
      delete axiosInstance.defaults.headers.common['Authorization'];
      localStorage.removeItem("activeWorkspaceId");
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      router.push("/login");
    },
  });

  const activeMembership = userOut?.memberships?.find(
    (m) => m.workspace_id === activeWorkspaceId
  ) ?? userOut?.memberships?.[0];
  const activeRole = activeMembership?.role;
  const isOwner = activeRole === "owner";
  
  // Create a compatible user object for the existing UI
  const user = userOut ? {
    id: userOut.id,
    name: userOut.full_name,
    email: userOut.email,
    avatarUrl: userOut.avatar_url || undefined,
  } : undefined;

  return {
    session: userOut, // Exposing raw UserOut if needed
    user,
    memberships: userOut?.memberships ?? [],
    activeWorkspaceId,
    setActiveWorkspace,
    activeRole,
    isOwner,
    isLoading,
    error,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
}
