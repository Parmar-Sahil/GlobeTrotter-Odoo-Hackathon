"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

export function TravelInspiration() {
  const journeys = [
    {
      id: "insp-1",
      title: "7 Days Across Japan: Neon Shrines & Bullet Trains",
      stops: "Tokyo → Hakone → Kyoto → Osaka",
      duration: "7 Days",
      budget: "₹1,10,000 est.",
      coverImage:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "insp-2",
      title: "Royal Forts & Sunsets in Western Rajasthan",
      stops: "Jaipur → Jodhpur → Udaipur",
      duration: "5 Days",
      budget: "₹34,000 est.",
      coverImage:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "insp-3",
      title: "Coastal Calm & Portuguese Heritage in Goa",
      stops: "Panaji → Old Goa → Palolem Beach",
      duration: "4 Days",
      budget: "₹22,000 est.",
      coverImage:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#F95724]" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Travel inspiration
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Curated multi-city routes and community travel schedules
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412] transition-colors"
        >
          View all inspiration
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {journeys.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-3xl bg-white border border-orange-100/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white">
                {item.duration}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#7C2D12] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {item.stops}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#7C2D12]">{item.budget}</span>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#7C2D12] hover:text-[#9A3412]"
                >
                  View Route <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
