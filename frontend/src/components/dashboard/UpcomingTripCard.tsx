"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight, Clock, Sparkles } from "lucide-react";

interface UpcomingTripCardProps {
  trip: Trip;
}

export function UpcomingTripCard({ trip }: UpcomingTripCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80";

  // Calculate days left until trip
  const today = new Date();
  const startDate = new Date(trip.startDate);
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const destinationCount = trip.destinationCount ?? trip.sections?.length ?? 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Banner Cover Image */}
        <div className="relative lg:col-span-5 h-56 lg:h-auto min-h-[220px] overflow-hidden bg-slate-100">
          <img
            src={trip.coverImage || fallbackImage}
            alt={trip.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 lg:hidden" />

          {/* Countdown badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-blue-800 backdrop-blur-md shadow-xs">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {diffDays > 0
                ? `In ${diffDays} days`
                : diffDays === 0
                ? "Starting Today!"
                : "Ongoing Trip"}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Sparkles className="w-3.5 h-3.5" /> Next Adventure
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {trip.title}
            </h2>
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {trip.description ||
                "Your upcoming multi-city itinerary is prepared. Review your schedule, activities, and budget."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Dates</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Stops Planned</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {destinationCount} {destinationCount === 1 ? "Destination" : "Destinations"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs shadow-blue-500/20 transition-all hover:translate-x-0.5"
            >
              Open Trip Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/trips"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              View all trips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
