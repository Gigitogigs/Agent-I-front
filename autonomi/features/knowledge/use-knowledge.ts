import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, axiosInstance } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export type DocStatus = "READY" | "PROCESSING" | "FAILED";

export interface KnowledgeDocument {
  id: string;
  filename: string;           // was: name
  status: DocStatus;
  tags: Record<string, string> | null;  // was: string[]
  file_size_bytes: number;    // was: sizeBytes
  chunk_count: number | null; // was: chunks
  created_at: string;         // was: uploadedAt
  error_message: string | null; // was: errorReason
}

export const STATUS_OPTIONS: { id: DocStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All statuses" },
  { id: "READY", label: "Ready" },
  { id: "PROCESSING", label: "Processing" },
  { id: "FAILED", label: "Failed" },
];

export function formatBytes(bytes: number, decimals = 0) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function useKnowledgeDocuments(
  searchQuery: string = "",
  status: DocStatus | "ALL" = "ALL"
) {
  const { activeWorkspaceId } = useAuth();

  return useQuery<KnowledgeDocument[]>({
    queryKey: ["workspaces", activeWorkspaceId, "knowledge", { searchQuery, status }],
    queryFn: () => {
      const url = new URL(`/api/v1/workspaces/${activeWorkspaceId}/knowledge-base`, window.location.origin);
      if (status !== "ALL") {
        url.searchParams.set("status", status);
      }
      if (searchQuery.trim()) {
        url.searchParams.set("search", searchQuery.trim());
      }
      return apiClient.get<KnowledgeDocument[]>(`/workspaces/${activeWorkspaceId}/knowledge-base${url.search}`);
    },
    enabled: !!activeWorkspaceId,
    refetchInterval: (query) =>
      (query.state.data as KnowledgeDocument[] | undefined)?.some(d => d.status === 'PROCESSING') ? 5000 : false,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      // We must use axiosInstance directly to set multipart/form-data
      return axiosInstance
        .post(`/workspaces/${activeWorkspaceId}/knowledge-base/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "knowledge"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();

  return useMutation({
    mutationFn: (docId: string) =>
      apiClient.delete(`/workspaces/${activeWorkspaceId}/knowledge-base/${docId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", activeWorkspaceId, "knowledge"] });
    },
  });
}

export interface RetrievalResult {
  source: string;
  chunk: string;
  score: number;
}

export function useTestRetrieval() {
  const { activeWorkspaceId } = useAuth();

  return useMutation({
    mutationFn: ({ query }: { query: string }) =>
      apiClient.post<{ results: RetrievalResult[] }>(
        `/workspaces/${activeWorkspaceId}/knowledge-base/test-retrieval`,
        { query }
      ).then(res => res.results),
  });
}

export function useRetryDocument() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useAuth();
  return useMutation({
    mutationFn: (docId: string) =>
      apiClient.post(`/workspaces/${activeWorkspaceId}/knowledge-base/${docId}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', activeWorkspaceId, 'knowledge'] });
    },
  });
}
