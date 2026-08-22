"use client";

import React from "react";
import Link from "next/link";
import { Plus, Sparkles, Calendar, Compass } from "lucide-react";
import { User } from "@/types";

interface DashboardHeaderProps {
  user: User | null;
  tripCount?: number;
}

export function DashboardHeader({ user, tripCount = 0 }: DashboardHeaderProps) {
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const name = user?.firstName || user?.username || "Traveler";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A0E06] via-[#4A1A0D] to-[#7C2D12] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-orange-950/10">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-300 border border-white/10 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-[#F95724]" />
            <span>{currentDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {greeting}, <span className="text-[#F95724]">{name}</span>!
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
            {tripCount > 0
              ? `You have ${tripCount} travel ${tripCount === 1 ? "itinerary" : "itineraries"} in progress. Ready for your next adventure?`
              : "Ready for your next adventure? Start crafting your custom route, scheduling tours, and tracking your budget."}
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 backdrop-blur-md transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 text-orange-300" />
            Explore Places
          </Link>

          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F95724] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-600/30 transition-all hover:scale-103 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Plan a New Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
