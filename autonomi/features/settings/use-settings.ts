import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export type SettingsRailItem = "profile" | "notifications" | "billing" | "integrations";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface NotificationChannel {
  id: string;
  workspace_id: string;
  channel_type: "slack" | "email" | "teams" | string;
  name: string;
  config: Record<string, any>;
  is_active: boolean;
  on_escalation: boolean;
  on_sla_breach: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | string;
  pdf_url?: string;
}

export interface BillingUsage {
  ai_tokens_used: number;
  ai_tokens_limit: number;
  active_users: number;
  users_limit: number;
}

export interface BillingPlan {
  plan_name: string;
  stripe_customer_id: string | null;
  usage: BillingUsage;
  invoices: Invoice[];
}

export interface Integration {
  id: string;
  workspace_id: string;
  integration_type: string;
  name: string;
  status: string;
  last_checked_at: string | null;
  created_at: string;
}

import type { UserOut } from "@/hooks/use-auth";

export function useProfile() {
  return useQuery<UserOut>({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.get<UserOut>(`/auth/me`),
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.avatarUrl !== undefined) payload.avatar_url = data.avatarUrl;
      return apiClient.patch(`/auth/me`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

// Notifications Hooks
export function useNotifications() {
  const { activeWorkspaceId } = useAuth();
  return useQuery<NotificationChannel[]>({
    queryKey: ["workspaces", activeWorkspaceId, "settings", "notifications"],
    queryFn: () =>
      apiClient.get<NotificationChannel[]>(`/workspaces/${activeWorkspaceId}/settings/notifications`),
    enabled: !!activeWorkspaceId,
  });
}

export function useAddNotificationChannel() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post(`/workspaces/${activeWorkspaceId}/settings/notifications`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "settings", "notifications"] });
    },
  });
}

export function useUpdateNotificationChannel() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      apiClient.put(`/workspaces/${activeWorkspaceId}/settings/notifications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "settings", "notifications"] });
    },
  });
}

export function useDeleteNotificationChannel() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/workspaces/${activeWorkspaceId}/settings/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "settings", "notifications"] });
    },
  });
}

export function useTestNotificationChannel() {
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/workspaces/${activeWorkspaceId}/settings/notifications/${id}/test`),
  });
}

// Billing Hooks
export function useBilling() {
  const { activeWorkspaceId } = useAuth();
  return useQuery<BillingPlan>({
    queryKey: ["workspaces", activeWorkspaceId, "settings", "billing"],
    queryFn: () =>
      apiClient.get<BillingPlan>(`/workspaces/${activeWorkspaceId}/settings/billing`),
    enabled: !!activeWorkspaceId,
  });
}

// Integrations Hooks
export function useIntegrations() {
  const { activeWorkspaceId } = useAuth();
  return useQuery<Integration[]>({
    queryKey: ["workspaces", activeWorkspaceId, "settings", "integrations"],
    queryFn: () =>
      apiClient.get<Integration[]>(`/workspaces/${activeWorkspaceId}/settings/integrations`),
    enabled: !!activeWorkspaceId,
  });
}

export function useAddIntegration() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (data: any) =>
      apiClient.post(`/workspaces/${activeWorkspaceId}/settings/integrations`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "settings", "integrations"] });
    },
  });
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/workspaces/${activeWorkspaceId}/settings/integrations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "settings", "integrations"] });
    },
  });
}
