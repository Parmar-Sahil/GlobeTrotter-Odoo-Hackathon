"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, ArrowRight, Sparkles, MapPin, Users, Shield } from "lucide-react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const heroImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85";

  return (
    <section className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#FAF7F2] text-slate-900 px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Background Cinematic Visual with Warm Gradient Overlay */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full pointer-events-none"
      >
        <img
          src={heroImage}
          alt="GlobTrottler Scenic Travel Landscapes"
          className="h-full w-full object-cover object-center opacity-30"
        />
        {/* Warm Cream Vignette & Light Diffusion Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-[#FAF7F2]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/80 via-transparent to-[#FAF7F2]/80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-orange-400/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Eyebrow Pill */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/90 text-xs font-extrabold uppercase tracking-widest text-[#7C2D12] shadow-xs"
        >
          <Compass className="w-3.5 h-3.5 text-[#F95724]" />
          <span>GLOBETROTTER SOCIAL TRAVEL PLANNER</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900"
        >
          Where will your next <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#7C2D12] via-[#C2410C] to-[#EA580C] bg-clip-text text-transparent">
            story take you?
          </span>
        </motion.h1>

        {/* Supporting Description */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Discover unforgettable places, build multi-city routes, plan day-by-day itineraries, and share journeys with fellow travelers.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
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
        </motion.div>

        {/* Social Proof Badges */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#F95724]" /> Community Routes
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#7C2D12]" /> Multi-City Sequences
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" /> Real-time Budgeting
          </span>
        </motion.div>
      </div>
    </section>
  );
}
