import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const useCreateWorkspace = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => apiClient.post<{ id: string; name: string }>("/workspaces", { name }),
    onSuccess: () => {
      // Invalidate the auth query so it refetches /auth/me and gets the updated memberships list
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    }
  });
};

export const useRenameWorkspace = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, name }: { workspaceId: string; name: string }) => 
      apiClient.patch<{ id: string; name: string }>(`/workspaces/${workspaceId}`, { name }),
    onSuccess: () => {
      // Invalidate auth so the sidebar workspace list updates
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    }
  });
};
