import { useQuery } from "@tanstack/react-query";

interface UserStats {
  totalRituals: number;
  completedRituals: number;
  journalEntries: number;
  streak: number;
}

export function useStats() {
  return useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });
}
