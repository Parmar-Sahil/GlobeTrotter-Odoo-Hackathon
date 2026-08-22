"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar, ArrowRight, Compass, Sparkles, CheckCircle2 } from "lucide-react";

interface ContinuePlanningProps {
  trip: Trip;
}

export function ContinuePlanning({ trip }: ContinuePlanningProps) {
  const destinationCount = trip.destinationCount ?? trip.sections?.length ?? 1;
  const activityCount =
    trip.sections?.reduce((acc, sec) => acc + (sec.items?.length || 0), 0) ?? 0;

  const routeSummary =
    trip.sections && trip.sections.length > 0
      ? trip.sections.map((s) => s.destination?.name || s.title).join(" → ")
      : "Multi-City Route";

  // Calculate reliable progress metric if itinerary data exists
  // Having destinations + activities represents planning completeness
  const progressPercent = Math.min(
    100,
    Math.round(
      (Math.min(destinationCount, 3) / 3) * 50 +
        (Math.min(activityCount, 5) / 5) * 50
    )
  );

  const fallbackImage =
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80";

  const tripTitle = trip.title || (trip as any).name || "My Journey";
  const coverSrc = trip.coverImage || (trip as any).coverPhotoUrl || fallbackImage;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-orange-100 bg-white shadow-md shadow-orange-950/5 hover:shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Visual Media banner */}
        <div className="lg:col-span-5 relative min-h-[200px] lg:min-h-full overflow-hidden bg-slate-950">
          <img
            src={coverSrc}
            alt={tripTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/90 text-white backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-200" />
              Continue Your Journey
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs text-orange-200 font-medium">Draft Itinerary</p>
            <h4 className="text-lg font-extrabold truncate">{tripTitle}</h4>
          </div>
        </div>

        {/* Action & Metrics Body */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C2D12]">
                Unfinished Itinerary
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#F95724]" />
                <span>
                  {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {tripTitle}
              </h3>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#F95724]" />
                <span className="truncate">{routeSummary}</span>
              </div>
            </div>

            {/* Itinerary Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold pt-1">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F5] border border-orange-100">
                {destinationCount} {destinationCount === 1 ? "City" : "Cities"}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F5] border border-orange-100">
                {activityCount} {activityCount === 1 ? "Activity" : "Activities"}
              </span>
            </div>

            {/* Real Progress Indicator */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Itinerary Completeness</span>
                <span className="text-[#7C2D12]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F95724] to-[#7C2D12] rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-orange-100/70 flex items-center justify-end">
            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103 active:scale-98"
            >
              Continue Planning <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
