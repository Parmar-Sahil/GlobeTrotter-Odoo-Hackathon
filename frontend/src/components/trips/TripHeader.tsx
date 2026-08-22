"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trip } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Share2,
  Check,
  Globe,
  Lock,
  DollarSign,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface TripHeaderProps {
  trip: Trip;
  onShareClick?: () => void;
}

export function TripHeader({ trip, onShareClick }: TripHeaderProps) {
  const [copied, setCopied] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80";

  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
      return;
    }

    const shareUrl = `${window.location.origin}/shared/${trip.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const destinationCount = trip.destinationCount ?? trip.sections?.length ?? 0;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-white">
      {/* Cover Image Background */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src={trip.coverImage || fallbackImage}
          alt={trip.title}
          className="h-full w-full object-cover opacity-35"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/30" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Trips
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-semibold text-white border border-white/20 transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-300" />
                  Share Itinerary
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title and Meta */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {trip.status}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 text-xs font-medium backdrop-blur-md">
              {trip.visibility === "PUBLIC" ? (
                <>
                  <Globe className="w-3 h-3 text-blue-400" /> Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-slate-400" /> Private
                </>
              )}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {trip.title}
          </h1>

          {trip.description && (
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>

        {/* Info Highlights Bar */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>
              <strong className="text-white">{destinationCount}</strong> {destinationCount === 1 ? "Stop" : "Stops"}
            </span>
          </div>

          {trip.budgetLimit && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>
                Target Budget:{" "}
                <strong className="text-white">
                  {formatCurrency(trip.budgetLimit)}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
