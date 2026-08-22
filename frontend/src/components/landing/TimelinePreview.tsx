"use client";

import React from "react";
import { FadeIn } from "../animation/FadeIn";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  Utensils,
  Sun,
  Moon,
  Compass,
} from "lucide-react";

export function TimelinePreview() {
  const timelineDays = [
    {
      date: "12 AUG",
      dayName: "Day 1 — Coastal Arrival & Heritage",
      events: [
        {
          time: "09:00 AM",
          title: "Fort Aguada Historic Walk",
          category: "Sightseeing",
          icon: Compass,
        },
        {
          time: "01:00 PM",
          title: "Traditional Goan Lunch",
          category: "Food & Drink",
          icon: Utensils,
        },
        {
          time: "05:00 PM",
          title: "Anjuna Beach Sunset Walk",
          category: "Leisure",
          icon: Sun,
        },
        {
          time: "08:00 PM",
          title: "Candlelight Seaside Dinner",
          category: "Dining",
          icon: Moon,
        },
      ],
    },
    {
      date: "13 AUG",
      dayName: "Day 2 — Old Quarter & Cultural Trails",
      events: [
        {
          time: "10:00 AM",
          title: "Fontainhas Latin Quarter Heritage Walk",
          category: "Culture",
          icon: Compass,
        },
        {
          time: "03:00 PM",
          title: "State Museum & Art Gallery Visit",
          category: "History",
          icon: Sparkles,
        },
        {
          time: "07:00 PM",
          title: "Saturday Night Market & Live Music",
          category: "Nightlife",
          icon: Moon,
        },
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95724] text-xs font-bold uppercase tracking-wider">
              <CalendarIcon className="w-3.5 h-3.5" /> Timeline View
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              See your journey at a glance.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Seamlessly browse day by day. Experience a clean vertical stream that gives you full confidence in your daily rhythm.
            </p>
          </FadeIn>
        </div>

        {/* Timeline Columns */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {timelineDays.map((day, dIdx) => (
            <FadeIn key={day.date} delay={dIdx * 0.15} distance={20}>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-extrabold text-[#F95724] uppercase tracking-wider block">
                      {day.date}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {day.dayName}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {day.events.length} Events
                  </span>
                </div>

                {/* Vertical Stream */}
                <div className="space-y-4 relative pl-4 border-l-2 border-orange-200 ml-2">
                  {day.events.map((ev) => {
                    const Icon = ev.icon;
                    return (
                      <div key={ev.title} className="relative space-y-1">
                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-[#F95724] border-2 border-white shadow-xs" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {ev.time}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                            {ev.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-700">
                          {ev.title}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
