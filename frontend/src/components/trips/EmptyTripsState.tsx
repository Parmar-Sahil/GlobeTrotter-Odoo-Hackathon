"use client";

import React from "react";
import Link from "next/link";
import { Compass, Plus, Sparkles } from "lucide-react";

interface EmptyTripsStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyTripsState({
  title = "No journeys planned yet.",
  description = "Your next adventure is waiting to be created. Start crafting your custom itinerary, schedule tours, and turn destinations into memories.",
  actionText = "Plan Your First Trip",
  actionHref = "/trips/new",
}: EmptyTripsStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#F95724] flex items-center justify-center mx-auto shadow-inner">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto font-normal">
          {description}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={actionHref}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {actionText}
        </Link>
        <Link
          href="/explore"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FAF7F5] hover:bg-orange-50 text-slate-700 text-xs sm:text-sm font-bold border border-orange-100 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#F95724]" />
          Explore Destinations
        </Link>
      </div>
    </div>
  );
}
