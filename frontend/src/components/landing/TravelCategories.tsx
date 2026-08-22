"use client";

import React from "react";
import Link from "next/link";
import { LANDING_CATEGORIES } from "@/lib/landingData";
import { FadeIn } from "../animation/FadeIn";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

export function TravelCategories() {
  return (
    <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <FadeIn className="space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#7C2D12] text-xs font-bold uppercase tracking-wider border border-orange-100">
          <Compass className="w-3.5 h-3.5 text-[#F95724]" /> Travel Vibes
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find your kind of adventure.
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          From tranquil mountain ridges to bustling spice markets, pick the experience style that sparks your imagination.
        </p>
      </FadeIn>

      {/* Grid of Categories with Warm Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LANDING_CATEGORIES.map((cat, idx) => (
          <FadeIn key={cat.id} delay={idx * 0.06} distance={15}>
            <Link
              href="/explore"
              className="group relative block h-64 sm:h-72 rounded-3xl overflow-hidden border border-orange-100/90 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-slate-950"
            >
              {/* Image with Gentle Scale */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover opacity-80 group-hover:scale-106 group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
                  {cat.badge}
                </span>
                <span className="text-[11px] font-bold text-orange-200">
                  {cat.count}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                <h3 className="text-xl font-extrabold group-hover:text-orange-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 leading-snug font-normal">
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
