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
  CheckCircle2,
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
  sections: initialSections,
  onAddSection,
  onAddItem,
  onRemoveItem,
}: ItineraryBuilderProps) {
  const [localSections, setLocalSections] = useState<ItinerarySection[]>(initialSections);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [activeSectionForActivity, setActiveSectionForActivity] =
    useState<ItinerarySection | null>(null);

  // Sync if prop updates
  React.useEffect(() => {
    setLocalSections(initialSections);
  }, [initialSections]);

  const totalCost = localSections.reduce((acc, sec) => {
    return (
      acc +
      (sec.items?.reduce((itemAcc, item) => itemAcc + (item.cost || 0), 0) || 0)
    );
  }, 0);

  const budgetLimit = trip.budgetLimit || 0;
  const remainingBudget = Math.max(0, budgetLimit - totalCost);

  // Move Stop Up / Down
  const handleMoveStop = (index: number, direction: "up" | "down") => {
    const newSections = [...localSections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setLocalSections(newSections);
  };

  // Move Activity Up / Down within a section
  const handleMoveActivity = (
    sectionId: string,
    itemId: string,
    direction: "up" | "down"
  ) => {
    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId || !sec.items) return sec;
        const items = [...sec.items];
        const idx = items.findIndex((i) => i.id === itemId);
        if (idx === -1) return sec;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= items.length) return sec;

        const temp = items[idx];
        items[idx] = items[targetIdx];
        items[targetIdx] = temp;
        return { ...sec, items };
      })
    );
  };

  const handleRemoveActivity = async (sectionId: string, itemId: string) => {
    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId || !sec.items) return sec;
        return {
          ...sec,
          items: sec.items.filter((i) => i.id !== itemId),
        };
      })
    );
    if (onRemoveItem) {
      await onRemoveItem(sectionId, itemId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Itinerary Toolbar & Compact Budget Summary */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-orange-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F95724]" />
              Itinerary Schedule ({localSections.length}{" "}
              {localSections.length === 1 ? "Stop" : "Stops"})
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Add destinations, sequence your daily travel stops, and schedule activities
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddStopOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Travel Stop
          </button>
        </div>

        {/* Compact Budget Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-orange-100/70 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-orange-100 space-y-0.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              Target Budget
            </span>
            <p className="text-base font-extrabold text-slate-900">
              {budgetLimit > 0 ? formatCurrency(budgetLimit) : "Flexible"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-orange-100 space-y-0.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              Estimated Expenses
            </span>
            <p className="text-base font-extrabold text-[#7C2D12]">
              {formatCurrency(totalCost)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-orange-100 space-y-0.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              Remaining Buffer
            </span>
            <p className="text-base font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {budgetLimit > 0 ? formatCurrency(remainingBudget) : "In Safe Range"}
            </p>
          </div>
        </div>
      </div>

      {/* Sections / Stops List */}
      {localSections.length > 0 ? (
        <div className="space-y-6">
          {localSections.map((section, idx) => {
            const sectionCost =
              section.items?.reduce(
                (acc, item) => acc + (item.cost || 0),
                0
              ) || 0;

            const isFirstStop = idx === 0;
            const isLastStop = idx === localSections.length - 1;

            return (
              <div
                key={section.id || idx}
                className="bg-white rounded-3xl border border-orange-100 shadow-xs overflow-hidden transition-all"
              >
                {/* City / Stop Header */}
                <div className="bg-gradient-to-r from-[#2A0E06] via-[#3B150A] to-[#5C2314] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {/* Stop Reordering controls */}
                    <div className="flex flex-col items-center gap-0.5 mr-1">
                      <button
                        type="button"
                        disabled={isFirstStop}
                        onClick={() => handleMoveStop(idx, "up")}
                        className="p-1 rounded-md text-orange-200 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
                        aria-label="Move stop up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLastStop}
                        onClick={() => handleMoveStop(idx, "down")}
                        className="p-1 rounded-md text-orange-200 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
                        aria-label="Move stop down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-[#F95724] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-orange-600/30">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-white">
                          {section.title || section.destination?.name || `Stop ${idx + 1}`}
                        </h3>
                        {section.destination?.country && (
                          <span className="text-xs font-semibold text-orange-300">
                            • {section.destination.country}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#F95724]" />
                          {section.arrivalDate
                            ? `${formatDate(section.arrivalDate)}`
                            : "Flexible date"}
                          {section.departureDate
                            ? ` — ${formatDate(section.departureDate)}`
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F95724] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      Add Activity
                    </button>
                  </div>
                </div>

                {/* Activities Body */}
                <div className="p-5 sm:p-6 space-y-4 bg-[#FAF7F5]/60">
                  {section.items && section.items.length > 0 ? (
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <ActivityCard
                          key={item.id || itemIdx}
                          item={item}
                          isFirst={itemIdx === 0}
                          isLast={itemIdx === (section.items?.length || 0) - 1}
                          onMoveUp={() =>
                            handleMoveActivity(section.id, item.id, "up")
                          }
                          onMoveDown={() =>
                            handleMoveActivity(section.id, item.id, "down")
                          }
                          onRemove={(itemId) =>
                            handleRemoveActivity(section.id, itemId)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-3xl border border-dashed border-orange-200 space-y-2">
                      <Sparkles className="w-6 h-6 text-orange-300 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">
                        No activities scheduled for this stop yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveSectionForActivity(section)}
                        className="text-xs font-bold text-[#7C2D12] hover:underline"
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
        <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-3xl bg-orange-50 text-[#F95724] flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              Your journey is empty.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Add your first destination stop (e.g. Tokyo, Kyoto, Goa) to start scheduling days and activities.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddStopOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20"
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
