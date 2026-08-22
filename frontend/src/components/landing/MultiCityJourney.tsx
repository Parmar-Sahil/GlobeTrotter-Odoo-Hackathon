"use client";

import React from "react";
import Link from "next/link";
import { MULTI_CITY_ROUTE } from "@/lib/landingData";
import { FadeIn } from "../animation/FadeIn";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Navigation,
} from "lucide-react";

export function MultiCityJourney() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="journey" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#7C2D12] text-xs font-bold uppercase tracking-wider border border-orange-100">
            <Navigation className="w-3.5 h-3.5 text-[#F95724]" /> Multi-City Routing
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Turn destinations into a journey.
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Sequence stops logically across regions. Calculate transit times, group daily activities, and visualize your entire path on one interactive timeline.
          </p>
        </FadeIn>
      </div>

      {/* Interactive Multi-City Route Showcase */}
      <div className="relative bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-950/5 p-6 sm:p-10 lg:p-12 overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Route Connector Line (Desktop) */}
        <div className="hidden lg:block absolute top-[120px] left-[10%] right-[10%] h-1 pointer-events-none z-0">
          <svg className="w-full h-12 overflow-visible">
            <motion.path
              d="M 0,0 C 200,40 600,-40 850,0"
              fill="none"
              stroke="#F95724"
              strokeWidth="3"
              strokeDasharray="6 6"
              initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* City Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {MULTI_CITY_ROUTE.map((step, idx) => (
            <FadeIn
              key={step.city}
              delay={idx * 0.15}
              distance={20}
              className="flex flex-col"
            >
              <div className="group bg-[#FAF7F5] hover:bg-white rounded-3xl border border-orange-100/90 p-5 sm:p-6 space-y-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                {/* Header with Step Node */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#F95724] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {step.days}
                  </span>
                </div>

                {/* City Image */}
                <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-200 shadow-2xs">
                  <img
                    src={step.image}
                    alt={step.city}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                    {step.dates}
                  </span>
                </div>

                {/* City Info */}
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors">
                    {step.city}
                  </h3>
                  <p className="text-xs text-slate-500">{step.stateCountry}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>{step.activitiesCount} Planned Events</span>
                  <span className="text-emerald-600 font-bold">Structured</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-10 pt-8 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-City Optimization
            </span>
            <span>•</span>
            <span>Automated Transit Buffers</span>
          </div>

          <Link
            href="/trips/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Build My Itinerary
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
