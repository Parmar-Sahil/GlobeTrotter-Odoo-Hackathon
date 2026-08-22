"use client";

import React from "react";
import { Trip, ItinerarySection } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Compass,
  ArrowRight,
  Plus,
} from "lucide-react";

interface TripOverviewProps {
  trip: Trip;
  sections: ItinerarySection[];
  onGoToItinerary: () => void;
  onGoToBudget: () => void;
  onAddStop: () => void;
}

export function TripOverview({
  trip,
  sections,
  onGoToItinerary,
  onGoToBudget,
  onAddStop,
}: TripOverviewProps) {
  const totalActivities = sections.reduce(
    (acc, sec) => acc + (sec.items?.length || 0),
    0
  );

  const totalCost = sections.reduce((acc, sec) => {
    return (
      acc +
      (sec.items?.reduce((itemAcc, item) => itemAcc + (item.cost || 0), 0) || 0)
    );
  }, 0);

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const totalDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) +
    1;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Duration
          </span>
          <p className="text-2xl font-extrabold text-slate-900">
            {totalDays} {totalDays === 1 ? "Day" : "Days"}
          </p>
          <span className="text-[11px] text-slate-400">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Destinations
          </span>
          <p className="text-2xl font-extrabold text-blue-600">
            {sections.length} {sections.length === 1 ? "Stop" : "Stops"}
          </p>
          <span className="text-[11px] text-slate-400">Multi-city itinerary</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Activities
          </span>
          <p className="text-2xl font-extrabold text-emerald-600">
            {totalActivities}
          </p>
          <span className="text-[11px] text-slate-400">Scheduled events</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Estimated Cost
          </span>
          <p className="text-2xl font-extrabold text-indigo-600">
            {formatCurrency(totalCost)}
          </p>
          <span className="text-[11px] text-slate-400">
            {trip.budgetLimit
              ? `Target: ${formatCurrency(trip.budgetLimit)}`
              : "No target set"}
          </span>
        </div>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Stops and Itinerary summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Route & Stops
                </h3>
                <p className="text-xs text-slate-500">
                  Sequential destinations in your travel schedule
                </p>
              </div>

              <button
                type="button"
                onClick={onAddStop}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Stop
              </button>
            </div>

            {sections.length > 0 ? (
              <div className="space-y-4">
                {sections.map((section, idx) => (
                  <div
                    key={section.id || idx}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {section.title || section.destination?.name || `Stop ${idx + 1}`}
                        </h4>
                        <span className="text-xs font-semibold text-slate-500">
                          {section.items?.length || 0} activities
                        </span>
                      </div>

                      {section.destination && (
                        <p className="text-xs text-slate-500">
                          {section.destination.name}, {section.destination.country}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        {section.arrivalDate && (
                          <span>Arrive: {formatDate(section.arrivalDate)}</span>
                        )}
                        {section.departureDate && (
                          <span>Depart: {formatDate(section.departureDate)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  No destinations added yet. Start by adding your first travel stop.
                </p>
                <button
                  type="button"
                  onClick={onAddStop}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700"
                >
                  Add First Stop
                </button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={onGoToItinerary}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Manage in Itinerary Builder <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Summary & Action Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 space-y-5 shadow-md">
            <h3 className="text-base font-bold">Quick Planning Checklist</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    sections.length > 0
                      ? "bg-emerald-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  ✓
                </div>
                <span>Assign travel destinations and stops</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    totalActivities > 0
                      ? "bg-emerald-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  ✓
                </div>
                <span>Add sightseeing & dining activities</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    trip.budgetLimit
                      ? "bg-emerald-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  ✓
                </div>
                <span>Set budget targets and track costs</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={onGoToItinerary}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Open Itinerary Builder
              </button>
              <button
                type="button"
                onClick={onGoToBudget}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                View Cost Breakdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
