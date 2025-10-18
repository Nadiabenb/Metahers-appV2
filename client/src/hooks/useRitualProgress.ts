import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { RitualProgress } from "@shared/schema";

export function useRitualProgress(slug: string) {
  const query = useQuery<RitualProgress>({
    queryKey: [`/api/rituals/${slug}/progress`],
    enabled: !!slug,
  });

  const updateMutation = useMutation({
    mutationFn: async (completedSteps: number[]) => {
      const res = await apiRequest("POST", `/api/rituals/${slug}/progress`, { completedSteps });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/rituals/${slug}/progress`], data);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  return {
    completedSteps: query.data?.completedSteps || [],
    isLoading: query.isLoading,
    updateProgress: (steps: number[]) => updateMutation.mutate(steps),
    isUpdating: updateMutation.isPending,
  };
}

export function useAllRitualProgress() {
  return useQuery<Record<string, RitualProgress>>({
    queryKey: ["/api/rituals/progress"],
  });
}
