"use client";

import React from "react";
import Link from "next/link";
import { LANDING_CATEGORIES } from "@/lib/landingData";
import { FadeIn } from "../animation/FadeIn";
import { Sparkles, ArrowRight } from "lucide-react";

export function TravelCategories() {
  return (
    <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <FadeIn className="space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Travel Themes
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find your kind of adventure.
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          From mountain ridges to culinary trails, pick the vibe that sparks your journey.
        </p>
      </FadeIn>

      {/* Horizontal Scroll / Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {LANDING_CATEGORIES.map((cat, idx) => (
          <FadeIn key={cat.id} delay={idx * 0.05} distance={15}>
            <Link
              href="/explore"
              className="group relative block h-56 sm:h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white space-y-1">
                <h3 className="text-base sm:text-lg font-bold group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 leading-snug">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
