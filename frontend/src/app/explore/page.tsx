"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DestinationCard } from "@/components/dashboard/DestinationCard";
import { DestinationCardSkeleton } from "@/components/ui/Skeleton";
import { useSearchDestinations } from "@/hooks/use-destinations";
import { useSearchActivities } from "@/hooks/use-activities";
import { useMyTrips, useTripMutations } from "@/hooks/use-trips";
import { Destination, Activity, ActivityCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Compass,
  Search,
  MapPin,
  Sparkles,
  Filter,
  Plus,
  Clock,
  Check,
  Globe,
  Tag,
  Star,
} from "lucide-react";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"cities" | "activities">("cities");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Add to Trip Modal State
  const [selectedItemForTrip, setSelectedItemForTrip] = useState<{
    type: "destination" | "activity";
    item: Destination | Activity;
  } | null>(null);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { data: tripsData } = useMyTrips();
  const trips = tripsData?.trips || [];
  const { addSection, addItem } = useTripMutations();

  // Queries
  const { data: destData, isLoading: destLoading } = useSearchDestinations({
    query: searchQuery || undefined,
    region: selectedRegion === "ALL" ? undefined : selectedRegion,
  });

  const { data: actData, isLoading: actLoading } = useSearchActivities({
    query: searchQuery || undefined,
    category:
      selectedCategory === "ALL"
        ? undefined
        : (selectedCategory as ActivityCategory),
  });

  const destinations = destData?.destinations || [];
  const activities = actData?.activities || [];

  const handleConfirmAddToTrip = async () => {
    if (!selectedItemForTrip || !selectedTripId) return;
    setIsAdding(true);
    try {
      if (selectedItemForTrip.type === "destination") {
        const dest = selectedItemForTrip.item as Destination;
        await addSection({
          id: selectedTripId,
          data: {
            destinationId: dest.id,
            title: dest.name,
          },
        });
      } else {
        const act = selectedItemForTrip.item as Activity;
        const targetTrip = trips.find((t) => t.id === selectedTripId);
        const sectionId = targetTrip?.sections?.[0]?.id;

        if (sectionId) {
          await addItem({
            sectionId,
            tripId: selectedTripId,
            data: {
              activityId: act.id,
              title: act.title,
              description: act.description,
              cost: act.estimatedCost,
              durationMinutes: act.durationMinutes,
              category: act.category,
            },
          });
        } else {
          // If no section exists yet, add section first
          const newSection = await addSection({
            id: selectedTripId,
            data: { title: "Day 1 Schedule" },
          });
          if (newSection?.id) {
            await addItem({
              sectionId: newSection.id,
              tripId: selectedTripId,
              data: {
                activityId: act.id,
                title: act.title,
                description: act.description,
                cost: act.estimatedCost,
                durationMinutes: act.durationMinutes,
                category: act.category,
              },
            });
          }
        }
      }

      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
        setSelectedItemForTrip(null);
      }, 1500);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
            <Compass className="w-3.5 h-3.5" /> Destination Directory
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Discover Cities & Curated Activities
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Explore world-renowned destinations, iconic sightseeing tours, culinary experiences, and add them directly to your travel plans.
          </p>
        </div>

        {/* Tab & Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("cities")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "cities"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                Explore Cities
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("activities")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "activities"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Explore Activities
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "cities"
                    ? "Search cities or countries..."
                    : "Search activities or tours..."
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Secondary Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
            {activeTab === "cities" ? (
              <>
                <span className="text-slate-400 font-medium shrink-0">Region:</span>
                {["ALL", "Europe", "Asia", "North America", "South America", "Africa"].map(
                  (reg) => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                        selectedRegion === reg
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {reg === "ALL" ? "All Regions" : reg}
                    </button>
                  )
                )}
              </>
            ) : (
              <>
                <span className="text-slate-400 font-medium shrink-0">Category:</span>
                {[
                  "ALL",
                  "SIGHTSEEING",
                  "FOOD_DRINK",
                  "CULTURE",
                  "ADVENTURE",
                  "RELAXATION",
                  "NIGHTLIFE",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "ALL" ? "All Categories" : cat.replace("_", " ")}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Content Display */}
        {activeTab === "cities" ? (
          destLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <div key={dest.id} className="relative group">
                  <DestinationCard destination={dest} />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedItemForTrip({
                        type: "destination",
                        item: dest,
                      })
                    }
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-md transition-all opacity-90 group-hover:opacity-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    Add to Trip
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Compass className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                No cities found matching your criteria.
              </p>
            </div>
          )
        ) : actLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-xs">
                      {act.estimatedCost > 0
                        ? formatCurrency(act.estimatedCost)
                        : "Free"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                      <Tag className="w-3 h-3" />
                      {act.category.replace("_", " ")}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {act.durationMinutes} mins
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedItemForTrip({
                          type: "activity",
                          item: act,
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              No activities found matching your criteria.
            </p>
          </div>
        )}

        {/* Add to Trip Modal */}
        {selectedItemForTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-150">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Add to Itinerary
                </h3>
                <p className="text-xs text-slate-500">
                  Select which trip you would like to attach &ldquo;
                  {selectedItemForTrip.type === "destination"
                    ? (selectedItemForTrip.item as Destination).name
                    : (selectedItemForTrip.item as Activity).title}
                  &rdquo; to:
                </p>
              </div>

              {trips.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {trips.map((t) => {
                    const isSelected = selectedTripId === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTripId(t.id)}
                        className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  You do not have any trips created yet. Please create a trip first.
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForTrip(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedTripId || isAdding || addSuccess}
                  onClick={handleConfirmAddToTrip}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors shadow-xs"
                >
                  {addSuccess
                    ? "Added!"
                    : isAdding
                    ? "Adding..."
                    : "Confirm & Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
