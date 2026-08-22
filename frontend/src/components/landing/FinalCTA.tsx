"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "../animation/FadeIn";
import { Sparkles, ArrowRight, MapPin } from "lucide-react";

export function FinalCTA() {
  const ctaImage =
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop&q=85";

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#1F0C05] text-white">
      {/* Background Image with Warm Diffusion */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={ctaImage}
          alt="GlobTrottler Scenic Travel Horizon"
          className="w-full h-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F0C05] via-[#1F0C05]/60 to-[#1F0C05]/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-widest text-[#F95724]">
            <Sparkles className="w-3.5 h-3.5" /> Start Your Journey Today
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Stop saving destinations. <br />
            <span className="text-[#F95724]">
              Start planning journeys.
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Your next adventure is closer than you think. Build your multi-city route, structure daily schedules, and share your path with travelers worldwide.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/trips/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#F95724] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-98"
            >
              Plan My Trip <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/15 backdrop-blur-md transition-all"
            >
              <MapPin className="w-4 h-4 text-orange-300" /> Explore Destinations
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
