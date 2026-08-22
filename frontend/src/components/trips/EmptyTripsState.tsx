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
  title = "No trips planned yet",
  description = "Your next great adventure starts here. Pick your dream destinations, organize daily stops, and track your travel costs effortlessly.",
  actionText = "Plan Your First Trip",
  actionHref = "/trips/new",
}: EmptyTripsStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={actionHref}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {actionText}
        </Link>
        <Link
          href="/explore"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Explore Inspiration
        </Link>
      </div>
    </div>
  );
}
