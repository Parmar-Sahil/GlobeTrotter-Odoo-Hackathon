"use client";

import React from "react";
import Link from "next/link";
import { LANDING_DESTINATIONS } from "@/lib/landingData";
import { FadeIn } from "../animation/FadeIn";
import { MapPin, Star, ArrowRight, Sparkles } from "lucide-react";

export function DestinationShowcase() {
  return (
    <section id="destinations" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <FadeIn className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#7C2D12] text-xs font-bold uppercase tracking-wider border border-orange-100">
          <MapPin className="w-3.5 h-3.5 text-[#F95724]" /> Destination Discovery
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Places that deserve a place on your map.
        </h2>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          From ancient lantern-lit shrines to dramatic Mediterranean cliffs, discover curated destinations crafted for your itinerary.
        </p>
      </FadeIn>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {LANDING_DESTINATIONS.map((dest, idx) => {
          const isWide = idx === 0 || idx === 3;
          const colSpan = isWide ? "lg:col-span-7" : "lg:col-span-5";

          return (
            <FadeIn
              key={dest.id}
              delay={idx * 0.08}
              distance={20}
              className={`${colSpan} flex flex-col`}
            >
              <div className="group relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-orange-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8 bg-slate-950">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={`${dest.name}, ${dest.country}`}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-106 group-hover:opacity-95 transition-all duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/10 group-hover:bg-slate-950/80 transition-colors duration-300" />
                </div>

                {/* Top Floating Badges */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {dest.costLevel}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md text-white border border-white/10">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {dest.rating}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-2.5 text-white transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white group-hover:text-orange-300 transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-sm font-semibold text-slate-300">
                        {dest.country}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-orange-200">
                      {dest.travelStyle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 font-normal">
                    {dest.highlight}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-white/15">
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-orange-300 transition-colors"
                    >
                      Explore Destination <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
