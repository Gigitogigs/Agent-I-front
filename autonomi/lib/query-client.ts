import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,      // 30 s — suitable for approval queue polling
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
