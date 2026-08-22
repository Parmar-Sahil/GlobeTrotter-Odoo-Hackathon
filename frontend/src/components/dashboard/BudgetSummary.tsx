"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

interface BudgetSummaryWidgetProps {
  totalEstimatedCost: number;
  budgetLimit: number;
  tripTitle?: string;
  tripId?: string;
}

export function BudgetSummaryWidget({
  totalEstimatedCost,
  budgetLimit,
  tripTitle = "Active Itinerary",
  tripId,
}: BudgetSummaryWidgetProps) {
  const percentage =
    budgetLimit > 0 ? Math.min(Math.round((totalEstimatedCost / budgetLimit) * 100), 100) : 0;
  const isOverBudget = budgetLimit > 0 && totalEstimatedCost > budgetLimit;
  const remaining = Math.max(0, budgetLimit - totalEstimatedCost);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Budget Tracker</h3>
            <p className="text-xs text-slate-500 truncate max-w-[160px]">{tripTitle}</p>
          </div>
        </div>

        {tripId && (
          <Link
            href={`/trips/${tripId}?tab=budget`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            aria-label="View budget breakdown"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(totalEstimatedCost)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            of {budgetLimit > 0 ? formatCurrency(budgetLimit) : "No limit"}
          </span>
        </div>

        {/* Progress Bar */}
        {budgetLimit > 0 && (
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-rose-500"
                  : percentage > 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        <span className="text-slate-500">Remaining</span>
        <span
          className={`font-semibold ${
            isOverBudget ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {budgetLimit > 0 ? (
            isOverBudget ? (
              <span className="inline-flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Over budget
              </span>
            ) : (
              formatCurrency(remaining)
            )
          ) : (
            "Flexible"
          )}
        </span>
      </div>
    </div>
  );
}
