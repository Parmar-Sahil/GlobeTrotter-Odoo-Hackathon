"use client";

import React from "react";
import Link from "next/link";
import { INSPIRATION_STORIES } from "@/lib/landingData";
import { FadeIn } from "../animation/FadeIn";
import { Sparkles, Calendar, MapPin, ArrowRight } from "lucide-react";

export function TravelInspiration() {
  return (
    <section id="inspiration" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <FadeIn className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95724] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Featured Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get inspired for your next journey.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Read carefully curated multi-stop itineraries designed by travel experts and real globetrotters.
          </p>
        </FadeIn>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INSPIRATION_STORIES.map((story, idx) => (
          <FadeIn key={story.id} delay={idx * 0.1} distance={20}>
            <div className="group relative rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-[420px] justify-end p-6 sm:p-8">
              {/* Background Image with Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              {/* Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F95724] text-white shadow-md">
                  {story.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-3 text-white">
                <div className="flex items-center gap-4 text-xs text-orange-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {story.duration}
                  </span>
                  <span>•</span>
                  <span>Est. {story.estimatedBudget}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-orange-300 transition-colors leading-tight">
                  {story.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-1">
                  {story.tagline}
                </p>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-slate-300">
                    {story.cities.join(" → ")}
                  </span>

                  <Link
                    href="/trips/new"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:text-orange-400 transition-colors"
                  >
                    Explore Journey <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
