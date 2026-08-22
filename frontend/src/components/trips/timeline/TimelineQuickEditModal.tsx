"use client";

import React, { useState } from "react";
import { ItineraryItem, ActivityCategory, ItinerarySection } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  Clock,
  DollarSign,
  Tag,
  MapPin,
  Calendar,
  Save,
  Trash2,
  Sparkles,
} from "lucide-react";

interface TimelineQuickEditModalProps {
  isOpen: boolean;
  item: ItineraryItem | null;
  currentSectionId: string;
  sections: ItinerarySection[];
  onClose: () => void;
  onSave: (
    itemId: string,
    updatedData: {
      title: string;
      description?: string;
      category?: ActivityCategory;
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      cost?: number;
      stopId?: string;
    }
  ) => Promise<void>;
  onDelete?: (itemId: string) => Promise<void>;
}

export function TimelineQuickEditModal({
  isOpen,
  item,
  currentSectionId,
  sections,
  onClose,
  onSave,
  onDelete,
}: TimelineQuickEditModalProps) {
  if (!isOpen || !item) return null;

  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || item.notes || "");
  const [category, setCategory] = useState<ActivityCategory>(
    (item.category as ActivityCategory) ||
      (item.activity?.category as ActivityCategory) ||
      "SIGHTSEEING"
  );
  const [startTime, setStartTime] = useState(item.startTime || "10:00");
  const [endTime, setEndTime] = useState(item.endTime || "12:00");
  const [durationMinutes, setDurationMinutes] = useState(
    item.durationMinutes || item.activity?.durationMinutes || 120
  );
  const [cost, setCost] = useState(item.cost ?? item.activity?.estimatedCost ?? 0);
  const [targetSectionId, setTargetSectionId] = useState(
    item.sectionId || currentSectionId
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(item.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        durationMinutes: Number(durationMinutes) || 60,
        cost: Number(cost) || 0,
        stopId: targetSectionId !== currentSectionId ? targetSectionId : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to remove this activity from the schedule?")) return;
    setIsDeleting(true);
    try {
      await onDelete(item.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-orange-100/70 flex items-center justify-between bg-[#FAF7F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#7C2D12] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#F95724]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Scheduled Activity
              </h3>
              <p className="text-xs text-slate-500">
                Adjust timing, cost, stop assignment, and activity notes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Guided Bamboo Grove Walk"
              className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
            />
          </div>

          {/* Section / Stop Assignment */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Destination Stop / Day Group
            </label>
            <select
              value={targetSectionId}
              onChange={(e) => setTargetSectionId(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium cursor-pointer"
            >
              {sections.map((sec, idx) => (
                <option key={sec.id || idx} value={sec.id}>
                  Stop {idx + 1}: {sec.title || sec.destination?.name || "Travel Stop"}
                  {sec.arrivalDate ? ` (${sec.arrivalDate})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Category & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer font-medium"
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
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Timing details */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add tips, meeting location, reservations, or notes..."
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-normal focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-[#7C2D12] hover:bg-[#9A3412] rounded-full shadow-xs transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
