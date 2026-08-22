"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTrip, useTripMutations } from "@/hooks/use-trips";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ActivityCard } from "@/components/itinerary/ActivityCard";
import {
  Calendar,
  MapPin,
  Copy,
  Check,
  Compass,
  Sparkles,
  ArrowRight,
  Globe,
  DollarSign,
} from "lucide-react";

interface SharedTripPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function SharedTripPage({ params }: SharedTripPageProps) {
  const { token } = use(params);
  const router = useRouter();
  const { data: trip, isLoading, isError } = useTrip(token);
  const { createTrip } = useTripMutations();
  const [isCopying, setIsCopying] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80";

  const handleCopyTrip = async () => {
    if (!trip) return;
    setIsCopying(true);
    try {
      const cloned = await createTrip({
        title: `${trip.title} (Copy)`,
        description: trip.description || undefined,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budgetLimit: trip.budgetLimit || undefined,
        coverImage: trip.coverImage || undefined,
      });

      setCopiedSuccess(true);
      setTimeout(() => {
        router.push(`/trips/${cloned.id}`);
      }, 1000);
    } finally {
      setIsCopying(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
        </div>
      </AppLayout>
    );
  }

  if (isError || !trip) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            Shared Itinerary Not Found
          </h2>
          <p className="text-xs text-slate-500">
            This shared itinerary link may be invalid or expired.
          </p>
        </div>
      </AppLayout>
    );
  }

  const sections = trip.sections || [];
  const totalCost = sections.reduce(
    (acc, sec) =>
      acc +
      (sec.items?.reduce((itemAcc, item) => itemAcc + (item.cost || 0), 0) || 0),
    0
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-white p-6 sm:p-10 space-y-6">
          <div className="absolute inset-0 h-full w-full">
            <img
              src={trip.coverImage || fallbackImage}
              alt={trip.title}
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-300 border border-white/10">
                <Globe className="w-3.5 h-3.5" /> Shared Public Itinerary
              </span>

              <button
                type="button"
                onClick={handleCopyTrip}
                disabled={isCopying || copiedSuccess}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-100 disabled:opacity-50"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Copied to My Trips!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {isCopying ? "Copying..." : "Copy This Trip"}
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {trip.title}
              </h1>
              {trip.description && (
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {trip.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/15 text-xs text-slate-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <Calendar className="w-4 h-4 text-blue-400" />
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {sections.length} {sections.length === 1 ? "Stop" : "Stops"}
              </span>
              {totalCost > 0 && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  Estimated: {formatCurrency(totalCost)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Stream */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Itinerary Highlights & Schedule
          </h2>

          {sections.length > 0 ? (
            <div className="space-y-6">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {sec.title || sec.destination?.name || `Stop ${idx + 1}`}
                        </h3>
                        {sec.destination && (
                          <p className="text-xs text-slate-500">
                            {sec.destination.name}, {sec.destination.country}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {sec.items?.length || 0} activities
                    </span>
                  </div>

                  {sec.items && sec.items.length > 0 ? (
                    <div className="space-y-3">
                      {sec.items.map((item) => (
                        <ActivityCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No activities listed for this stop.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500 text-xs">
              No itinerary stops have been configured for this trip.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
