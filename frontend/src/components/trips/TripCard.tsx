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
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80";

  const statusColors = {
    PLANNING: "bg-blue-50 text-blue-700 border-blue-200",
    ONGOING: "bg-emerald-50 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-slate-100 text-slate-700 border-slate-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const statusLabel = {
    PLANNING: "Planning",
    ONGOING: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const destinationCount = trip.destinationCount ?? trip.sections?.length ?? 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Cover Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={trip.coverImage || fallbackImage}
          alt={trip.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${
              statusColors[trip.status] || statusColors.PLANNING
            }`}
          >
            {statusLabel[trip.status] || "Planning"}
          </span>
        </div>

        {/* Quick Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
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
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-xs">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
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
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-left"
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

        {/* Destination count badge on bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {destinationCount} {destinationCount === 1 ? "Stop" : "Stops"}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link href={`/trips/${trip.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {trip.title}
            </h3>
          </Link>
          {trip.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>

        {/* Dates and Meta */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            {trip.budgetLimit ? (
              <span className="text-xs font-semibold text-slate-700">
                Budget: <span className="text-blue-600">{formatCurrency(trip.budgetLimit)}</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">No budget set</span>
            )}

            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-0.5"
            >
              Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
