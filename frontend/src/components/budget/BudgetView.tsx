"use client";

import React, { useState } from "react";
import { Trip, ItinerarySection, BudgetSummary } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useTripMutations } from "@/hooks/use-trips";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Tag,
  Clock,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  X,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface BudgetViewProps {
  trip: Trip;
  sections: ItinerarySection[];
  budgetSummary?: BudgetSummary;
  onNavigateTab?: (tab: "overview" | "itinerary" | "calendar" | "budget") => void;
}

export function BudgetView({
  trip,
  sections,
  budgetSummary,
  onNavigateTab,
}: BudgetViewProps) {
  const { updateTrip, isUpdating } = useTripMutations(trip.id);

  // Modal State for Editing / Setting Budget
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState(
    trip.budgetLimit?.toString() || ""
  );
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // 1. Gather all scheduled activities & items across stops
  const allItems = sections.flatMap((sec) =>
    (sec.items || []).map((item) => ({
      ...item,
      stopTitle: sec.title || sec.destination?.name || "Travel Stop",
    }))
  );

  // 2. Compute authoritative totals
  const totalCost = allItems.reduce((acc, item) => acc + (item.cost || 0), 0);
  const budgetLimit = trip.budgetLimit || 0;
  const remaining = budgetLimit - totalCost;
  const isOverBudget = budgetLimit > 0 && totalCost > budgetLimit;
  const isNearBudget =
    budgetLimit > 0 &&
    !isOverBudget &&
    totalCost >= budgetLimit * 0.85;

  const percentageUsed =
    budgetLimit > 0
      ? Math.min(Math.round((totalCost / budgetLimit) * 100), 100)
      : 0;

  // 3. Duration & Daily Average calculation
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const totalDays = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
  const dailyAverage = totalCost / totalDays;

  // 4. Categorization
  const categories: Record<
    string,
    {
      label: string;
      amount: number;
      color: string;
      textColor: string;
      bgColor: string;
      items: typeof allItems;
    }
  > = {
    ACTIVITIES: {
      label: "Activities & Tours",
      amount: 0,
      color: "#F95724", // Brand Orange
      textColor: "text-[#7C2D12]",
      bgColor: "bg-orange-50",
      items: [],
    },
    MEALS: {
      label: "Food & Dining",
      amount: 0,
      color: "#10B981", // Emerald
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      items: [],
    },
    TRANSPORT: {
      label: "Transport & Transit",
      amount: 0,
      color: "#F59E0B", // Amber
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      items: [],
    },
    ACCOMMODATION: {
      label: "Stay & Accommodation",
      amount: 0,
      color: "#8B5CF6", // Purple
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      items: [],
    },
    OTHER: {
      label: "Shopping & Misc",
      amount: 0,
      color: "#64748B", // Slate
      textColor: "text-slate-700",
      bgColor: "bg-slate-50",
      items: [],
    },
  };

  allItems.forEach((item) => {
    const cost = item.cost || 0;
    const cat = item.category || item.activity?.category || "SIGHTSEEING";

    if (cat === "FOOD_DRINK") {
      categories.MEALS.amount += cost;
      categories.MEALS.items.push(item);
    } else if (
      cat === "SIGHTSEEING" ||
      cat === "CULTURE" ||
      cat === "ADVENTURE" ||
      cat === "RELAXATION"
    ) {
      categories.ACTIVITIES.amount += cost;
      categories.ACTIVITIES.items.push(item);
    } else if (cat === "SHOPPING" || cat === "NIGHTLIFE") {
      categories.OTHER.amount += cost;
      categories.OTHER.items.push(item);
    } else {
      categories.ACTIVITIES.amount += cost;
      categories.ACTIVITIES.items.push(item);
    }
  });

  const categoryList = Object.values(categories).filter(
    (c) => c.amount > 0 || c.label === "Activities & Tours"
  );

  // 5. SVG Donut Chart Calculation
  let cumulativePercent = 0;
  const chartSegments = categoryList
    .filter((cat) => cat.amount > 0)
    .map((cat) => {
      const fraction = totalCost > 0 ? cat.amount / totalCost : 0;
      const strokeDasharray = `${fraction * 100} ${100 - fraction * 100}`;
      const strokeDashoffset = -cumulativePercent;
      cumulativePercent += fraction * 100;
      return {
        ...cat,
        fraction,
        strokeDasharray,
        strokeDashoffset,
      };
    });

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newBudgetValue);
    if (isNaN(val) || val < 0) return;

    await updateTrip({
      id: trip.id,
      data: {
        budgetLimit: val > 0 ? val : undefined,
      },
    });
    setIsEditBudgetOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Dynamic Status Alert Banner */}
      {isOverBudget ? (
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold">
                ⚠️ You&apos;re over budget by {formatCurrency(Math.abs(remaining))}
              </h4>
              <p className="text-xs text-rose-700 font-normal leading-relaxed">
                Your estimated itinerary cost ({formatCurrency(totalCost)}) exceeds your designated target of {formatCurrency(budgetLimit)}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab?.("itinerary")}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Review Itinerary
            </button>
            <button
              type="button"
              onClick={() => setIsEditBudgetOpen(true)}
              className="px-4 py-2 rounded-full bg-white border border-rose-200 text-rose-800 text-xs font-semibold hover:bg-rose-100/60 transition-colors"
            >
              Adjust Budget
            </button>
          </div>
        </div>
      ) : isNearBudget ? (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold">
                Getting close to your budget limit
              </h4>
              <p className="text-xs text-amber-800 font-normal">
                You have used {percentageUsed}% of your budget target. {formatCurrency(remaining)} remaining.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab?.("itinerary")}
            className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            Review Schedule
          </button>
        </div>
      ) : budgetLimit > 0 ? (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold">
                ✓ Your itinerary is within budget
              </h4>
              <p className="text-xs text-emerald-700 font-normal">
                {formatCurrency(remaining)} buffer remaining for unscheduled activities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditBudgetOpen(true)}
            className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
          >
            Edit Target
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-white border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-orange-50 text-[#F95724] shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Set a budget target for this trip
              </h4>
              <p className="text-xs text-slate-500 font-normal">
                Keep your scheduled activities and stops aligned with what you plan to spend.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditBudgetOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Set Budget Target
          </button>
        </div>
      )}

      {/* 2. Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Estimated Total</span>
            <DollarSign className="w-4 h-4 text-[#F95724]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {formatCurrency(totalCost)}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            {allItems.length} scheduled expenses
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-2 relative group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Trip Budget</span>
            <button
              type="button"
              onClick={() => setIsEditBudgetOpen(true)}
              className="p-1 rounded-md text-slate-400 hover:text-[#7C2D12] hover:bg-orange-50 transition-colors"
              title="Edit Budget Target"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-3xl font-extrabold text-[#7C2D12]">
            {budgetLimit > 0 ? formatCurrency(budgetLimit) : "Flexible"}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            {budgetLimit > 0
              ? `${Math.round((totalCost / budgetLimit) * 100)}% allocated`
              : "No target ceiling"}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Average Daily Cost</span>
            <Tag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {formatCurrency(dailyAverage)}
          </p>
          <span className="text-xs text-slate-400 font-medium">
            Across {totalDays} {totalDays === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      {/* 3. Visual Budget Progress Indicator Bar */}
      {budgetLimit > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Budget Allocated ({formatCurrency(totalCost)} / {formatCurrency(budgetLimit)})
            </span>
            <span className="font-extrabold text-[#7C2D12]">
              {Math.round((totalCost / budgetLimit) * 100)}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOverBudget
                  ? "bg-rose-500"
                  : isNearBudget
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-[#F95724] to-[#7C2D12]"
              }`}
              style={{
                width: `${Math.min(
                  Math.round((totalCost / budgetLimit) * 100),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 4. Main Breakdown Grid: Donut Chart & Category Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown & Expandable Item Expenses */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-orange-100/70 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#F95724]" />
                Category Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Click any category to expand individual scheduled activities
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#7C2D12]">
              {totalCost > 0 ? "100% Calculated" : "No expenses"}
            </span>
          </div>

          {allItems.length > 0 ? (
            <div className="space-y-3">
              {categoryList.map((cat) => {
                const catPercent =
                  totalCost > 0 ? Math.round((cat.amount / totalCost) * 100) : 0;
                const isExpanded = expandedCategory === cat.label;

                return (
                  <div
                    key={cat.label}
                    className="border border-orange-100/80 rounded-2xl overflow-hidden transition-all bg-[#FAF7F5]"
                  >
                    {/* Accordion Trigger */}
                    <div
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : cat.label)
                      }
                      className="p-4 cursor-pointer hover:bg-white flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {cat.label}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {cat.items.length}{" "}
                            {cat.items.length === 1 ? "expense" : "expenses"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatCurrency(cat.amount)}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 w-9 text-right">
                          {catPercent}%
                        </span>
                        {cat.items.length > 0 && (
                          <div className="text-slate-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expandable Sub-items */}
                    {isExpanded && cat.items.length > 0 && (
                      <div className="p-4 bg-white border-t border-orange-100/70 space-y-2 text-xs">
                        {cat.items.map((item, iIdx) => (
                          <div
                            key={item.id || iIdx}
                            className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#FAF7F5] text-slate-700 font-medium"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-bold text-slate-900 truncate">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {item.stopTitle}
                              </p>
                            </div>
                            <span className="font-bold text-[#7C2D12] shrink-0">
                              {item.cost && item.cost > 0
                                ? formatCurrency(item.cost)
                                : "Free"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Sparkles className="w-8 h-8 text-orange-300 mx-auto" />
              <p className="text-xs text-slate-500 font-normal">
                No scheduled activities or cost items added to this itinerary yet.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab?.("itinerary")}
                className="px-5 py-2 bg-[#7C2D12] text-white text-xs font-bold rounded-full hover:bg-[#9A3412]"
              >
                Open Itinerary Builder
              </button>
            </div>
          )}
        </div>

        {/* Donut Chart & Destination Stop Cost Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Donut Chart */}
          <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-orange-100/70 pb-4">
              Visual Distribution
            </h3>

            {totalCost > 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background ring */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#FAF7F5"
                      strokeWidth="4"
                    />
                    {/* Segment strokes */}
                    {chartSegments.map((seg, idx) => (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="4"
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Total
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatCurrency(totalCost)}
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  {categoryList
                    .filter((c) => c.amount > 0)
                    .map((c) => (
                      <div key={c.label} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-slate-600 font-medium truncate max-w-[120px]">
                          {c.label}
                        </span>
                        <span className="font-bold text-slate-900 ml-auto">
                          {Math.round((c.amount / totalCost) * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Add activities to generate visual category chart.
              </p>
            )}
          </div>

          {/* Cost by Destination Stop */}
          <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-orange-100/70 pb-3">
              Cost by Destination Stop
            </h3>

            {sections.length > 0 ? (
              <div className="space-y-2.5">
                {sections.map((sec, idx) => {
                  const stopCost =
                    sec.items?.reduce((acc, item) => acc + (item.cost || 0), 0) || 0;

                  return (
                    <div
                      key={sec.id || idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F5] border border-orange-100/70 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-xl bg-[#F95724] text-white flex items-center justify-center font-extrabold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 truncate max-w-[160px]">
                          {sec.title || sec.destination?.name || `Stop ${idx + 1}`}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#7C2D12] shrink-0">
                        {formatCurrency(stopCost)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No stops added to calculate destination distribution.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Edit / Set Budget Modal */}
      {isEditBudgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-orange-100/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {trip.budgetLimit ? "Update Trip Budget" : "Set Target Budget"}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditBudgetOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Budget Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={newBudgetValue}
                    onChange={(e) => setNewBudgetValue(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full pl-8 pr-4 py-3 bg-[#FAF7F5] border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724] font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium pl-1">
                  Leave empty or 0 for flexible budget without a ceiling.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditBudgetOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
