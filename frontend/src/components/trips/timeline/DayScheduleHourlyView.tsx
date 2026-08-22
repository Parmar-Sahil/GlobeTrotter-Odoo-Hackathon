"use client";

import React, { useState, useMemo } from "react";
import { Trip, ItinerarySection, ItineraryItem, ActivityCategory } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from "lucide-react";

interface DayScheduleHourlyViewProps {
  trip: Trip;
  sections: ItinerarySection[];
  onQuickEditActivity: (item: ItineraryItem, sectionId: string) => void;
  onAddActivityToSection: (section: ItinerarySection, presetStartTime?: string) => void;
  onDeleteActivity?: (itemId: string) => void;
}

export function DayScheduleHourlyView({
  trip,
  sections,
  onQuickEditActivity,
  onAddActivityToSection,
  onDeleteActivity,
}: DayScheduleHourlyViewProps) {
  // Selected Section / Stop index
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);

  const currentSection = sections[selectedSectionIdx] || sections[0] || null;

  // Category Color Map
  const categoryStyles: Record<
    string,
    { bg: string; border: string; text: string; badgeBg: string }
  > = {
    SIGHTSEEING: {
      bg: "bg-orange-50/80",
      border: "border-orange-200",
      text: "text-[#7C2D12]",
      badgeBg: "bg-orange-100",
    },
    FOOD_DRINK: {
      bg: "bg-emerald-50/80",
      border: "border-emerald-200",
      text: "text-emerald-800",
      badgeBg: "bg-emerald-100",
    },
    CULTURE: {
      bg: "bg-purple-50/80",
      border: "border-purple-200",
      text: "text-purple-800",
      badgeBg: "bg-purple-100",
    },
    ADVENTURE: {
      bg: "bg-amber-50/80",
      border: "border-amber-200",
      text: "text-amber-800",
      badgeBg: "bg-amber-100",
    },
    RELAXATION: {
      bg: "bg-teal-50/80",
      border: "border-teal-200",
      text: "text-teal-800",
      badgeBg: "bg-teal-100",
    },
    NIGHTLIFE: {
      bg: "bg-rose-50/80",
      border: "border-rose-200",
      text: "text-rose-800",
      badgeBg: "bg-rose-100",
    },
    SHOPPING: {
      bg: "bg-indigo-50/80",
      border: "border-indigo-200",
      text: "text-indigo-800",
      badgeBg: "bg-indigo-100",
    },
    OTHER: {
      bg: "bg-slate-50/80",
      border: "border-slate-200",
      text: "text-slate-800",
      badgeBg: "bg-slate-100",
    },
  };

  // Convert "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr?: string | null) => {
    if (!timeStr || !timeStr.includes(":")) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  // Calculate items with conflict detection
  const itemsWithConflict = useMemo(() => {
    if (!currentSection?.items) return [];

    const sorted = [...currentSection.items].sort((a, b) => {
      const minA = timeToMinutes(a.startTime) ?? 9999;
      const minB = timeToMinutes(b.startTime) ?? 9999;
      return minA - minB;
    });

    return sorted.map((item, idx) => {
      const startMin = timeToMinutes(item.startTime);
      const duration = item.durationMinutes || 60;
      const endMin = timeToMinutes(item.endTime) ?? (startMin !== null ? startMin + duration : null);

      let hasConflict = false;

      if (startMin !== null && endMin !== null) {
        sorted.forEach((other, oIdx) => {
          if (idx === oIdx) return;
          const otherStart = timeToMinutes(other.startTime);
          const otherDuration = other.durationMinutes || 60;
          const otherEnd =
            timeToMinutes(other.endTime) ??
            (otherStart !== null ? otherStart + otherDuration : null);

          if (otherStart !== null && otherEnd !== null) {
            // Overlap condition: startA < endB && endA > startB
            if (startMin < otherEnd && endMin > otherStart) {
              hasConflict = true;
            }
          }
        });
      }

      return {
        ...item,
        startMin,
        endMin,
        hasConflict,
      };
    });
  }, [currentSection]);

  const conflictsCount = itemsWithConflict.filter((i) => i.hasConflict).length;

  // Hourly slots from 07:00 to 22:00
  const hours = [
    { label: "07:00 AM", time: "07:00", icon: Sunrise },
    { label: "08:00 AM", time: "08:00", icon: Sunrise },
    { label: "09:00 AM", time: "09:00", icon: Sun },
    { label: "10:00 AM", time: "10:00", icon: Sun },
    { label: "11:00 AM", time: "11:00", icon: Sun },
    { label: "12:00 PM", time: "12:00", icon: Sun },
    { label: "01:00 PM", time: "13:00", icon: Sun },
    { label: "02:00 PM", time: "14:00", icon: Sun },
    { label: "03:00 PM", time: "15:00", icon: Sun },
    { label: "04:00 PM", time: "16:00", icon: Sunset },
    { label: "05:00 PM", time: "17:00", icon: Sunset },
    { label: "06:00 PM", time: "18:00", icon: Sunset },
    { label: "07:00 PM", time: "19:00", icon: Moon },
    { label: "08:00 PM", time: "20:00", icon: Moon },
    { label: "09:00 PM", time: "21:00", icon: Moon },
    { label: "10:00 PM", time: "22:00", icon: Moon },
  ];

  if (!currentSection) {
    return (
      <div className="bg-white rounded-3xl border border-orange-100 p-12 text-center text-slate-500">
        No travel stops available to display hourly schedule.
      </div>
    );
  }

  const sectionTotalCost =
    currentSection.items?.reduce((acc, item) => acc + (item.cost || 0), 0) || 0;

  return (
    <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
      {/* Top Stop / Day Selector Carousel Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-[#F95724] text-white flex items-center justify-center font-extrabold text-xs">
              {selectedSectionIdx + 1}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              {currentSection.title || currentSection.destination?.name || `Stop ${selectedSectionIdx + 1}`}
            </h3>
            {currentSection.destination?.country && (
              <span className="text-xs text-slate-500 font-semibold">
                • {currentSection.destination.country}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {currentSection.arrivalDate ? formatDate(currentSection.arrivalDate) : "Flexible date"}
            {currentSection.departureDate ? ` – ${formatDate(currentSection.departureDate)}` : ""}
            {" • "}
            <strong className="text-[#7C2D12]">
              {formatCurrency(sectionTotalCost)}
            </strong>{" "}
            total spend
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {sections.map((sec, idx) => (
            <button
              key={sec.id || idx}
              type="button"
              onClick={() => setSelectedSectionIdx(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedSectionIdx === idx
                  ? "bg-[#7C2D12] text-white shadow-xs"
                  : "bg-[#FAF7F5] text-slate-600 border border-orange-200/80 hover:bg-orange-50"
              }`}
            >
              Stop {idx + 1}: {sec.title || sec.destination?.name || `Stop ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Conflict Alert Banner if any time conflicts exist */}
      {conflictsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="font-semibold">
              Warning: {conflictsCount} activity schedule overlap(s) detected for this stop. Adjust start times or duration to fix.
            </p>
          </div>
        </div>
      )}

      {/* Hourly Schedule View Rail */}
      <div className="space-y-4 pt-2">
        {hours.map((hour) => {
          const hourMin = timeToMinutes(hour.time) || 0;
          const nextHourMin = hourMin + 60;

          // Find activities starting within this hour
          const matchedItems = itemsWithConflict.filter((item) => {
            if (item.startMin === null) return false;
            return item.startMin >= hourMin && item.startMin < nextHourMin;
          });

          const IconComponent = hour.icon;

          return (
            <div
              key={hour.time}
              className="flex items-start gap-3 sm:gap-6 group/hour"
            >
              {/* Hour Stamp Rail */}
              <div className="w-20 sm:w-24 shrink-0 text-right pt-2">
                <span className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1.5">
                  <IconComponent className="w-3.5 h-3.5 text-slate-300 group-hover/hour:text-[#F95724] transition-colors" />
                  {hour.label}
                </span>
              </div>

              {/* Time Slot Content Rail */}
              <div className="flex-1 min-w-0 border-t border-slate-100 pt-1.5 pb-3">
                {matchedItems.length > 0 ? (
                  <div className="space-y-2.5">
                    {matchedItems.map((item) => {
                      const cat = item.category || "SIGHTSEEING";
                      const style = categoryStyles[cat] || categoryStyles.OTHER;

                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-4 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            item.hasConflict
                              ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-300"
                              : `${style.bg} ${style.border}`
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-extrabold text-slate-900 truncate">
                                {item.title}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${style.badgeBg} ${style.text}`}
                              >
                                {cat.replace("_", " ")}
                              </span>

                              {item.hasConflict && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-bold">
                                  <AlertTriangle className="w-3 h-3" /> Overlap
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="text-xs text-slate-600 line-clamp-1">
                                {item.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1 font-bold text-slate-800">
                                <Clock className="w-3.5 h-3.5 text-[#F95724]" />
                                {item.startTime} {item.endTime ? `– ${item.endTime}` : ""}
                              </span>
                              {item.durationMinutes && (
                                <span>({item.durationMinutes} mins)</span>
                              )}
                            </div>
                          </div>

                          {/* Cost & Edit Trigger */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                            <span className="text-sm font-extrabold text-[#7C2D12]">
                              {item.cost && item.cost > 0
                                ? formatCurrency(item.cost)
                                : "Free"}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  onQuickEditActivity(item, currentSection.id)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#7C2D12] hover:bg-white transition-colors"
                                title="Quick Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {onDeleteActivity && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteActivity(item.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Activity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      onAddActivityToSection(currentSection, hour.time)
                    }
                    className="h-9 rounded-xl border border-dashed border-slate-200 hover:border-[#F95724] hover:bg-orange-50/30 flex items-center justify-between px-3 cursor-pointer transition-colors text-slate-400 hover:text-[#7C2D12] group/slot"
                  >
                    <span className="text-[11px] font-medium">Available slot</span>
                    <span className="text-[11px] font-bold opacity-0 group-hover/slot:opacity-100 flex items-center gap-1 transition-opacity">
                      <Plus className="w-3 h-3 stroke-[2.5]" /> Schedule at {hour.time}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
