"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpcomingTripCard } from "@/components/dashboard/UpcomingTripCard";
import { TripCard } from "@/components/trips/TripCard";
import { DestinationCard } from "@/components/dashboard/DestinationCard";
import { BudgetSummaryWidget } from "@/components/dashboard/BudgetSummary";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import {
  TripCardSkeleton,
  DestinationCardSkeleton,
} from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useMyTrips, useTripMutations } from "@/hooks/use-trips";
import { useTopRegionalDestinations } from "@/hooks/use-destinations";
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: tripsData, isLoading: tripsLoading } = useMyTrips();
  const { data: destinations, isLoading: destinationsLoading } =
    useTopRegionalDestinations();
  const { deleteTrip } = useTripMutations();

  const trips = tripsData?.trips || [];
  const upcomingTrip = trips.find(
    (t) => t.status === "PLANNING" || t.status === "ONGOING"
  );
  const recentTrips = trips.slice(0, 3);

  const totalEstimatedCost = trips.reduce(
    (acc, curr) => acc + (curr.totalEstimatedCost || 0),
    0
  );
  const totalBudgetLimit = trips.reduce(
    (acc, curr) => acc + (curr.budgetLimit || 0),
    0
  );

  const handleDeleteTrip = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip itinerary?")) {
      await deleteTrip(id);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Welcome & Overview Header */}
        <DashboardHeader user={user} tripCount={trips.length} />

        {/* Top Grid: Upcoming Trip & Quick Budget Summary */}
        {tripsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TripCardSkeleton />
            </div>
            <div>
              <TripCardSkeleton />
            </div>
          </div>
        ) : (
          upcomingTrip && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <UpcomingTripCard trip={upcomingTrip} />
              </div>
              <div>
                <BudgetSummaryWidget
                  totalEstimatedCost={upcomingTrip.totalEstimatedCost || 0}
                  budgetLimit={upcomingTrip.budgetLimit || 0}
                  tripTitle={upcomingTrip.title}
                  tripId={upcomingTrip.id}
                />
              </div>
            </div>
          )
        )}

        {/* Section: My Itineraries */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Itineraries
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Your travel plans and collaborative itineraries
              </p>
            </div>

            {trips.length > 0 && (
              <Link
                href="/trips"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all ({trips.length})
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {tripsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <TripCardSkeleton key={i} />
              ))}
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={handleDeleteTrip}
                />
              ))}
            </div>
          ) : (
            <EmptyTripsState />
          )}
        </section>

        {/* Section: Recommended Destinations */}
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">
                  Recommended Destinations
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Hand-picked trending cities and inspiration for your next itinerary
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Explore all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {destinationsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations?.slice(0, 4).map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
