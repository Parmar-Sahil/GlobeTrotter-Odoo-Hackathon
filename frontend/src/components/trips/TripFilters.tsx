"use client";

import React from "react";
import { Search } from "lucide-react";

interface TripFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function TripFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: TripFiltersProps) {
  const tabs = [
    { label: "All Trips", value: "ALL" },
    { label: "Planning", value: "PLANNING" },
    { label: "Active", value: "ONGOING" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-orange-100 shadow-xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#7C2D12] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#7C2D12] hover:bg-orange-50/70"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative min-w-[260px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by trip title or destination..."
          className="w-full pl-9 pr-4 py-2 bg-[#FAF7F5] border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724] transition-all font-medium"
        />
      </div>
    </div>
  );
}
