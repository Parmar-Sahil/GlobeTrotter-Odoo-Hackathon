"use client";

import React from "react";
import { Trip, ItinerarySection, BudgetSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Tag,
  ShieldAlert,
} from "lucide-react";

interface BudgetViewProps {
  trip: Trip;
  sections: ItinerarySection[];
  budgetSummary?: BudgetSummary;
}

export function BudgetView({
  trip,
  sections,
  budgetSummary,
}: BudgetViewProps) {
  // Aggregate items and categorize them
  const allItems = sections.flatMap((sec) => sec.items || []);

  const totalCost = allItems.reduce((acc, item) => acc + (item.cost || 0), 0);
  const budgetLimit = trip.budgetLimit || 0;
  const remaining = Math.max(0, budgetLimit - totalCost);
  const isOverBudget = budgetLimit > 0 && totalCost > budgetLimit;
  const percentage =
    budgetLimit > 0
      ? Math.min(Math.round((totalCost / budgetLimit) * 100), 100)
      : 0;

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const totalDays = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  const dailyAverage = totalCost / totalDays;

  // Category mapping
  const categoryTotals: Record<string, number> = {
    Transport: 0,
    Accommodation: 0,
    Activities: 0,
    Meals: 0,
    Other: 0,
  };

  allItems.forEach((item) => {
    const cost = item.cost || 0;
    const cat = item.category || item.activity?.category;
    if (cat === "FOOD_DRINK") categoryTotals.Meals += cost;
    else if (cat === "SIGHTSEEING" || cat === "CULTURE" || cat === "ADVENTURE")
      categoryTotals.Activities += cost;
    else if (cat === "SHOPPING" || cat === "NIGHTLIFE")
      categoryTotals.Other += cost;
    else categoryTotals.Activities += cost;
  });

  const categoryList = [
    {
      name: "Activities & Tours",
      amount: categoryTotals.Activities,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      name: "Meals & Dining",
      amount: categoryTotals.Meals,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
    },
    {
      name: "Transport",
      amount: categoryTotals.Transport,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
    {
      name: "Accommodation",
      amount: categoryTotals.Accommodation,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      name: "Other / Misc",
      amount: categoryTotals.Other,
      color: "bg-slate-400",
      textColor: "text-slate-600",
      bgLight: "bg-slate-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Over-budget Alert Banner */}
      {isOverBudget && (
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-4 shadow-xs">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Budget Limit Exceeded</h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              Your estimated itinerary cost ({formatCurrency(totalCost)}) exceeds your designated budget goal ({formatCurrency(budgetLimit)}) by {formatCurrency(totalCost - budgetLimit)}. Consider adjusting high-cost activities or increasing your target.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Estimated Total</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {formatCurrency(totalCost)}
          </p>
          <span className="text-xs text-slate-400">
            {allItems.length} scheduled expenses
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Budget Target</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {budgetLimit > 0 ? formatCurrency(budgetLimit) : "Flexible"}
          </p>
          <span className="text-xs text-slate-400">
            {budgetLimit > 0
              ? `${percentage}% allocated`
              : "No ceiling defined"}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Daily Average</span>
            <Tag className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {formatCurrency(dailyAverage)}
          </p>
          <span className="text-xs text-slate-400">Across {totalDays} days</span>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown Progress */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-600" />
              Expense Distribution
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {totalCost > 0 ? "100% Calculated" : "No expenses"}
            </span>
          </div>

          <div className="space-y-4">
            {categoryList.map((cat) => {
              const catPercent =
                totalCost > 0
                  ? Math.round((cat.amount / totalCost) * 100)
                  : 0;

              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(cat.amount)}
                      </span>
                      <span className="text-slate-400 text-[11px] w-8 text-right">
                        {catPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Stops */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">
            Cost by Destination Stop
          </h3>

          {sections.length > 0 ? (
            <div className="space-y-3">
              {sections.map((sec, idx) => {
                const stopCost =
                  sec.items?.reduce((acc, item) => acc + (item.cost || 0), 0) || 0;

                return (
                  <div
                    key={sec.id || idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 truncate max-w-[140px]">
                        {sec.title || sec.destination?.name || `Stop ${idx + 1}`}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-800">
                      {formatCurrency(stopCost)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              No stops added to calculate destination distribution.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
