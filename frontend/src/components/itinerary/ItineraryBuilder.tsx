"use client";

import React, { useState } from "react";
import { Trip, ItinerarySection, ItineraryItem, ActivityCategory } from "@/types";
import { ActivityCard } from "./ActivityCard";
import { AddActivityModal } from "./AddActivityModal";
import { AddStopModal } from "./AddStopModal";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Plus,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
} from "lucide-react";

interface ItineraryBuilderProps {
  trip: Trip;
  sections: ItinerarySection[];
  onAddSection: (data: {
    destinationId?: string;
    title: string;
    arrivalDate?: string;
    departureDate?: string;
  }) => Promise<void>;
  onAddItem: (
    sectionId: string,
    data: {
      activityId?: string;
      title: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      cost?: number;
      category?: ActivityCategory;
    }
  ) => Promise<void>;
  onRemoveItem?: (sectionId: string, itemId: string) => Promise<void>;
}

export function ItineraryBuilder({
  trip,
  sections,
  onAddSection,
  onAddItem,
  onRemoveItem,
}: ItineraryBuilderProps) {
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [activeSectionForActivity, setActiveSectionForActivity] =
    useState<ItinerarySection | null>(null);

  // Local activity removal simulation or mutation wrapper
  const handleRemoveActivity = async (sectionId: string, itemId: string) => {
    if (onRemoveItem) {
      await onRemoveItem(sectionId, itemId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Itinerary Schedule ({sections.length} {sections.length === 1 ? "Stop" : "Stops"})
          </h2>
          <p className="text-xs text-slate-500">
            Add destinations, organize daily activities, and estimate expenses
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddStopOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Travel Stop
        </button>
      </div>

      {/* Sections / Stops List */}
      {sections.length > 0 ? (
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const sectionCost =
              section.items?.reduce(
                (acc, item) => acc + (item.cost || 0),
                0
              ) || 0;

            return (
              <div
                key={section.id || idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* City / Stop Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-blue-600/30">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-white">
                          {section.title || section.destination?.name || `Stop ${idx + 1}`}
                        </h3>
                        {section.destination?.country && (
                          <span className="text-xs font-semibold text-blue-300">
                            • {section.destination.country}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {section.arrivalDate
                            ? `${formatDate(section.arrivalDate)}`
                            : "Flexible date"}
                          {section.departureDate
                            ? ` - ${formatDate(section.departureDate)}`
                            : ""}
                        </span>
                        <span>•</span>
                        <span>
                          {section.items?.length || 0}{" "}
                          {section.items?.length === 1 ? "Activity" : "Activities"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stop total cost & Add Activity Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Stop Total
                      </span>
                      <span className="text-sm font-extrabold text-white">
                        {formatCurrency(sectionCost)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveSectionForActivity(section)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      Add Activity
                    </button>
                  </div>
                </div>

                {/* Activities Body */}
                <div className="p-5 sm:p-6 space-y-4 bg-slate-50/50">
                  {section.items && section.items.length > 0 ? (
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <ActivityCard
                          key={item.id}
                          item={item}
                          onRemove={(itemId) =>
                            handleRemoveActivity(section.id, itemId)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
                      <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">
                        No activities scheduled for this stop yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveSectionForActivity(section)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        + Add first activity or tour
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Your Itinerary is Empty
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add your first destination stop (e.g. Paris, Tokyo, Rome) to start scheduling days and activities.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddStopOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add First Stop
          </button>
        </div>
      )}

      {/* Modals */}
      <AddStopModal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        onAddStop={onAddSection}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
      />

      {activeSectionForActivity && (
        <AddActivityModal
          isOpen={!!activeSectionForActivity}
          onClose={() => setActiveSectionForActivity(null)}
          onAddActivity={(data) =>
            onAddItem(activeSectionForActivity.id, data)
          }
          destinationId={activeSectionForActivity.destinationId}
          stopTitle={activeSectionForActivity.title}
        />
      )}
    </div>
  );
}
