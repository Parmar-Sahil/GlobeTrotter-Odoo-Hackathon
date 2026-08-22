"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/trips/TripCard";
import { TripFilters } from "@/components/trips/TripFilters";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { TripCardSkeleton } from "@/components/ui/Skeleton";
import { useMyTrips, useTripMutations } from "@/hooks/use-trips";
import { Plus, MapPin, Search } from "lucide-react";

export default function TripsPage() {
  const { data: tripsData, isLoading } = useMyTrips();
  const { deleteTrip } = useTripMutations();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const trips = tripsData?.trips || [];

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.description &&
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || trip.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, statusFilter]);

  const handleDeleteTrip = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip itinerary?")) {
      await deleteTrip(id);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <MapPin className="w-7 h-7 text-[#F95724]" />
              My Travel Itineraries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Manage your upcoming adventures, past journeys, and customized stops
            </p>
          </div>

          <Link
            href="/trips/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Plan a New Trip
          </Link>
        </div>

        {/* Filter Toolbar */}
        <TripFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Trips Grid / List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <EmptyTripsState />
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">
              No matching trips found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or switching to &ldquo;All Trips&rdquo; tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="mt-2 text-xs font-bold text-[#7C2D12] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
