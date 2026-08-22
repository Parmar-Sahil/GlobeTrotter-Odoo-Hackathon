"use client";

import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/lib/services/activity.service";
import { ActivityCategory } from "@/types";

export function useSearchActivities(params?: {
  query?: string;
  destinationId?: string;
  category?: ActivityCategory;
  minCost?: number;
  maxCost?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["activities", "search", params],
    queryFn: () => activityService.search(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => activityService.getById(id),
    enabled: !!id,
  });
}
