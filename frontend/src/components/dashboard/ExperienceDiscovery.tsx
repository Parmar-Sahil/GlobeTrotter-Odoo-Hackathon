"use client";

import React from "react";
import Link from "next/link";
import { Activity } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, Clock, ArrowRight, Compass } from "lucide-react";

interface ExperienceDiscoveryProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export function ExperienceDiscovery({
  activities,
  isLoading,
}: ExperienceDiscoveryProps) {
  const fallbackExperiences: Activity[] = [
    {
      id: "exp-1",
      destinationId: "dest-goa",
      title: "Mandovi River Sunset Catamaran Cruise",
      description: "Glide past historic fortresses with live Goan music and chilled beverages.",
      category: "ADVENTURE",
      durationMinutes: 120,
      estimatedCost: 1500,
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
    },
    {
      id: "exp-2",
      destinationId: "dest-kyoto",
      title: "Traditional Gion Tea Ceremony & Geisha District Walk",
      description: "Experience authentic matcha whisking inside a century-old machiya townhouse.",
      category: "CULTURE",
      durationMinutes: 90,
      estimatedCost: 4200,
      imageUrl:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
    },
    {
      id: "exp-3",
      destinationId: "dest-bali",
      title: "Tegallalang Rice Terrace Sunrise Trek",
      description: "Hike through lush green terraces and enjoy fresh coconut water overlooking valleys.",
      category: "SIGHTSEEING",
      durationMinutes: 150,
      estimatedCost: 2100,
      imageUrl:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
    },
  ];

  const displayExperiences =
    activities && activities.length > 0
      ? activities.slice(0, 3)
      : fallbackExperiences;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F95724]" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Make the journey memorable.
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Handpicked local experiences, heritage walks, and outdoor adventures
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412] transition-colors"
        >
          Discover more
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-white border border-orange-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {displayExperiences.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-3xl border border-orange-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={
                    exp.imageUrl ||
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md">
                  {exp.category?.replace("_", " ") || "EXPERIENCE"}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors line-clamp-1">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#F95724]" />
                    {exp.durationMinutes} mins
                  </span>

                  <span className="text-[#7C2D12]">
                    {exp.estimatedCost > 0
                      ? formatCurrency(exp.estimatedCost)
                      : "Free"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
