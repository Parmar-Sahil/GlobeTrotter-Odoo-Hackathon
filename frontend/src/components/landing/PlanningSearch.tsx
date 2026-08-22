"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "../animation/FadeIn";
import {
  Search,
  Calendar,
  Compass,
  DollarSign,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function PlanningSearch() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [travelStyle, setTravelStyle] = useState("Balanced Exploration");
  const [budget, setBudget] = useState("");

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/trips/new");
  };

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn delay={0.2} duration={0.6}>
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Start with a destination.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose your dream spot and let GlobeTrotter structure your route
              </p>
            </div>
            <span className="hidden sm:inline-flex text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              Quick Setup
            </span>
          </div>

          <form onSubmit={handleStartPlanning} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destination Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Where to?
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Kyoto, Goa, Amalfi..."
                    className="w-full pl-9 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  When?
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Travel Style
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="Balanced Exploration">Balanced Exploration</option>
                    <option value="Cultural Heritage">Cultural Heritage</option>
                    <option value="Food & Nightlife">Food & Nightlife</option>
                    <option value="Beach & Coastal">Beach & Coastal</option>
                    <option value="Outdoor Adventure">Outdoor Adventure</option>
                  </select>
                </div>
              </div>

              {/* Budget Limit */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Budget
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. ₹45,000 / $600"
                    className="w-full pl-9 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-102 active:scale-98"
              >
                Start Planning <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </FadeIn>
    </section>
  );
}
