"use client";

import React, { useState } from "react";
import { Trip } from "@/types";
import { useTripMutations } from "@/hooks/use-trips";
import {
  Globe,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Share2,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface ShareTripModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareTripModal({ trip, isOpen, onClose }: ShareTripModalProps) {
  const { updateTrip, isUpdating } = useTripMutations(trip.id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isPublic = trip.visibility === "PUBLIC";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicShareUrl = `${origin}/shared/${trip.id}`;

  const handleToggleVisibility = async () => {
    await updateTrip({
      id: trip.id,
      data: {
        visibility: isPublic ? "PRIVATE" : "PUBLIC",
      },
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${trip.title} - GlobeTrotter Itinerary`,
          text: `Check out this travel itinerary: ${trip.title}`,
          url: publicShareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-100/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#F95724] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Share Trip Itinerary
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Public read-only link with full schedule details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visibility Status Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isPublic
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : "bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {isPublic ? (
                <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold">
                  {isPublic ? "Public Sharing Enabled" : "Private Trip (Only You)"}
                </p>
                <p className="text-[11px] text-slate-500 font-normal">
                  {isPublic
                    ? "Anyone with this link can view the read-only itinerary."
                    : "Only you can see this trip when signed into your account."}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isUpdating}
              onClick={handleToggleVisibility}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 shrink-0 ${
                isPublic
                  ? "bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60"
                  : "bg-[#7C2D12] text-white hover:bg-[#9A3412]"
              }`}
            >
              {isUpdating
                ? "Updating..."
                : isPublic
                ? "Make Private"
                : "Enable Public Link"}
            </button>
          </div>
        </div>

        {/* Share Link Input & Actions */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Public Itinerary URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicShareUrl}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Info */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-orange-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-[#7C2D12]">
            <ShieldCheck className="w-4 h-4 text-[#F95724]" />
            <span>Read-Only & Copy Enabled</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Travelers viewing this link can browse the timeline, day schedule, and stops in read-only mode, and click <strong>Copy This Trip</strong> to duplicate it to their own account.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <a
            href={publicShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C2D12] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Preview Public Page
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
