"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LANDING_EXPERIENCES } from "@/lib/landingData";
import { FadeIn } from "../animation/FadeIn";
import {
  Sparkles,
  Clock,
  MapPin,
  Plus,
  Check,
  Tag,
  ArrowRight,
  Compass,
} from "lucide-react";

export function ExperienceShowcase() {
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleToggleAdd = (id: string) => {
    if (addedIds.includes(id)) {
      setAddedIds(addedIds.filter((item) => item !== id));
    } else {
      setAddedIds([...addedIds, id]);
    }
  };

  return (
    <section id="experiences" className="py-20 lg:py-28 bg-slate-100/70 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <FadeIn className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95724] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Curated Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Don&apos;t just visit. Experience.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Elevate your journey with handpicked local adventures, culinary trails, and iconic sights.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Browse All Experiences <ArrowRight className="w-4 h-4 text-[#F95724]" />
            </Link>
          </FadeIn>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LANDING_EXPERIENCES.map((exp, idx) => {
            const isAdded = addedIds.includes(exp.id);

            return (
              <FadeIn key={exp.id} delay={idx * 0.08} distance={20}>
                <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
                  {/* Image container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
                        {exp.category}
                      </span>
                    </div>

                    {/* Cost Badge */}
                    <div className="absolute bottom-3 right-3.5 text-white font-extrabold text-sm drop-shadow-xs">
                      {exp.estimatedCost}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#F95724] shrink-0" />
                        <span className="truncate">{exp.location}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#F95724] transition-colors leading-snug line-clamp-2">
                        {exp.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {exp.duration}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleAdd(exp.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                          isAdded
                            ? "bg-emerald-600 text-white shadow-emerald-500/20"
                            : "bg-slate-900 text-white hover:bg-[#F95724] shadow-slate-900/10"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Add to Trip
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
