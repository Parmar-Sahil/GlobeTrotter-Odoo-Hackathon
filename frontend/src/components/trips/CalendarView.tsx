"use client";

import React, { useState } from "react";
import { Trip, ItinerarySection, ItineraryItem } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from "lucide-react";

interface CalendarViewProps {
  trip: Trip;
  sections: ItinerarySection[];
}

export function CalendarView({ trip, sections }: CalendarViewProps) {
  // Aggregate all activities chronologically
  const allItemsWithSection = sections.flatMap((sec) =>
    (sec.items || []).map((item) => ({
      ...item,
      sectionTitle: sec.title || sec.destination?.name || "Trip Stop",
      sectionCountry: sec.destination?.country,
      date: sec.arrivalDate || sec.date || trip.startDate,
    }))
  );

  // Group activities by date / section
  const groupedByStop = sections.map((sec, idx) => {
    const stopCost =
      sec.items?.reduce((acc, item) => acc + (item.cost || 0), 0) || 0;

    return {
      id: sec.id || `stop-${idx}`,
      title: sec.title || sec.destination?.name || `Day Group ${idx + 1}`,
      country: sec.destination?.country,
      arrivalDate: sec.arrivalDate,
      departureDate: sec.departureDate,
      items: sec.items || [],
      totalCost: stopCost,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header info */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Trip Timeline & Daily Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Chronological overview of destinations and scheduled itinerary events
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
      </div>

      {/* Timeline Stream */}
      {groupedByStop.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 space-y-10 ml-3 sm:ml-4">
          {groupedByStop.map((stop, idx) => (
            <div key={stop.id} className="relative space-y-4">
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-blue-600 border-4 border-white text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                {idx + 1}
              </div>

              {/* Stop Title Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      {stop.title}
                    </h3>
                    {stop.country && (
                      <span className="text-xs text-slate-500">
                        • {stop.country}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {stop.arrivalDate ? formatDate(stop.arrivalDate) : "Flexible date"}
                    {stop.departureDate ? ` to ${formatDate(stop.departureDate)}` : ""}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Day Total
                  </span>
                  <span className="text-sm font-extrabold text-blue-600">
                    {formatCurrency(stop.totalCost)}
                  </span>
                </div>
              </div>

              {/* Activities in this day/stop */}
              {stop.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-4">
                  {stop.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-blue-400 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="text-xs font-extrabold text-slate-700 shrink-0">
                          {item.cost > 0 ? formatCurrency(item.cost) : "Free"}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        {item.startTime && (
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {item.startTime}
                          </span>
                        )}
                        {item.durationMinutes && (
                          <span>{item.durationMinutes} mins</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic pl-4">
                  No scheduled activities for this destination.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No stops or activities scheduled yet. Switch to Itinerary Builder to add stops.
        </div>
      )}
    </div>
  );
}
