"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "../animation/FadeIn";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Tag,
  ArrowRight,
  Shield,
} from "lucide-react";

export function BudgetPreview() {
  const budgetCategories = [
    {
      name: "Accommodation",
      amount: "₹18,500",
      percent: 43,
      color: "bg-blue-600",
    },
    {
      name: "Activities & Sightseeing",
      amount: "₹12,400",
      percent: 29,
      color: "bg-[#F95724]",
    },
    {
      name: "Food & Dining",
      amount: "₹8,250",
      percent: 19,
      color: "bg-emerald-500",
    },
    {
      name: "Local Transport",
      amount: "₹3,700",
      percent: 9,
      color: "bg-amber-500",
    },
  ];

  return (
    <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95724] text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" /> Smart Cost Tracking
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Know your journey before you take it.
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Avoid post-trip surprises. Estimate flight, hotel, and activity expenses in advance with real-time budget health indicators.
          </p>
        </FadeIn>
      </div>

      {/* Budget Dashboard Widget Preview */}
      <FadeIn delay={0.3}>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Trip Budget Target
              </span>
              <p className="text-3xl font-extrabold text-slate-900">₹50,000</p>
              <span className="text-xs text-slate-400">Total designated ceiling</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Estimated Total
              </span>
              <p className="text-3xl font-extrabold text-blue-600">₹42,850</p>
              <span className="text-xs text-slate-400">85.7% of budget allocated</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Remaining Safe Buffer
              </span>
              <p className="text-3xl font-extrabold text-emerald-600">₹7,150</p>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Within safe limit
              </span>
            </div>
          </div>

          {/* Budget Progress Gauge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Overall Budget Allocation</span>
              <span className="text-blue-600">85.7% Used</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: "43%" }} />
              <div className="bg-[#F95724] h-full" style={{ width: "29%" }} />
              <div className="bg-emerald-500 h-full" style={{ width: "19%" }} />
              <div className="bg-amber-500 h-full" style={{ width: "9%" }} />
            </div>
          </div>

          {/* Categorized Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgetCategories.map((cat) => (
              <div
                key={cat.name}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                    <span className="text-[11px] text-slate-400">{cat.percent}% of total</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-800">
                  {cat.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Notice Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Smart Alert:</strong> Day 4 is slightly above your average daily target due to sunset cruise booking.
            </span>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
