"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, ArrowRight, Sparkles, MapPin } from "lucide-react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const heroImage =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=85";

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Background Image with Cinematic Zoom and Gradient Overlays */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, scale: 1.08 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full pointer-events-none"
      >
        <img
          src={heroImage}
          alt="GlobeTrotter Epic Travel Landscapes"
          className="h-full w-full object-cover object-center opacity-45"
          priority-img="true"
        />
        {/* Multilayer Gradients for Depth & Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-3xl" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Eyebrow */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 18 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-widest text-blue-200 shadow-inner"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>GLOBETROTTER</span>
        </motion.div>

        {/* Headline (Line-by-line / Word Reveal) */}
        <div className="space-y-2">
          <motion.h1
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 25 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            Where will your next <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              story take you?
            </span>
          </motion.h1>
        </div>

        {/* Supporting Text */}
        <motion.p
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 20 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Discover places, build your route, plan every day, and keep your journey within budget.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 20 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/trips/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Plan My Trip
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#destinations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/15 backdrop-blur-md transition-all shadow-xs"
          >
            <MapPin className="w-4 h-4 text-slate-300" />
            Explore Destinations
          </a>
        </motion.div>
      </div>
    </section>
  );
}
