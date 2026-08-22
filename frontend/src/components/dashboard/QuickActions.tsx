"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Compass, Sparkles, ArrowRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Create a Trip",
      description: "Start a multi-city journey with dates, stops & budget",
      href: "/trips/new",
      icon: PlusCircle,
      badge: "Fast Planner",
      color: "from-orange-500/10 to-amber-500/10 text-[#7C2D12] border-orange-200/60",
      iconBg: "bg-[#F95724] text-white",
    },
    {
      title: "Explore Destinations",
      description: "Discover trending cities, heritage sites & regional spots",
      href: "/explore",
      icon: Compass,
      badge: "World Guide",
      color: "from-amber-500/10 to-orange-500/10 text-amber-900 border-amber-200/60",
      iconBg: "bg-[#7C2D12] text-white",
    },
    {
      title: "Discover Experiences",
      description: "Find curated tours, culinary walks & coastal adventures",
      href: "/explore",
      icon: Sparkles,
      badge: "Top Tours",
      color: "from-rose-500/10 to-orange-500/10 text-rose-950 border-orange-200/60",
      iconBg: "bg-orange-600 text-white",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900">
          Plan Your Journey
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Quickly launch new itineraries or browse curated destinations and experiences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group p-6 rounded-3xl border bg-gradient-to-br ${action.color} bg-white hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${action.iconBg}`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200/60">
                  {action.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {action.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#7C2D12] group-hover:translate-x-1 transition-transform">
                <span>Open planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
