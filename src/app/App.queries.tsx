import { QueryClient } from "@tanstack/react-query";

export const singletonQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //keeps data for 1hr unless data is forecefully refreshed
      // or inidivudal useQuery or useQueries define granularity
      staleTime: 1000 * 60 * 60,
    },
  },
});
