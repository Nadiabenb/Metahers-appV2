import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { JournalEntry } from "@shared/schema";

export function useJournal() {
  const query = useQuery<JournalEntry>({
    queryKey: ["/api/journal"],
  });

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/journal", { content });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/journal"], data);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  return {
    content: query.data?.content || "",
    streak: query.data?.streak || 0,
    lastSaved: query.data?.lastSaved,
    isLoading: query.isLoading,
    saveJournal: (content: string) => saveMutation.mutate(content),
    isSaving: saveMutation.isPending,
  };
}
