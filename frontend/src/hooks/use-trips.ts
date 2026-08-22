"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tripService,
  CreateTripDto,
  UpdateTripDto,
  AddSectionDto,
  AddItemDto,
} from "@/lib/services/trip.service";

export function useMyTrips(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["trips", "my-trips", params],
    queryFn: () => tripService.getMyTrips(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => tripService.getTripById(tripId),
    enabled: !!tripId,
  });
}

export function useTripItinerary(tripId: string) {
  return useQuery({
    queryKey: ["trips", tripId, "itinerary"],
    queryFn: () => tripService.getItinerary(tripId),
    enabled: !!tripId,
  });
}

export function useTripBudget(tripId: string) {
  return useQuery({
    queryKey: ["trips", tripId, "budget"],
    queryFn: () => tripService.getBudgetSummary(tripId),
    enabled: !!tripId,
  });
}

export function useTripMutations(tripId?: string) {
  const queryClient = useQueryClient();

  const createTripMutation = useMutation({
    mutationFn: (data: CreateTripDto) => tripService.createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTripDto }) =>
      tripService.updateTrip(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["trips", "my-trips"] });
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: (id: string) => tripService.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  const addSectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddSectionDto }) =>
      tripService.addSection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id, "itinerary"] });
      queryClient.invalidateQueries({ queryKey: ["trips", variables.id, "budget"] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string;
      tripId: string;
      data: AddItemDto;
    }) => tripService.addItem(sectionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips", variables.tripId, "itinerary"] });
      queryClient.invalidateQueries({ queryKey: ["trips", variables.tripId, "budget"] });
    },
  });

  return {
    createTrip: createTripMutation.mutateAsync,
    isCreating: createTripMutation.isPending,
    createError: createTripMutation.error,

    updateTrip: updateTripMutation.mutateAsync,
    isUpdating: updateTripMutation.isPending,

    deleteTrip: deleteTripMutation.mutateAsync,
    isDeleting: deleteTripMutation.isPending,

    addSection: addSectionMutation.mutateAsync,
    isAddingSection: addSectionMutation.isPending,

    addItem: addItemMutation.mutateAsync,
    isAddingItem: addItemMutation.isPending,
  };
}
