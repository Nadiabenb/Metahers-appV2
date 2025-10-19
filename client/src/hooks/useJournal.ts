import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { JournalEntry } from "@shared/schema";

interface SaveJournalParams {
  content: string;
  streak?: number;
  mood?: string | null;
  tags?: string[];
  aiPrompt?: string;
}

export function useJournal() {
  const query = useQuery<JournalEntry>({
    queryKey: ["/api/journal"],
  });

  const saveMutation = useMutation({
    mutationFn: async (params: SaveJournalParams) => {
      const res = await apiRequest("POST", "/api/journal", params);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/journal"], data);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  return {
    content: query.data?.content || "",
    mood: query.data?.mood,
    tags: query.data?.tags || [],
    wordCount: query.data?.wordCount || 0,
    aiInsights: query.data?.aiInsights,
    aiPrompt: query.data?.aiPrompt,
    streak: query.data?.streak || 0,
    lastSaved: query.data?.lastSaved,
    isLoading: query.isLoading,
    saveJournal: (content: string, streak?: number, mood?: string | null, tags?: string[], aiPrompt?: string) => 
      saveMutation.mutate({ content, streak, mood, tags, aiPrompt }),
    isSaving: saveMutation.isPending,
  };
}
