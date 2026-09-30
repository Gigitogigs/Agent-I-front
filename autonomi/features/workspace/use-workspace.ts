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
