"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowRight, Sparkles, MapPin, Users, Shield } from "lucide-react";

export function Hero() {
  const heroImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85";

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FAF7F2] text-slate-900 px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Background Cinematic Visual with Warm Gradient Overlay */}
      <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
        <img
          src={heroImage}
          alt="GlobTrottler Scenic Travel Landscapes"
          className="h-full w-full object-cover object-center opacity-30"
        />
        {/* Warm Cream Vignette & Light Diffusion Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-[#FAF7F2]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/80 via-transparent to-[#FAF7F2]/80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/90 text-xs font-extrabold uppercase tracking-widest text-[#7C2D12] shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#F95724]" />
          <span>GLOBETROTTER SOCIAL TRAVEL PLANNER</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
          Where will your next <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#7C2D12] via-[#C2410C] to-[#EA580C] bg-clip-text text-transparent">
            story take you?
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Discover unforgettable places, build multi-city routes, plan day-by-day itineraries, and share journeys with fellow travelers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/trips/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-950/20 transition-all hover:scale-103 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Plan My Trip
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#destinations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-orange-50/60 text-slate-800 font-bold text-sm sm:text-base border border-orange-200/90 backdrop-blur-md transition-all shadow-xs"
          >
            <MapPin className="w-4 h-4 text-[#F95724]" />
            Explore Destinations
          </a>
        </div>

        {/* Social Proof Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#F95724]" /> Community Routes
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#7C2D12]" /> Multi-City Sequences
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" /> Real-time Budgeting
          </span>
        </div>
      </div>
    </section>
  );
}
