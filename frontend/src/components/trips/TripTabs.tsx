"use client";

import React from "react";
import {
  FileText,
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
} from "lucide-react";

export type TripTabType = "overview" | "itinerary" | "calendar" | "budget";

interface TripTabsProps {
  activeTab: TripTabType;
  onTabChange: (tab: TripTabType) => void;
  sectionsCount?: number;
}

export function TripTabs({
  activeTab,
  onTabChange,
  sectionsCount = 0,
}: TripTabsProps) {
  const tabs = [
    { id: "overview" as TripTabType, label: "Trip Details", icon: FileText },
    {
      id: "itinerary" as TripTabType,
      label: "Itinerary Builder",
      icon: MapPin,
      badge: sectionsCount > 0 ? sectionsCount : undefined,
    },
    { id: "calendar" as TripTabType, label: "Timeline & Calendar", icon: CalendarIcon },
    { id: "budget" as TripTabType, label: "Budget & Costs", icon: DollarSign },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-orange-200/80 overflow-x-auto scrollbar-none pb-px">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              isActive
                ? "border-[#7C2D12] text-[#7C2D12]"
                : "border-transparent text-slate-500 hover:text-[#7C2D12] hover:border-orange-200"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? "text-[#F95724]" : "text-slate-400"
              }`}
            />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive
                    ? "bg-[#F95724] text-white"
                    : "bg-orange-100 text-slate-700"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
