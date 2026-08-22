"use client";

import React from "react";
import Link from "next/link";
import { Destination } from "@/types";
import { Star, MapPin, ArrowRight, DollarSign } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
  onSelect?: (dest: Destination) => void;
}

export function DestinationCard({ destination, onSelect }: DestinationCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.imageUrl || fallbackImage}
          alt={destination.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating Badge */}
        {destination.rating && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {destination.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Location info on bottom of image */}
        <div className="absolute bottom-3 left-3 text-white">
          <h4 className="text-base font-bold leading-snug drop-shadow-xs">
            {destination.name}
          </h4>
          <p className="text-xs text-slate-200 flex items-center gap-1 drop-shadow-xs">
            <MapPin className="w-3 h-3 text-blue-400" />
            {destination.country}
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center text-xs font-medium text-slate-500">
            <span className="text-blue-600 font-semibold">{destination.region}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/explore?destinationId=${destination.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Explore <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
