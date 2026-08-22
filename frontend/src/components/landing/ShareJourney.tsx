"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FadeIn } from "../animation/FadeIn";
import {
  Share2,
  Copy,
  Check,
  Globe,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";

export function ShareJourney() {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-orange-200 text-[#7C2D12] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#F95724]" /> Social Travel Planning
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Your itinerary can inspire someone else.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Generate instant shareable links for friends and fellow travelers. Anyone can view or copy your full schedule into their account with a single click.
            </p>
          </FadeIn>
        </div>

        {/* Public Trip Preview Box */}
        <FadeIn delay={0.3}>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-950/5 overflow-hidden">
            {/* Header Banner */}
            <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80"
                alt="Shared European Journey"
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
                  <Globe className="w-3.5 h-3.5" /> Public Community Route
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Curated by @wanderer_aarav
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Autumn Across Western Europe
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Paris → Lyon → Zurich → Milan (10 Days)
                </p>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-orange-100/70 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-medium">Duration</span>
                  <p className="font-bold text-slate-800">Oct 10 – 20</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-medium">Cities</span>
                  <p className="font-bold text-slate-800">4 Stops</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-medium">Activities</span>
                  <p className="font-bold text-slate-800">18 Events</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-medium">Est. Budget</span>
                  <p className="font-bold text-[#7C2D12]">₹94,000</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-orange-200 text-slate-700 font-bold text-xs hover:bg-orange-50/70 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#F95724]" /> Share Trip
                    </>
                  )}
                </button>

                <Link
                  href="/trips/new"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white font-bold text-xs shadow-md shadow-orange-950/20 transition-all hover:scale-103"
                >
                  <Copy className="w-4 h-4" /> Copy This Trip to My Account
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
