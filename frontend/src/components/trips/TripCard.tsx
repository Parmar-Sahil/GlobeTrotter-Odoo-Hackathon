"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trip } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  ArrowRight,
  Share2,
} from "lucide-react";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80";

  const statusColors = {
    PLANNING: "bg-orange-50 text-[#7C2D12] border-orange-200",
    ONGOING: "bg-emerald-50 text-emerald-800 border-emerald-200",
    COMPLETED: "bg-slate-100 text-slate-700 border-slate-200",
    CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
  };

  const statusLabel = {
    PLANNING: "Planning",
    ONGOING: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const destinationCount = trip.destinationCount ?? trip.sections?.length ?? 0;

  return (
    <div className="group relative bg-white rounded-3xl border border-orange-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Cover Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={trip.coverImage || fallbackImage}
          alt={trip.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${
              statusColors[trip.status] || statusColors.PLANNING
            }`}
          >
            {statusLabel[trip.status] || "Planning"}
          </span>
        </div>

        {/* Quick Menu */}
        <div className="absolute top-3.5 right-3.5">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
              aria-label="Trip options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-2xl shadow-xl border border-orange-100 py-1.5 z-30 text-xs font-bold">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-orange-50 hover:text-[#7C2D12]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-400" />
                    Edit Trip
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onDelete(trip.id);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Destination count badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white font-bold drop-shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#F95724]" />
          <span>
            {destinationCount} {destinationCount === 1 ? "Stop" : "Stops"}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link href={`/trips/${trip.id}`}>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors line-clamp-1">
              {trip.title}
            </h3>
          </Link>
          {trip.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {trip.description}
            </p>
          )}
        </div>

        {/* Dates and Meta */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#F95724] shrink-0" />
            <span>
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            {trip.budgetLimit ? (
              <span className="text-xs font-bold text-slate-700">
                Budget:{" "}
                <span className="text-[#7C2D12]">
                  {formatCurrency(trip.budgetLimit)}
                </span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">No budget set</span>
            )}

            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412] transition-colors group-hover:translate-x-0.5"
            >
              Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
