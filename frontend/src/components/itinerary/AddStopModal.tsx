"use client";

import React, { useState } from "react";
import { Destination } from "@/types";
import { useSearchDestinations } from "@/hooks/use-destinations";
import { X, MapPin, Search, Calendar, Plus } from "lucide-react";

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (data: {
    destinationId?: string;
    title: string;
    arrivalDate?: string;
    departureDate?: string;
  }) => Promise<void>;
  tripStartDate?: string;
  tripEndDate?: string;
}

export function AddStopModal({
  isOpen,
  onClose,
  onAddStop,
  tripStartDate,
  tripEndDate,
}: AddStopModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [arrivalDate, setArrivalDate] = useState(tripStartDate || "");
  const [departureDate, setDepartureDate] = useState(tripEndDate || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: destinationsData, isLoading } = useSearchDestinations({
    query: searchQuery || undefined,
    limit: 8,
  });

  const destinations = destinationsData?.destinations || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = selectedDestination ? selectedDestination.name : customTitle;
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddStop({
        destinationId: selectedDestination?.id,
        title,
        arrivalDate: arrivalDate || undefined,
        departureDate: departureDate || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-orange-100/70 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Add Destination Stop
            </h3>
            <p className="text-xs text-slate-500">
              Select a city or enter a custom location for your multi-city route
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

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex-1 space-y-5"
        >
          {/* City Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choose City / Destination
            </label>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedDestination(null);
                }}
                placeholder="Search cities (e.g. Kyoto, Goa, Paris)..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
              />
            </div>

            {/* Destination quick selection grid */}
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
              {destinations.map((dest) => {
                const isSelected = selectedDestination?.id === dest.id;
                return (
                  <div
                    key={dest.id}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setCustomTitle(dest.name);
                    }}
                    className={`cursor-pointer p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? "border-[#F95724] bg-orange-50/70 text-[#7C2D12] ring-1 ring-orange-500"
                        : "border-slate-200 hover:border-orange-200 bg-white"
                    }`}
                  >
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-8 h-8 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{dest.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {dest.country}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Or Custom Destination Name:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  setSelectedDestination(null);
                }}
                placeholder="e.g. Kyoto Old Quarter"
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Arrival Date
              </label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!selectedDestination && !customTitle.trim())}
              className="px-6 py-2 text-xs font-bold text-white bg-[#7C2D12] hover:bg-[#9A3412] rounded-full shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Adding Stop..." : "Add Stop to Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
