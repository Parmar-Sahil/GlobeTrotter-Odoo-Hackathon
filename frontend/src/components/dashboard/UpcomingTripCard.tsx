"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  DollarSign,
  Sparkles,
} from "lucide-react";

interface UpcomingTripCardProps {
  trip: Trip;
}

export function UpcomingTripCard({ trip }: UpcomingTripCardProps) {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  const formattedDates = `${startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} — ${endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  const durationDays =
    Math.max(
      1,
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );

  const routeSummary =
    trip.sections && trip.sections.length > 0
      ? trip.sections.map((s) => s.destination?.name || s.title).join(" → ")
      : "Multi-Stop Route";

  const totalDestinations = trip.sections?.length || 1;

  const fallbackImage =
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80";

  const tripTitle = trip.title || (trip as any).name || "My Journey";
  const coverSrc = trip.coverImage || (trip as any).coverPhotoUrl || fallbackImage;

  return (
    <div className="relative bg-white rounded-3xl border border-orange-100 shadow-md shadow-orange-950/5 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* Cover Image */}
        <div className="md:col-span-5 relative min-h-[220px] md:min-h-full overflow-hidden bg-slate-900">
          <img
            src={coverSrc}
            alt={tripTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F95724] text-white shadow-md">
              Featured Next Trip
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#F95724]" />
                {formattedDates}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7C2D12]" />
                {durationDays} Days · {totalDestinations} {totalDestinations === 1 ? "City" : "Cities"}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors leading-tight">
              {tripTitle}
            </h3>

            {/* Route */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-orange-100 text-xs font-bold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-[#F95724] shrink-0" />
              <span className="truncate">{routeSummary}</span>
            </div>

            {trip.description && (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-orange-100/70 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Estimated Budget</span>
              <p className="text-sm font-extrabold text-[#7C2D12]">
                {trip.currency || "₹"}{" "}
                {(trip.totalEstimatedCost || trip.budgetLimit || 0).toLocaleString()}
              </p>
            </div>

            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103"
            >
              View Trip <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
