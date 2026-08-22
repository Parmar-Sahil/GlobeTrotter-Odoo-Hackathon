"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ContinuePlanning } from "@/components/dashboard/ContinuePlanning";
import { UpcomingTripCard } from "@/components/dashboard/UpcomingTripCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DestinationCard } from "@/components/dashboard/DestinationCard";
import { ExperienceDiscovery } from "@/components/dashboard/ExperienceDiscovery";
import { TravelInspiration } from "@/components/dashboard/TravelInspiration";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import {
  TripCardSkeleton,
  DestinationCardSkeleton,
} from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useMyTrips } from "@/hooks/use-trips";
import { useTopRegionalDestinations } from "@/hooks/use-destinations";
import { useSearchActivities } from "@/hooks/use-activities";
import {
  MapPin,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Compass,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // 1. Real Trips API
  const {
    data: tripsData,
    isLoading: tripsLoading,
    isError: tripsError,
    refetch: refetchTrips,
  } = useMyTrips();

  // 2. Real Destinations API
  const {
    data: destinations,
    isLoading: destinationsLoading,
    isError: destinationsError,
    refetch: refetchDestinations,
  } = useTopRegionalDestinations();

  // 3. Real Activities API
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
  } = useSearchActivities({ limit: 6 });

  const trips = tripsData?.trips || [];
  
  // Find draft/planning trip for "Continue Planning"
  const draftTrip = trips.find((t) => t.status === "PLANNING");

  // Upcoming confirmed trips
  const upcomingTrips = trips.filter(
    (t) => t.status === "PLANNING" || t.status === "ONGOING"
  );
  const primaryUpcomingTrip = upcomingTrips[0] || trips[0];
  const otherUpcomingTrips = upcomingTrips.slice(1, 3);

  // Fallback presentation destinations if API response is empty
  const fallbackDestinations = [
    {
      id: "dest-kyoto",
      name: "Kyoto",
      country: "Japan",
      region: "Asia",
      description: "Historic shrines, bamboo groves & matcha tea gardens.",
      imageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9,
    },
    {
      id: "dest-goa",
      name: "Goa",
      country: "India",
      region: "Asia",
      description: "Sun-drenched beaches, Portuguese heritage & seafood trails.",
      imageUrl:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
      popularity: 96,
      rating: 4.8,
    },
    {
      id: "dest-bali",
      name: "Bali",
      country: "Indonesia",
      region: "Asia",
      description: "Emerald rice terraces, spiritual retreats & surf breaks.",
      imageUrl:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9,
    },
    {
      id: "dest-paris",
      name: "Paris",
      country: "France",
      region: "Europe",
      description: "Iconic architecture, world-class art galleries & cafe culture.",
      imageUrl:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
      popularity: 99,
      rating: 4.8,
    },
  ];

  const displayDestinations =
    destinations && destinations.length > 0
      ? destinations.slice(0, 4)
      : fallbackDestinations;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-300">
        {/* 1. Personalized Header with Time-of-Day Greeting and Primary CTA */}
        <DashboardHeader user={user} tripCount={trips.length} />

        {/* 2. Continue Planning (Only rendered when a draft trip exists) */}
        {draftTrip && (
          <section className="space-y-4">
            <ContinuePlanning trip={draftTrip} />
          </section>
        )}

        {/* 3. Upcoming Trips Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F95724]" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  Your Upcoming Trips
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Your planned itineraries and upcoming travel schedules
              </p>
            </div>

            {trips.length > 0 && (
              <Link
                href="/trips"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412] transition-colors"
              >
                View all ({trips.length})
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {tripsLoading ? (
            <div className="space-y-4">
              <TripCardSkeleton />
            </div>
          ) : tripsError ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-rose-700 font-bold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Couldn&apos;t load your trips.</span>
              </div>
              <button
                type="button"
                onClick={() => refetchTrips()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100/50 shadow-2xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
            </div>
          ) : primaryUpcomingTrip ? (
            <div className="space-y-6">
              <UpcomingTripCard trip={primaryUpcomingTrip} />

              {/* Other upcoming trips if multiple */}
              {otherUpcomingTrips.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {otherUpcomingTrips.map((otherTrip) => (
                    <div
                      key={otherTrip.id}
                      className="p-5 rounded-3xl bg-white border border-orange-100 hover:border-orange-200 shadow-xs flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F95724] bg-orange-50 px-2.5 py-0.5 rounded-md">
                          Upcoming
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 truncate">
                          {otherTrip.title}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {new Date(otherTrip.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          —{" "}
                          {new Date(otherTrip.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <Link
                        href={`/trips/${otherTrip.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#7C2D12] text-white text-xs font-bold hover:bg-[#9A3412] shrink-0 transition-colors"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyTripsState />
          )}
        </section>

        {/* 4. Quick Actions */}
        <QuickActions />

        {/* 5. Popular Destinations ("Places worth going.") */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#F95724]" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  Places worth going.
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Trending cities, cultural capitals and curated regional spots
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412] transition-colors"
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
          ) : destinationsError ? (
            <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100 text-center space-y-2">
              <p className="text-xs text-slate-600 font-medium">
                Destinations couldn&apos;t be loaded right now.
              </p>
              <button
                type="button"
                onClick={() => refetchDestinations()}
                className="px-4 py-1.5 rounded-full bg-white border border-orange-200 text-xs font-bold text-[#7C2D12] hover:bg-orange-50 shadow-2xs"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </section>

        {/* 6. Experiences / Activities ("Make the journey memorable.") */}
        <ExperienceDiscovery
          activities={activitiesData?.activities}
          isLoading={activitiesLoading}
        />

        {/* 7. Travel Inspiration */}
        <TravelInspiration />
      </div>
    </AppLayout>
  );
}
