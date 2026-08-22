"use client";

import React from "react";
import Link from "next/link";
import { Plus, Sparkles, MapPin, Calendar } from "lucide-react";
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

  const name = user?.firstName || user?.username || "Explorer";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
      {/* Subtle background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {greeting}, <span className="text-blue-400">{name}</span>! ✈️
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            {tripCount > 0
              ? `You have ${tripCount} travel ${tripCount === 1 ? "itinerary" : "itineraries"} planned. Ready for your next journey?`
              : "Start crafting your next unforgettable adventure across cities, activities, and budget goals."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 backdrop-blur-md transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Explore Places
          </Link>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-100"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Plan New Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
