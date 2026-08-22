"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
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
  const [copied, setCopied] = useState(false);
  const [copyingTrip, setCopyingTrip] = useState(false);

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
    Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

  const routeSummary =
    sections.length > 0
      ? sections.map((s) => s.destination?.name || s.title).join(" → ")
      : "No stops assigned yet";

  const handleShare = () => {
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/shared/${trip.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTrip = () => {
    setCopyingTrip(true);
    setTimeout(() => {
      setCopyingTrip(false);
      alert("Trip copied to your account!");
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Primary Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-orange-100 shadow-xs">
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#7C2D12] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-orange-200 bg-[#FAF7F5] text-slate-700 hover:bg-orange-50 text-xs font-bold transition-all shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#F95724]" /> Share Trip
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyTrip}
            disabled={copyingTrip}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-orange-200 bg-[#FAF7F5] text-slate-700 hover:bg-orange-50 text-xs font-bold transition-all shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-amber-600" />
            {copyingTrip ? "Copying..." : "Copy Trip"}
          </button>

          <button
            type="button"
            onClick={onGoToItinerary}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103 active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Edit Itinerary
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-orange-100 p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Duration
          </span>
          <p className="text-2xl font-extrabold text-slate-900">
            {totalDays} {totalDays === 1 ? "Day" : "Days"}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-orange-100 p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Destinations
          </span>
          <p className="text-2xl font-extrabold text-[#7C2D12]">
            {sections.length} {sections.length === 1 ? "Stop" : "Stops"}
          </p>
          <span className="text-[11px] text-slate-400 font-medium truncate block">
            {routeSummary}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-orange-100 p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Activities
          </span>
          <p className="text-2xl font-extrabold text-[#F95724]">
            {totalActivities}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            Planned events
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-orange-100 p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Estimated Cost
          </span>
          <p className="text-2xl font-extrabold text-emerald-600">
            {formatCurrency(totalCost || trip.totalEstimatedCost || 0)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
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
          <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-orange-100/70 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Route & Stops
                </h3>
                <p className="text-xs text-slate-500">
                  Sequential destination stops in your travel schedule
                </p>
              </div>

              <button
                type="button"
                onClick={onAddStop}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 text-[#7C2D12] hover:bg-orange-100 text-xs font-bold transition-colors border border-orange-100"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                Add Stop
              </button>
            </div>

            {sections.length > 0 ? (
              <div className="space-y-4">
                {sections.map((section, idx) => (
                  <div
                    key={section.id || idx}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-orange-100 bg-[#FAF7F5] hover:bg-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F95724] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {section.title || section.destination?.name || `Stop ${idx + 1}`}
                        </h4>
                        <span className="text-xs font-bold text-[#7C2D12]">
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
                <p className="text-xs text-slate-500 font-normal">
                  No destinations added yet. Start by adding your first travel stop.
                </p>
                <button
                  type="button"
                  onClick={onAddStop}
                  className="px-5 py-2.5 bg-[#7C2D12] text-white text-xs font-bold rounded-full hover:bg-[#9A3412]"
                >
                  Add First Stop
                </button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={onGoToItinerary}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412] transition-colors"
              >
                Manage in Itinerary Builder <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Summary & Checklist */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#2A0E06] to-[#4A1A0D] text-white rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl shadow-orange-950/10">
            <h3 className="text-base font-extrabold">Trip Planning Checklist</h3>
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
                className="w-full py-2.5 bg-[#F95724] hover:bg-[#EA580C] text-white rounded-full text-xs font-bold transition-all shadow-md"
              >
                Open Itinerary Builder
              </button>
              <button
                type="button"
                onClick={onGoToBudget}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold transition-colors"
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
