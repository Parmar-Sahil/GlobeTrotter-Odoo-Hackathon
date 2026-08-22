"use client";

import React from "react";
import Link from "next/link";
import { Destination } from "@/types";
import { MapPin, Star, ArrowRight } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1507525428033-b723cf961d3e?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="group relative h-80 rounded-3xl overflow-hidden border border-orange-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 sm:p-6 bg-slate-950">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={destination.imageUrl || fallbackImage}
          alt={`${destination.name}, ${destination.country}`}
          className="w-full h-full object-cover opacity-85 group-hover:scale-106 group-hover:opacity-95 transition-all duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent group-hover:bg-slate-950/80 transition-colors duration-300" />
      </div>

      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
          {destination.region || "Featured"}
        </span>

        {(destination.rating || destination.popularity) && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md text-white border border-white/10">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {destination.rating
              ? destination.rating.toFixed(1)
              : ((destination.popularity || 90) / 20).toFixed(1)}
          </span>
        )}
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 space-y-2 text-white transform group-hover:-translate-y-1 transition-transform duration-300">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-extrabold uppercase tracking-tight text-white group-hover:text-orange-300 transition-colors">
              {destination.name}
            </h3>
            <span className="text-xs font-semibold text-slate-300">
              {destination.country}
            </span>
          </div>
          {destination.description && (
            <p className="text-xs text-slate-300 line-clamp-1 font-normal pt-0.5">
              {destination.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-white/15 flex items-center justify-between">
          <span className="text-[11px] font-bold text-orange-200">
            ₹₹ · Trending
          </span>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:text-orange-300 transition-colors"
          >
            Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
