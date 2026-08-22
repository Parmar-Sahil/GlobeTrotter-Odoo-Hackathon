"use client";

import { useQuery } from "@tanstack/react-query";
import { destinationService } from "@/lib/services/destination.service";

export function useTopRegionalDestinations() {
  return useQuery({
    queryKey: ["destinations", "top-regional"],
    queryFn: () => destinationService.getTopRegional(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useSearchDestinations(params?: {
  query?: string;
  region?: string;
  country?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["destinations", "search", params],
    queryFn: () => destinationService.search(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: ["destinations", id],
    queryFn: () => destinationService.getById(id),
    enabled: !!id,
  });
}
