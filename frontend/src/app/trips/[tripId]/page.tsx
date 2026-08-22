"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripHeader } from "@/components/trips/TripHeader";
import { TripTabs, TripTabType } from "@/components/trips/TripTabs";
import { TripOverview } from "@/components/trips/TripOverview";
import { ItineraryBuilder } from "@/components/itinerary/ItineraryBuilder";
import { CalendarView } from "@/components/trips/CalendarView";
import { BudgetView } from "@/components/budget/BudgetView";
import { ItinerarySkeleton } from "@/components/ui/Skeleton";
import {
  useTrip,
  useTripItinerary,
  useTripBudget,
  useTripMutations,
} from "@/hooks/use-trips";
import { ActivityCategory } from "@/types";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface TripWorkspaceProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default function TripWorkspacePage({ params }: TripWorkspaceProps) {
  const { tripId } = use(params);
  const [activeTab, setActiveTab] = useState<TripTabType>("overview");

  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(tripId);
  const { data: itineraryData, isLoading: itineraryLoading } =
    useTripItinerary(tripId);
  const { data: budgetData } = useTripBudget(tripId);

  const { addSection, addItem } = useTripMutations(tripId);

  const sections = itineraryData?.sections || trip?.sections || [];

  const handleAddSection = async (data: {
    destinationId?: string;
    title: string;
    arrivalDate?: string;
    departureDate?: string;
  }) => {
    await addSection({ id: tripId, data });
  };

  const handleAddItem = async (
    sectionId: string,
    data: {
      activityId?: string;
      title: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      cost?: number;
      category?: ActivityCategory;
    }
  ) => {
    await addItem({ sectionId, tripId, data });
  };

  if (tripLoading || itineraryLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
          <ItinerarySkeleton />
        </div>
      </AppLayout>
    );
  }

  if (tripError || !trip) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Trip Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested itinerary could not be loaded or may have been deleted.
          </p>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return to My Trips
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Header */}
        <TripHeader trip={trip} />

        {/* Tab Navigation */}
        <TripTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sectionsCount={sections.length}
        />

        {/* Tab Content Panels */}
        <div className="pt-2">
          {activeTab === "overview" && (
            <TripOverview
              trip={trip}
              sections={sections}
              onGoToItinerary={() => setActiveTab("itinerary")}
              onGoToBudget={() => setActiveTab("budget")}
              onAddStop={() => setActiveTab("itinerary")}
            />
          )}

          {activeTab === "itinerary" && (
            <ItineraryBuilder
              trip={trip}
              sections={sections}
              onAddSection={handleAddSection}
              onAddItem={handleAddItem}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarView trip={trip} sections={sections} />
          )}

          {activeTab === "budget" && (
            <BudgetView
              trip={trip}
              sections={sections}
              budgetSummary={budgetData}
              onNavigateTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
