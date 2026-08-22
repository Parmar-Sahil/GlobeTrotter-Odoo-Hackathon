"use client";

import React, { useState } from "react";
import { Activity, ActivityCategory } from "@/types";
import { useSearchActivities } from "@/hooks/use-activities";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Plus,
  Search,
  Sparkles,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (data: {
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    cost?: number;
    activityId?: string;
    category?: ActivityCategory;
  }) => Promise<void>;
  destinationId?: string | null;
  stopTitle?: string;
}

export function AddActivityModal({
  isOpen,
  onClose,
  onAddActivity,
  destinationId,
  stopTitle,
}: AddActivityModalProps) {
  const [tab, setTab] = useState<"curated" | "custom">("curated");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Form State
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customStartTime, setCustomStartTime] = useState("10:00");
  const [customDuration, setCustomDuration] = useState(120);
  const [customCost, setCustomCost] = useState(0);
  const [customCategory, setCustomCategory] =
    useState<ActivityCategory>("SIGHTSEEING");

  const { data: activitiesData, isLoading: activitiesLoading } =
    useSearchActivities({
      query: searchQuery || undefined,
      destinationId: destinationId || undefined,
      limit: 10,
    });

  const curatedActivities = activitiesData?.activities || [];

  if (!isOpen) return null;

  const handleAddCurated = async (act: Activity) => {
    setIsSubmitting(true);
    try {
      await onAddActivity({
        title: act.title,
        description: act.description,
        cost: act.estimatedCost,
        durationMinutes: act.durationMinutes,
        activityId: act.id,
        category: act.category,
        startTime: "10:00",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddActivity({
        title: customTitle,
        description: customDescription,
        startTime: customStartTime,
        durationMinutes: Number(customDuration),
        cost: Number(customCost),
        category: customCategory,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-orange-100/70 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Add Activity to Itinerary
            </h3>
            <p className="text-xs text-slate-500">
              {stopTitle ? `Destination Stop: ${stopTitle}` : "Schedule an experience"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-3 flex gap-2 border-b border-orange-100/70 bg-[#FAF7F5]">
          <button
            type="button"
            onClick={() => setTab("curated")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              tab === "curated"
                ? "border-[#7C2D12] text-[#7C2D12]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Browse Suggested Activities
          </button>
          <button
            type="button"
            onClick={() => setTab("custom")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              tab === "custom"
                ? "border-[#7C2D12] text-[#7C2D12]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Custom Activity
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {tab === "curated" ? (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities by name or category..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                />
              </div>

              {activitiesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-slate-100 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : curatedActivities.length > 0 ? (
                <div className="space-y-3">
                  {curatedActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#F95724] hover:bg-orange-50/30 transition-all gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {act.imageUrl && (
                          <img
                            src={act.imageUrl}
                            alt={act.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {act.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 font-normal">
                            {act.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span>{act.durationMinutes} mins</span>
                            <span>•</span>
                            <span className="font-bold text-[#7C2D12]">
                              {act.estimatedCost > 0
                                ? formatCurrency(act.estimatedCost)
                                : "Free"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleAddCurated(act)}
                        className="px-3.5 py-1.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shrink-0 shadow-xs transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Sparkles className="w-8 h-8 text-orange-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    No curated activities found for this destination query.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("custom")}
                    className="text-xs font-bold text-[#7C2D12] hover:underline"
                  >
                    Create a custom activity instead
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Fushimi Inari Sunrise Walk & Tea"
                  className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Meeting point, ticket details, or highlights..."
                  className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) =>
                      setCustomCategory(e.target.value as ActivityCategory)
                    }
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="SIGHTSEEING">Sightseeing</option>
                    <option value="FOOD_DRINK">Food & Drink</option>
                    <option value="CULTURE">Culture</option>
                    <option value="ADVENTURE">Adventure</option>
                    <option value="RELAXATION">Relaxation</option>
                    <option value="NIGHTLIFE">Nightlife</option>
                    <option value="SHOPPING">Shopping</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={customCost}
                    onChange={(e) => setCustomCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !customTitle.trim()}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#7C2D12] hover:bg-[#9A3412] rounded-full shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add to Stop"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
