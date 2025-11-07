import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ExperienceProgressDB } from "@shared/schema";

export function useExperienceProgress(experienceId: string) {
  const query = useQuery<ExperienceProgressDB>({
    queryKey: [`/api/experiences/${experienceId}/progress`],
    enabled: !!experienceId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      completedSections?: string[];
      confidenceScore?: number;
      businessImpact?: string;
      milestonesAchieved?: string[];
    }) => {
      const res = await apiRequest("POST", `/api/experiences/${experienceId}/progress`, data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/experiences/${experienceId}/progress`], data);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
  });

  const completeSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const currentCompleted = query.data?.completedSections || [];
      const newCompleted = currentCompleted.includes(sectionId)
        ? currentCompleted
        : [...currentCompleted, sectionId];
      
      const res = await apiRequest("POST", `/api/experiences/${experienceId}/progress`, {
        completedSections: newCompleted,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/experiences/${experienceId}/progress`], data);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
  });

  return {
    progress: query.data,
    completedSections: query.data?.completedSections || [],
    confidenceScore: query.data?.confidenceScore,
    isLoading: query.isLoading,
    updateProgress: (data: Parameters<typeof updateMutation.mutate>[0]) => updateMutation.mutate(data),
    completeSection: (sectionId: string) => completeSectionMutation.mutate(sectionId),
    isUpdating: updateMutation.isPending || completeSectionMutation.isPending,
  };
}
