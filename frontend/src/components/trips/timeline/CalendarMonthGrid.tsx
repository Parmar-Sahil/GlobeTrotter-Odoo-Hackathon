"use client";

import React, { useState, useMemo } from "react";
import { Trip, ItinerarySection, ItineraryItem, ActivityCategory } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Sparkles,
  DollarSign,
  Tag,
} from "lucide-react";

interface CalendarMonthGridProps {
  trip: Trip;
  sections: ItinerarySection[];
  onQuickEditActivity: (item: ItineraryItem, sectionId: string) => void;
  onAddActivityToSection: (section: ItinerarySection) => void;
}

export function CalendarMonthGrid({
  trip,
  sections,
  onQuickEditActivity,
  onAddActivityToSection,
}: CalendarMonthGridProps) {
  const tripStartDate = useMemo(() => new Date(trip.startDate), [trip.startDate]);
  const tripEndDate = useMemo(() => new Date(trip.endDate), [trip.endDate]);

  // Current calendar month view state
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
    return !isNaN(tripStartDate.getTime()) ? new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), 1) : new Date();
  });

  // Selected date state (default to trip start date)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return trip.startDate ? trip.startDate.split("T")[0] : new Date().toISOString().split("T")[0];
  });

  // Category Colors
  const categoryColorMap: Record<string, { bg: string; text: string; dot: string }> = {
    SIGHTSEEING: { bg: "bg-orange-50", text: "text-[#7C2D12]", dot: "bg-[#F95724]" },
    FOOD_DRINK: { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-500" },
    CULTURE: { bg: "bg-purple-50", text: "text-purple-800", dot: "bg-purple-500" },
    ADVENTURE: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500" },
    RELAXATION: { bg: "bg-teal-50", text: "text-teal-800", dot: "bg-teal-500" },
    NIGHTLIFE: { bg: "bg-rose-50", text: "text-rose-800", dot: "bg-rose-500" },
    SHOPPING: { bg: "bg-indigo-50", text: "text-indigo-800", dot: "bg-indigo-500" },
    OTHER: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" },
  };

  // Map activities and stops by YYYY-MM-DD
  const dateMap = useMemo(() => {
    const map: Record<
      string,
      {
        sections: ItinerarySection[];
        items: Array<{ item: ItineraryItem; section: ItinerarySection }>;
        totalCost: number;
      }
    > = {};

    sections.forEach((sec) => {
      const secDateStr = sec.arrivalDate
        ? sec.arrivalDate.split("T")[0]
        : sec.date
        ? sec.date.split("T")[0]
        : trip.startDate.split("T")[0];

      if (!map[secDateStr]) {
        map[secDateStr] = { sections: [], items: [], totalCost: 0 };
      }
      map[secDateStr].sections.push(sec);

      (sec.items || []).forEach((item) => {
        map[secDateStr].items.push({ item, section: sec });
        map[secDateStr].totalCost += item.cost || 0;
      });
    });

    return map;
  }, [sections, trip.startDate]);

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const handleJumpToTrip = () => {
    if (!isNaN(tripStartDate.getTime())) {
      setCurrentMonthDate(
        new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), 1)
      );
      setSelectedDateStr(trip.startDate.split("T")[0]);
    }
  };

  // Generate Month Matrix
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Selected date data
  const selectedDateData = dateMap[selectedDateStr] || {
    sections: [],
    items: [],
    totalCost: 0,
  };

  // Active section for quick adding
  const activeSectionForSelectedDate =
    selectedDateData.sections[0] || sections[0] || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
      {/* Left: Interactive Month Calendar Grid */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-6">
        {/* Calendar Month Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-orange-100/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-50 text-[#7C2D12]">
              <CalendarIcon className="w-5 h-5 text-[#F95724]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{monthName}</h3>
              <p className="text-xs text-slate-500 font-normal">
                Trip Window: {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleJumpToTrip}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FAF7F5] border border-orange-200 text-[#7C2D12] hover:bg-orange-100/70 transition-colors"
            >
              Jump to Trip
            </button>
            <div className="flex items-center gap-1 border border-slate-200 rounded-full p-0.5 bg-[#FAF7F5]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Weekday Row */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          {weekDayLabels.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty prefix cells */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-20 sm:h-24 rounded-2xl bg-slate-50/40 border border-transparent"
            />
          ))}

          {/* Actual days of month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const formattedDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const cellDate = new Date(year, month, dayNum);

            const isTripDay =
              cellDate >=
                new Date(
                  tripStartDate.getFullYear(),
                  tripStartDate.getMonth(),
                  tripStartDate.getDate()
                ) &&
              cellDate <=
                new Date(
                  tripEndDate.getFullYear(),
                  tripEndDate.getMonth(),
                  tripEndDate.getDate()
                );

            const isSelected = selectedDateStr === formattedDateStr;
            const dayEvents = dateMap[formattedDateStr];
            const hasEvents = !!dayEvents && dayEvents.items.length > 0;
            const hasStop = !!dayEvents && dayEvents.sections.length > 0;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDateStr(formattedDateStr)}
                className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#F95724] bg-orange-50/70 ring-2 ring-[#F95724]/40 shadow-xs"
                    : isTripDay
                    ? "border-orange-200/90 bg-[#FAF7F5] hover:bg-orange-50/40"
                    : "border-slate-100 bg-white hover:bg-slate-50/70 text-slate-400"
                }`}
              >
                {/* Cell Top: Day number + Stop Pin badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-[#7C2D12] text-white"
                        : isTripDay
                        ? "text-[#7C2D12]"
                        : "text-slate-500"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasStop && (
                    <span
                      title={dayEvents.sections[0]?.title}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-orange-100 text-[#7C2D12] font-bold truncate max-w-[45px] hidden sm:block"
                    >
                      {dayEvents.sections[0]?.title || "Stop"}
                    </span>
                  )}
                </div>

                {/* Cell Center/Bottom: Activity Dots & Count */}
                <div className="space-y-1 overflow-hidden">
                  {hasEvents ? (
                    <div className="space-y-1">
                      {/* First activity snippet */}
                      <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-700 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            categoryColorMap[
                              dayEvents.items[0]?.item.category || "SIGHTSEEING"
                            ]?.dot || "bg-orange-500"
                          }`}
                        />
                        <span className="truncate">
                          {dayEvents.items[0]?.item.title}
                        </span>
                      </div>

                      {/* Dots row for remaining activities */}
                      <div className="flex items-center gap-1">
                        {dayEvents.items.slice(0, 4).map((entry, eIdx) => {
                          const cat = entry.item.category || "SIGHTSEEING";
                          const dotColor =
                            categoryColorMap[cat]?.dot || "bg-orange-500";
                          return (
                            <span
                              key={eIdx}
                              className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}
                            />
                          );
                        })}
                        {dayEvents.items.length > 4 && (
                          <span className="text-[9px] font-bold text-slate-500">
                            +{dayEvents.items.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : isTripDay ? (
                    <span className="text-[10px] text-slate-400 hidden sm:block italic">
                      Trip Day
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Selected Date Activity Inspector Drawer */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-orange-100 p-6 shadow-xs flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Header of Inspector */}
          <div className="border-b border-orange-100/70 pb-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Selected Day Inspector
            </span>
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#F95724]" />
              {formatDate(selectedDateStr)}
            </h4>
            {selectedDateData.sections[0] && (
              <div className="flex items-center gap-1 text-xs font-bold text-[#7C2D12]">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {selectedDateData.sections[0].title ||
                    selectedDateData.sections[0].destination?.name}
                </span>
                {selectedDateData.sections[0].destination?.country && (
                  <span className="text-slate-400 font-normal">
                    • {selectedDateData.sections[0].destination.country}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Daily Total Cost Pill */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F5] border border-orange-100">
            <span className="text-xs font-bold text-slate-600">
              Day Scheduled Spend
            </span>
            <span className="text-sm font-extrabold text-[#7C2D12]">
              {selectedDateData.totalCost > 0
                ? formatCurrency(selectedDateData.totalCost)
                : "Free / No cost"}
            </span>
          </div>

          {/* Activities List */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {selectedDateData.items.length > 0 ? (
              selectedDateData.items.map(({ item, section }) => {
                const cat = item.category || "SIGHTSEEING";
                const colorConfig =
                  categoryColorMap[cat] || categoryColorMap.SIGHTSEEING;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-orange-100 bg-white hover:border-[#F95724] transition-all space-y-2 shadow-2xs group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${colorConfig.dot}`}
                          />
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </h5>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 font-normal pl-3.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onQuickEditActivity(item, section.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-[#7C2D12] hover:bg-orange-50 transition-colors shrink-0"
                        title="Quick Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 pl-3.5">
                      <div className="flex items-center gap-2">
                        {item.startTime && (
                          <span className="flex items-center gap-1 font-bold text-slate-700">
                            <Clock className="w-3 h-3 text-[#F95724]" />
                            {item.startTime}
                          </span>
                        )}
                        {item.durationMinutes && (
                          <span>{item.durationMinutes}m</span>
                        )}
                      </div>

                      <span className="font-extrabold text-[#7C2D12]">
                        {item.cost && item.cost > 0
                          ? formatCurrency(item.cost)
                          : "Free"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-[#FAF7F5] rounded-2xl border border-dashed border-orange-200 space-y-2">
                <Sparkles className="w-6 h-6 text-orange-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No activities scheduled for this date.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Activity Button for this day */}
        {activeSectionForSelectedDate && (
          <button
            type="button"
            onClick={() => onAddActivityToSection(activeSectionForSelectedDate)}
            className="w-full py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-950/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Activity to this Day
          </button>
        )}
      </div>
    </div>
  );
}
