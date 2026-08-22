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
  Copy,
  Users,
  ArrowRight,
} from "lucide-react";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"cities" | "activities" | "discover">("cities");
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
  const [copiedTripId, setCopiedTripId] = useState<string | null>(null);

  const { data: tripsData } = useMyTrips();
  const trips = tripsData?.trips || [];
  const { addSection, addItem, createTrip } = useTripMutations();

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

  const fallbackDestinations: Destination[] = [
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
      id: "dest-amalfi",
      name: "Amalfi Coast",
      country: "Italy",
      region: "Europe",
      description: "Dramatic cliffside villages overlooking the azure Mediterranean sea.",
      imageUrl:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
      popularity: 99,
      rating: 4.9,
    },
  ];

  const destinations =
    destData?.destinations && destData.destinations.length > 0
      ? destData.destinations
      : fallbackDestinations;

  const activities = actData?.activities || [];

  const communityTrips = [
    {
      id: "comm-1",
      title: "Autumn Across Western Europe",
      creator: "@wanderer_aarav",
      duration: "10 Days",
      stops: "Paris → Lyon → Zurich → Milan",
      estimatedCost: "₹94,000",
      coverImage:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80",
      likes: 142,
    },
    {
      id: "comm-2",
      title: "Royal Forts & Sunsets Across Rajasthan",
      creator: "@diya_travels",
      duration: "6 Days",
      stops: "Jaipur → Jodhpur → Udaipur",
      estimatedCost: "₹38,000",
      coverImage:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
      likes: 98,
    },
    {
      id: "comm-3",
      title: "Zen Sanctuaries & Coastal Tea Trails",
      creator: "@kenji_explorer",
      duration: "8 Days",
      stops: "Tokyo → Hakone → Kyoto → Osaka",
      estimatedCost: "₹1,25,000",
      coverImage:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80",
      likes: 215,
    },
  ];

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
    } catch {
      alert("Could not add to trip. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleCopyCommunityTrip = async (commTrip: (typeof communityTrips)[0]) => {
    setCopiedTripId(commTrip.id);
    try {
      await createTrip({
        title: `${commTrip.title} (Copy)`,
        description: `Curated community route by ${commTrip.creator}. Stops: ${commTrip.stops}`,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        coverImage: commTrip.coverImage,
        visibility: "PRIVATE",
      });
      setTimeout(() => {
        setCopiedTripId(null);
        alert("Trip copied into your account! Find it in My Trips.");
      }, 800);
    } catch {
      setCopiedTripId(null);
      alert("Could not copy trip.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header Title */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#7C2D12] text-xs font-bold uppercase tracking-wider border border-orange-100">
            <Compass className="w-3.5 h-3.5 text-[#F95724]" /> Travel Discovery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Where do you want to go?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Search curated destination stops, discover local activities, and copy community itineraries into your planner.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-orange-200/80 pb-px">
          <button
            type="button"
            onClick={() => setActiveTab("cities")}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "cities"
                ? "border-[#7C2D12] text-[#7C2D12]"
                : "border-transparent text-slate-500 hover:text-[#7C2D12]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Destinations & Cities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activities")}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "activities"
                ? "border-[#7C2D12] text-[#7C2D12]"
                : "border-transparent text-slate-500 hover:text-[#7C2D12]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Activities & Tours
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("discover")}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "discover"
                ? "border-[#7C2D12] text-[#7C2D12]"
                : "border-transparent text-slate-500 hover:text-[#7C2D12]"
            }`}
          >
            <Users className="w-4 h-4" />
            Discover Community Trips
          </button>
        </div>

        {/* Search & Filter Bar */}
        {activeTab !== "discover" && (
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-orange-100 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "cities"
                    ? "Search cities (e.g. Kyoto, Goa, Paris, Amalfi)..."
                    : "Search activities (e.g. Catamaran, Tea Ceremony, Trek)..."
                }
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724] font-medium"
              />
            </div>

            {/* Region / Category Filters */}
            {activeTab === "cities" ? (
              <div className="flex items-center gap-2 overflow-x-auto">
                {["ALL", "Asia", "Europe", "Americas"].map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedRegion === reg
                        ? "bg-[#7C2D12] text-white"
                        : "bg-[#FAF7F5] text-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    {reg === "ALL" ? "All Regions" : reg}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto">
                {[
                  { label: "All Categories", value: "ALL" },
                  { label: "Sightseeing", value: "SIGHTSEEING" },
                  { label: "Food & Dining", value: "FOOD_DRINK" },
                  { label: "Culture", value: "CULTURE" },
                  { label: "Adventure", value: "ADVENTURE" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.value
                        ? "bg-[#7C2D12] text-white"
                        : "bg-[#FAF7F5] text-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Cities & Destinations */}
        {activeTab === "cities" && (
          <div>
            {destLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                        setSelectedItemForTrip({ type: "destination", item: dest })
                      }
                      className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold shadow-md backdrop-blur-md transition-all hover:scale-105"
                    >
                      + Add to Trip
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 space-y-2">
                <Compass className="w-8 h-8 text-orange-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">
                  No destinations found
                </h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your search term or region filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Activities & Tours */}
        {activeTab === "activities" && (
          <div>
            {actLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-44 bg-white rounded-3xl border border-orange-100 animate-pulse" />
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-5 rounded-3xl bg-white border border-orange-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#7C2D12] uppercase tracking-wider">
                          {act.category.replace("_", " ")}
                        </span>
                        <span className="text-xs font-extrabold text-[#7C2D12]">
                          {act.estimatedCost > 0
                            ? formatCurrency(act.estimatedCost)
                            : "Free"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {act.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 font-normal">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {act.durationMinutes} mins
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedItemForTrip({ type: "activity", item: act })
                        }
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        + Add to Trip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 space-y-2">
                <Sparkles className="w-8 h-8 text-orange-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">
                  No activities found
                </h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your search query or switching categories.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Discover Community Trips */}
        {activeTab === "discover" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityTrips.map((comm) => (
              <div
                key={comm.id}
                className="group rounded-3xl bg-white border border-orange-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={comm.coverImage}
                    alt={comm.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white">
                    {comm.duration}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Curated by <strong className="text-slate-700">{comm.creator}</strong>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors">
                      {comm.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {comm.stops}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#7C2D12]">
                      {comm.estimatedCost}
                    </span>

                    <button
                      type="button"
                      disabled={copiedTripId === comm.id}
                      onClick={() => handleCopyCommunityTrip(comm)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedTripId === comm.id ? "Copying..." : "Copy to Planner"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add to Trip Modal */}
        {selectedItemForTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-md p-6 space-y-5">
              <h3 className="text-base font-extrabold text-slate-900">
                Add to your travel itinerary
              </h3>
              <p className="text-xs text-slate-500">
                Select which upcoming itinerary to attach{" "}
                <strong className="text-slate-800">
                  {"name" in selectedItemForTrip.item
                    ? selectedItemForTrip.item.name
                    : selectedItemForTrip.item.title}
                </strong>
                :
              </p>

              {trips.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {trips.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTripId(t.id)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        selectedTripId === t.id
                          ? "border-[#F95724] bg-orange-50/70 font-bold text-[#7C2D12]"
                          : "border-slate-200 hover:border-orange-200"
                      }`}
                    >
                      <span>{t.title}</span>
                      {selectedTripId === t.id && (
                        <Check className="w-4 h-4 text-[#F95724]" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No active itineraries found. Create one in Trips first!
                </p>
              )}

              {addSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
                  ✓ Successfully added to trip!
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForTrip(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedTripId || isAdding}
                  onClick={handleConfirmAddToTrip}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#7C2D12] hover:bg-[#9A3412] rounded-full disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Confirm & Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
