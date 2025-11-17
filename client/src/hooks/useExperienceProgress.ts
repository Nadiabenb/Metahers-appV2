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
    mutationFn: async (params: { 
      sectionId: string | number;
      timeSpentSeconds?: number;
      quizScore?: number;
    }) => {
      // Normalize section ID to string for consistency
      const normalizedId = String(params.sectionId);
      const currentCompleted = query.data?.completedSections || [];
      
      // Deduplicate: ensure we don't add if it already exists (case-insensitive)
      const isDuplicate = currentCompleted.some(
        id => String(id).toLowerCase() === normalizedId.toLowerCase()
      );
      
      const newCompleted = isDuplicate
        ? currentCompleted
        : [...currentCompleted, normalizedId];
      
      // Track granular completion first (if sectionId is numeric - normalized schema)
      if (!isNaN(Number(params.sectionId))) {
        await apiRequest("POST", `/api/experiences/${experienceId}/sections/${params.sectionId}/complete`, {
          timeSpentSeconds: params.timeSpentSeconds,
          quizScore: params.quizScore,
        });
      }
      
      // Update legacy progress tracker with deduplicated array
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
    completeSection: (sectionId: string | number, timeSpentSeconds?: number, quizScore?: number) => 
      completeSectionMutation.mutate({ sectionId, timeSpentSeconds, quizScore }),
    isUpdating: updateMutation.isPending || completeSectionMutation.isPending,
  };
}
