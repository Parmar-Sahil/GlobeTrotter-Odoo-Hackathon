"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LANDING_EXPERIENCES } from "@/lib/landingData";
import { useSearchActivities } from "@/hooks/use-activities";
import { formatCurrency } from "@/lib/utils";
import { FadeIn } from "../animation/FadeIn";
import {
  Clock,
  MapPin,
  Plus,
  Check,
  ArrowRight,
  Compass,
} from "lucide-react";

export function ExperienceShowcase() {
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const { data: actData } = useSearchActivities({ limit: 4 });

  const handleToggleAdd = (id: string) => {
    if (addedIds.includes(id)) {
      setAddedIds(addedIds.filter((item) => item !== id));
    } else {
      setAddedIds([...addedIds, id]);
    }
  };

  const displayExperiences =
    actData?.activities && actData.activities.length > 0
      ? actData.activities.map((a: any) => ({
          id: a.id,
          title: a.title || a.name,
          category: (a.category || "activity").replace("_", " "),
          estimatedCost: a.estimatedCost > 0 ? formatCurrency(a.estimatedCost) : "Free",
          duration: `${a.durationMinutes || 120} mins`,
          location: a.city?.name ? `${a.city.name}, ${a.city.country}` : "Global",
          image: a.imageUrl || "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800",
        }))
      : LANDING_EXPERIENCES;

  return (
    <section id="experiences" className="py-20 lg:py-28 bg-[#FAF7F2] border-y border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <FadeIn className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-[#7C2D12] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#F95724]" /> Handpicked Activities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Don&apos;t just visit. Experience.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Elevate your journey with authentic local adventures, scenic catamaran sails, and artisan food trails.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-orange-200 text-slate-800 text-xs font-bold shadow-xs hover:bg-orange-50/70 transition-colors"
            >
              Browse All Experiences <ArrowRight className="w-4 h-4 text-[#F95724]" />
            </Link>
          </FadeIn>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayExperiences.map((exp: any, idx: number) => {
            const isAdded = addedIds.includes(exp.id);

            return (
              <FadeIn key={exp.id || idx} delay={idx * 0.08} distance={20}>
                <div className="group bg-white rounded-3xl border border-orange-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
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
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
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

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#7C2D12] transition-colors leading-snug line-clamp-2">
                        {exp.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {exp.duration}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleAdd(exp.id)}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs ${
                          isAdded
                            ? "bg-emerald-600 text-white shadow-emerald-500/20"
                            : "bg-[#7C2D12] text-white hover:bg-[#9A3412] shadow-orange-950/10"
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
