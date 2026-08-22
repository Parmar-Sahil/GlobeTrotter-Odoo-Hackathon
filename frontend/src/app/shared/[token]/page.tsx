"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useTrip, useTripMutations } from "@/hooks/use-trips";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Copy,
  Check,
  Compass,
  Sparkles,
  ArrowRight,
  Globe,
  DollarSign,
  Clock,
  Share2,
  Lock,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  PieChart as PieIcon,
} from "lucide-react";

interface SharedTripPageProps {
  params: Promise<{
    token: string;
  }>;
}

function SharedTripContent({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  const { data: trip, isLoading, isError } = useTrip(token);
  const { isAuthenticated } = useAuth();
  const { copyTrip, isCopying } = useTripMutations();

  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"itinerary" | "budget">("itinerary");

  const fallbackCover =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop&q=85";

  // Category Color Map
  const categoryConfig: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    SIGHTSEEING: {
      label: "Sightseeing",
      bg: "bg-orange-50",
      text: "text-[#7C2D12]",
      border: "border-orange-200",
      dot: "bg-[#F95724]",
    },
    FOOD_DRINK: {
      label: "Food & Dining",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    CULTURE: {
      label: "Culture",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    ADVENTURE: {
      label: "Adventure",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    RELAXATION: {
      label: "Relaxation",
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
      dot: "bg-teal-500",
    },
    NIGHTLIFE: {
      label: "Nightlife",
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    SHOPPING: {
      label: "Shopping",
      bg: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    OTHER: {
      label: "Other",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-500",
    },
  };

  // Main Copy Trip Flow with deep duplication of sections and activities
  const handleCopyTrip = async () => {
    if (!trip || isCopying || copiedSuccess) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/shared/${token}&action=copy`);
      return;
    }

    try {
      setCopyError(null);
      const newTrip = await copyTrip(trip);
      setCopiedSuccess(true);
      setTimeout(() => {
        router.push(`/trips/${newTrip.id}`);
      }, 800);
    } catch (err: any) {
      console.error("Failed to copy trip:", err);
      const rawMsg = err.response?.data?.message || err.message || "";
      if (rawMsg.includes("Can't reach database") || rawMsg.includes("localhost:5432")) {
        setCopyError("Database is offline. Please make sure PostgreSQL is running on port 5432.");
      } else {
        setCopyError(rawMsg || "Couldn't copy this trip. Please try again.");
      }
    }
  };

  // Auto-trigger copy if returning from login with action=copy
  useEffect(() => {
    if (trip && isAuthenticated && actionParam === "copy" && !copiedSuccess && !isCopying) {
      handleCopyTrip();
    }
  }, [trip, isAuthenticated, actionParam]);

  const handleShareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-slate-900">
        <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 py-3.5 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <BrandLogo size="sm" href="/" />
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
          <div className="h-80 bg-orange-100/60 rounded-3xl" />
          <div className="h-24 bg-white rounded-3xl border border-orange-100" />
          <div className="space-y-4">
            <div className="h-44 bg-white rounded-3xl border border-orange-100" />
            <div className="h-44 bg-white rounded-3xl border border-orange-100" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 py-3.5 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <BrandLogo size="sm" href="/" />
            <Link
              href="/explore"
              className="text-xs font-bold text-[#7C2D12] hover:underline"
            >
              Explore GlobeTrotter
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-orange-100 p-8 sm:p-10 text-center space-y-4 shadow-xl shadow-orange-950/5">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#F95724] flex items-center justify-center mx-auto shadow-inner">
              <Compass className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              This journey isn&apos;t available.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              The shared trip may have been set to private, removed by the creator, or the link may be invalid.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-102"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                Explore Other Trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sections = trip.sections || [];
  const allItems = sections.flatMap((sec) => sec.items || []);
  const totalCost = allItems.reduce((acc, item) => acc + (item.cost || 0), 0);

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const totalDays = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      {/* 1. Public Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-orange-100/80 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" href="/" />
            <span className="hidden sm:inline-block h-4 w-px bg-orange-200" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F95724]" /> Read-Only Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-orange-50 border border-orange-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
            >
              {shareLinkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Link Copied
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#F95724]" />
                  Share
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyTrip}
              disabled={isCopying || copiedSuccess}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103 active:scale-98 disabled:opacity-50"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Trip Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                  {isCopying ? "Copying Trip..." : "Copy This Trip"}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error / Retry Banner if copy fails */}
        {copyError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-xs font-medium">{copyError}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyTrip}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}

        {/* 2. Editorial Panoramic Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-orange-950/15 border border-orange-100 bg-[#2A0E06] text-white p-6 sm:p-10 lg:p-12 space-y-6">
          <div className="absolute inset-0 h-full w-full pointer-events-none">
            <img
              src={trip.coverImage || fallbackCover}
              alt={trip.title}
              className="h-full w-full object-cover opacity-35"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackCover;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A0E06] via-[#2A0E06]/65 to-black/30" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-orange-200 border border-white/10">
                <Globe className="w-3.5 h-3.5 text-[#F95724]" /> Public Travel Itinerary
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-300" /> {trip.status}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm leading-[1.15]">
                {trip.title}
              </h1>
              {trip.description && (
                <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed font-normal">
                  {trip.description}
                </p>
              )}
            </div>

            {/* Route Sequence Strip */}
            {sections.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                  Route:
                </span>
                {sections.map((sec, idx) => (
                  <React.Fragment key={sec.id || idx}>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/10">
                      <MapPin className="w-3 h-3 text-[#F95724]" />
                      {sec.title || sec.destination?.name || `Stop ${idx + 1}`}
                    </span>
                    {idx < sections.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-orange-300/60" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Meta Highlights Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4 text-[#F95724]" />
                {formatDate(trip.startDate)} — {formatDate(trip.endDate)} ({totalDays} {totalDays === 1 ? "day" : "days"})
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300" />
                <strong className="text-white">{sections.length}</strong> {sections.length === 1 ? "Stop" : "Stops"}
              </span>

              {totalCost > 0 && (
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Estimated: <strong className="text-white">{formatCurrency(totalCost)}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-orange-200/80 pb-px">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveViewTab("itinerary")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold border-b-2 transition-all ${
                activeViewTab === "itinerary"
                  ? "border-[#F95724] text-[#7C2D12]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Compass className="w-4 h-4" />
              Day-by-Day Journey ({sections.length} Stops)
            </button>

            <button
              type="button"
              onClick={() => setActiveViewTab("budget")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold border-b-2 transition-all ${
                activeViewTab === "budget"
                  ? "border-[#F95724] text-[#7C2D12]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <PieIcon className="w-4 h-4" />
              Budget & Cost Overview
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyTrip}
            disabled={isCopying || copiedSuccess}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#7C2D12] hover:underline disabled:opacity-50"
          >
            <Copy className="w-3.5 h-3.5" /> Copy this itinerary
          </button>
        </div>

        {/* 4. Tab Content: Itinerary Journey */}
        {activeViewTab === "itinerary" && (
          <div className="space-y-8">
            {sections.length > 0 ? (
              <div className="relative pl-6 sm:pl-10 border-l-2 border-orange-200 space-y-10 ml-3 sm:ml-5">
                {sections.map((section, idx) => (
                  <div key={section.id || idx} className="relative space-y-4">
                    {/* Glowing Stop Number Indicator */}
                    <div className="absolute -left-[35px] sm:-left-[51px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7C2D12] border-4 border-white text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-orange-950/20">
                      {idx + 1}
                    </div>

                    {/* Section Header Card */}
                    <div className="bg-white rounded-3xl border border-orange-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#F95724]" />
                          <h3 className="text-lg font-extrabold text-slate-900">
                            {section.title || section.destination?.name || `Stop ${idx + 1}`}
                          </h3>
                          {section.destination?.country && (
                            <span className="text-xs font-bold text-slate-400">
                              • {section.destination.country}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                          {section.arrivalDate ? formatDate(section.arrivalDate) : "Flexible date"}
                          {section.departureDate ? ` — ${formatDate(section.departureDate)}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 bg-[#FAF7F5] px-3 py-1.5 rounded-full border border-orange-100">
                          {section.items?.length || 0} scheduled {section.items?.length === 1 ? "activity" : "activities"}
                        </span>
                      </div>
                    </div>

                    {/* Activities List */}
                    {section.items && section.items.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {section.items.map((item, itemIdx) => {
                          const cat = item.category || item.activity?.category || "SIGHTSEEING";
                          const catStyle = categoryConfig[cat] || categoryConfig.SIGHTSEEING;

                          return (
                            <div
                              key={item.id || itemIdx}
                              className="bg-white rounded-2xl border border-orange-100/90 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                                  >
                                    {catStyle.label}
                                  </span>

                                  <span className="text-xs font-extrabold text-[#7C2D12]">
                                    {item.cost && item.cost > 0
                                      ? formatCurrency(item.cost)
                                      : "Free"}
                                  </span>
                                </div>

                                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                                  {item.title}
                                </h4>

                                {item.description && (
                                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100">
                                {item.startTime && (
                                  <span className="flex items-center gap-1 text-slate-700 font-bold">
                                    <Clock className="w-3.5 h-3.5 text-[#F95724]" />
                                    {item.startTime} {item.endTime ? `– ${item.endTime}` : ""}
                                  </span>
                                )}
                                {item.durationMinutes && (
                                  <span className="font-medium">
                                    • {item.durationMinutes} mins
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic pl-2">
                        No specific activities scheduled for this stop.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-orange-100 p-12 text-center space-y-3">
                <Compass className="w-10 h-10 text-orange-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  This journey hasn&apos;t been planned yet.
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No itinerary stops have been configured for this trip.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 5. Tab Content: Budget Breakdown */}
        {activeViewTab === "budget" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                  Estimated Total Cost
                </span>
                <p className="text-3xl font-extrabold text-slate-900">
                  {formatCurrency(totalCost)}
                </p>
                <span className="text-xs text-slate-400">
                  {allItems.length} scheduled expenses
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                  Target Budget
                </span>
                <p className="text-3xl font-extrabold text-[#7C2D12]">
                  {trip.budgetLimit ? formatCurrency(trip.budgetLimit) : "Flexible"}
                </p>
                <span className="text-xs text-slate-400">
                  Across {sections.length} destination stops
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                  Average Daily Spend
                </span>
                <p className="text-3xl font-extrabold text-slate-900">
                  {formatCurrency(totalCost / totalDays)}
                </p>
                <span className="text-xs text-slate-400">
                  Across {totalDays} {totalDays === 1 ? "day" : "days"}
                </span>
              </div>
            </div>

            {/* Stop-wise Cost Distribution */}
            <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-orange-100/70 pb-3">
                Cost by Travel Stop
              </h3>

              <div className="space-y-3">
                {sections.map((sec, idx) => {
                  const secCost =
                    sec.items?.reduce((acc, item) => acc + (item.cost || 0), 0) || 0;

                  return (
                    <div
                      key={sec.id || idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F5] border border-orange-100 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#F95724] text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">
                          {sec.title || sec.destination?.name || `Stop ${idx + 1}`}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#7C2D12]">
                        {formatCurrency(secCost)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 6. Bottom Sticky CTA Callout */}
        <div className="bg-gradient-to-r from-[#2A0E06] to-[#431407] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-orange-950/15">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">
              Inspired by this journey?
            </h3>
            <p className="text-xs sm:text-sm text-orange-200">
              Copy this itinerary to your own account to customize stops, adjust dates, and add personal activities.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyTrip}
            disabled={isCopying || copiedSuccess}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#F95724] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/30 transition-all hover:scale-103 active:scale-98 disabled:opacity-50 shrink-0"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                Copied to My Trips!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-200" />
                {isCopying ? "Copying Trip..." : "Copy This Trip"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>

      {/* 7. Minimalist Public Footer */}
      <footer className="border-t border-orange-100 bg-white/70 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" href="/" />
          <span>© {new Date().getFullYear()} GlobTrottler Social Travel Planner. All rights reserved.</span>
          <Link href="/explore" className="text-[#7C2D12] font-bold hover:underline">
            Explore All Destinations
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function SharedTripPage({ params }: SharedTripPageProps) {
  const { token } = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <SharedTripContent token={token} />
    </Suspense>
  );
}
