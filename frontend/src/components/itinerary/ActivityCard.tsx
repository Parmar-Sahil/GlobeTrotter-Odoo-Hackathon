"use client";

import React from "react";
import { ItineraryItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  DollarSign,
  Trash2,
  MapPin,
  Tag,
  Sparkles,
} from "lucide-react";

interface ActivityCardProps {
  item: ItineraryItem;
  onRemove?: (id: string) => void;
}

export function ActivityCard({ item, onRemove }: ActivityCardProps) {
  const formatDuration = (mins?: number) => {
    if (!mins) return null;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0 && remainingMins > 0) return `${hours}h ${remainingMins}m`;
    if (hours > 0) return `${hours} hr`;
    return `${remainingMins} min`;
  };

  const categoryColors: Record<string, string> = {
    SIGHTSEEING: "bg-blue-50 text-blue-700 border-blue-200",
    ADVENTURE: "bg-amber-50 text-amber-700 border-amber-200",
    FOOD_DRINK: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CULTURE: "bg-purple-50 text-purple-700 border-purple-200",
    RELAXATION: "bg-teal-50 text-teal-700 border-teal-200",
    NIGHTLIFE: "bg-rose-50 text-rose-700 border-rose-200",
    SHOPPING: "bg-indigo-50 text-indigo-700 border-indigo-200",
    OTHER: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const category = item.category || item.activity?.category || "SIGHTSEEING";
  const cost = item.cost ?? item.activity?.estimatedCost ?? 0;
  const duration = item.durationMinutes ?? item.activity?.durationMinutes;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Activity Icon / Thumbnail */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
          {item.activity?.imageUrl ? (
            <img
              src={item.activity.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {item.title}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                categoryColors[category] || categoryColors.OTHER
              }`}
            >
              {category.replace("_", " ")}
            </span>
          </div>

          {item.description && (
            <p className="text-xs text-slate-500 line-clamp-1">
              {item.description}
            </p>
          )}

          {/* Time & Duration Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
            {item.startTime && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Clock className="w-3 h-3 text-blue-500" />
                {item.startTime} {item.endTime ? `- ${item.endTime}` : ""}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <span>•</span> {formatDuration(duration)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cost & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-left sm:text-right">
          <span className="text-sm font-extrabold text-slate-900">
            {cost > 0 ? formatCurrency(cost) : "Free"}
          </span>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100"
            aria-label="Remove activity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
