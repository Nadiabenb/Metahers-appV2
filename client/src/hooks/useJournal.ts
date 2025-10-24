import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { JournalEntry } from "@shared/schema";

interface SaveJournalParams {
  content: string;
  date?: string;
  streak?: number;
  mood?: string | null;
  tags?: string[];
  aiPrompt?: string;
}

export function useJournal(date?: string) {
  const journalDate = date || new Date().toISOString().split('T')[0];
  
  const query = useQuery<JournalEntry>({
    queryKey: ["/api/journal", journalDate],
    queryFn: async () => {
      const res = await fetch(`/api/journal?date=${journalDate}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch journal");
      return await res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (params: SaveJournalParams) => {
      const res = await apiRequest("POST", "/api/journal", {
        ...params,
        date: journalDate,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/journal", journalDate], data);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
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
    date: journalDate,
    saveJournal: (content: string, streak?: number, mood?: string | null, tags?: string[], aiPrompt?: string) => 
      saveMutation.mutate({ content, streak, mood, tags, aiPrompt, date: journalDate }),
    isSaving: saveMutation.isPending,
  };
}
