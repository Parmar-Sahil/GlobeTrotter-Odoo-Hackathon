"use client";

import React from "react";
import { ItineraryItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  Trash2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

interface ActivityCardProps {
  item: ItineraryItem;
  onRemove?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
  hasConflict?: boolean;
}

export function ActivityCard({
  item,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  hasConflict,
}: ActivityCardProps) {
  const formatDuration = (mins?: number) => {
    if (!mins) return null;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0 && remainingMins > 0) return `${hours}h ${remainingMins}m`;
    if (hours > 0) return `${hours} hr`;
    return `${remainingMins} min`;
  };

  const categoryColors: Record<string, string> = {
    SIGHTSEEING: "bg-orange-50 text-[#7C2D12] border-orange-200",
    ADVENTURE: "bg-amber-50 text-amber-800 border-amber-200",
    FOOD_DRINK: "bg-emerald-50 text-emerald-800 border-emerald-200",
    CULTURE: "bg-purple-50 text-purple-800 border-purple-200",
    RELAXATION: "bg-teal-50 text-teal-800 border-teal-200",
    NIGHTLIFE: "bg-rose-50 text-rose-800 border-rose-200",
    SHOPPING: "bg-indigo-50 text-indigo-800 border-indigo-200",
    OTHER: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const category = item.category || item.activity?.category || "SIGHTSEEING";
  const cost = item.cost ?? item.activity?.estimatedCost ?? 0;
  const duration = item.durationMinutes ?? item.activity?.durationMinutes;

  return (
    <div className={`group bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
      hasConflict ? "border-amber-400 bg-amber-50/20" : "border-orange-100/90 hover:border-orange-200"
    }`}>
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Reorder Buttons */}
        {(onMoveUp || onMoveDown) && (
          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMoveUp?.(item.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-orange-50 disabled:opacity-20 transition-colors"
              aria-label="Move activity up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMoveDown?.(item.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-orange-50 disabled:opacity-20 transition-colors"
              aria-label="Move activity down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Activity Icon / Thumbnail */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
          {item.activity?.imageUrl ? (
            <img
              src={item.activity.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-50 text-[#F95724]">
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
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                categoryColors[category] || categoryColors.OTHER
              }`}
            >
              {category.replace("_", " ")}
            </span>

            {hasConflict && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" /> Time overlap
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-xs text-slate-500 line-clamp-1 font-normal">
              {item.description}
            </p>
          )}

          {/* Time & Duration Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
            {item.startTime && (
              <span className="flex items-center gap-1 text-slate-700 font-bold">
                <Clock className="w-3 h-3 text-[#F95724]" />
                {item.startTime} {item.endTime ? `— ${item.endTime}` : ""}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1 font-medium">
                <span>•</span> {formatDuration(duration)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cost & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-left sm:text-right">
          <span className="text-sm font-extrabold text-[#7C2D12]">
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
