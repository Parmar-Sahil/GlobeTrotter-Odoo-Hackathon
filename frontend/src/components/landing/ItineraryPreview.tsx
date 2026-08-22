"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "../animation/FadeIn";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Utensils,
  Sun,
  Compass,
  Sailboat,
} from "lucide-react";

export function ItineraryPreview() {
  const daySchedule = [
    {
      time: "09:00 AM",
      title: "Fort Aguada & Coastal Lighthouse Trail",
      category: "Sightseeing",
      duration: "2.5 hrs",
      cost: "₹300",
      status: "Completed",
      icon: Compass,
      color: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    },
    {
      time: "01:00 PM",
      title: "Traditional Goan Thali Culinary Experience",
      category: "Dining",
      duration: "1.5 hrs",
      cost: "₹1,200",
      status: "Completed",
      icon: Utensils,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    {
      time: "04:30 PM",
      title: "Baga Beach Relaxation & Water Activities",
      category: "Coastal Leisure",
      duration: "2.0 hrs",
      cost: "₹850",
      status: "Upcoming",
      icon: Sun,
      color: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    },
    {
      time: "07:00 PM",
      title: "Sunset Catamaran Cruise & Acoustic Music",
      category: "Tour & Sailing",
      duration: "2.5 hrs",
      cost: "₹2,400",
      status: "Upcoming",
      icon: Sailboat,
      color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#1F0C05] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F95724] text-xs font-bold uppercase tracking-wider border border-white/10">
              <Calendar className="w-3.5 h-3.5" /> Workspace Preview
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Build days you&apos;ll actually remember.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Schedule by the hour or keep it relaxed. Group activities, track estimated durations, and stay on top of your daily journey.
            </p>
          </FadeIn>
        </div>

        {/* Itinerary Preview Card */}
        <FadeIn delay={0.3}>
          <div className="max-w-4xl mx-auto bg-[#2E140B]/90 backdrop-blur-xl rounded-3xl border border-orange-500/20 shadow-2xl p-6 sm:p-10 space-y-8">
            {/* Header of the Day */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#F95724] text-white shadow-md shadow-orange-500/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#F95724] uppercase tracking-wider">
                      DAY 03 OF 07
                    </span>
                    <span className="text-xs text-slate-400">• Oct 16</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Goa Coastal & Heritage Day
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
                  <span className="text-[#F95724]">3 / 5</span> activities completed
                </div>
              </div>
            </div>

            {/* Vertical Activity Schedule */}
            <div className="space-y-4 relative pl-4 sm:pl-6 border-l-2 border-dashed border-orange-500/40 ml-3 sm:ml-4">
              {daySchedule.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="relative group">
                    {/* Node */}
                    <div className="absolute -left-[25px] sm:-left-[33px] top-4 w-4 h-4 rounded-full bg-[#F95724] border-2 border-[#1F0C05] shadow-xs" />

                    {/* Activity Item Card */}
                    <div className="bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl border ${item.color} shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-orange-400">
                              {item.time}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {item.title}
                          </h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {item.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <span className="text-sm font-extrabold text-white">
                          {item.cost}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            item.status === "Completed"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Day Estimated Total: <strong className="text-white">₹4,750</strong>
              </span>

              <Link
                href="/trips/new"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F95724] hover:text-orange-300 transition-colors"
              >
                Try the Live Itinerary Builder <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
