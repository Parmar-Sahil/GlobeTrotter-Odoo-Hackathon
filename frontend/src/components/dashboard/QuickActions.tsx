"use client";

import React from "react";
import Link from "next/link";
import { Plus, Compass, MapPin, Sparkles, ArrowRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Create Trip",
      description: "Design a new multi-city itinerary from scratch",
      href: "/trips/new",
      icon: Plus,
      color: "bg-[#7C2D12] text-white",
      badge: "Start New",
    },
    {
      title: "Explore Destinations",
      description: "Discover top regional cities and curated activities",
      href: "/explore",
      icon: Compass,
      color: "bg-[#F95724] text-white",
      badge: "Discover",
    },
    {
      title: "My Trips",
      description: "View, edit, and organize all your saved journeys",
      href: "/trips",
      icon: MapPin,
      color: "bg-amber-600 text-white",
      badge: "Itineraries",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F95724]" />
          <h2 className="text-lg font-extrabold text-slate-900">
            Quick Actions
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="group p-5 rounded-3xl bg-white border border-orange-100 hover:border-orange-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${act.color} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#FAF7F5] px-2.5 py-1 rounded-full border border-orange-100/60">
                  {act.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors flex items-center justify-between">
                  {act.title}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#7C2D12] transition-all" />
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {act.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
