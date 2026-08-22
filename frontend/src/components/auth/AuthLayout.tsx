"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ArrowLeft, Compass, Sparkles, MapPin, Shield } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  subheading?: string;
  heroImage?: string;
}

export function AuthLayout({
  children,
  heading,
  subheading,
  heroImage = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&auto=format&fit=crop&q=85",
}: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#FAF7F4] text-slate-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      {/* Left Column: Desktop Cinematic Travel Visual (Exactly 50% on Desktop) */}
      <div className="hidden lg:flex relative overflow-hidden bg-slate-950 text-white p-8 xl:p-12 flex-col justify-between min-h-screen">
        {/* Background Image with Depth Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={heroImage}
            alt="GlobTrottler Scenic Travel"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent" />
        </div>

        {/* Top Branding on Hero */}
        <div className="relative z-10">
          <BrandLogo size="md" variant="light" href="/" />
        </div>

        {/* Bottom Editorial Highlight on Hero */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-300 border border-white/10">
            <Compass className="w-3.5 h-3.5 text-[#F95724]" />
            Your Personalized Travel Planner
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Plan every step. <br />
            <span className="text-[#F95724]">Remember every moment.</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Join thousands of travelers designing multi-city routes, discovering hidden gems, and tracking budgets seamlessly.
          </p>

          <div className="flex items-center gap-6 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#F95724]" /> Multi-City Journeys
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Curated Activities
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Smart Budgeting
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Authentication Container (Exactly 50% on Desktop, 100% on Mobile) */}
      <div className="w-full flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto min-h-screen bg-[#FAF7F4]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between max-w-md w-full mx-auto pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors text-xs font-bold group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Logo on Mobile/Right */}
          <div className="lg:hidden">
            <BrandLogo size="sm" href="/" />
          </div>

          <div className="w-8" />
        </div>

        {/* Form Container Card */}
        <div className="max-w-md w-full mx-auto my-auto py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="bg-white rounded-3xl border border-orange-100/80 shadow-xl shadow-orange-950/5 p-6 sm:p-8 space-y-6"
          >
            {/* Form Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F95724] flex items-center justify-center mx-auto shadow-inner mb-3">
                <Compass className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {heading}
              </h1>
              {subheading && (
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {subheading}
                </p>
              )}
            </div>

            {/* Form Content */}
            {children}
          </motion.div>
        </div>

        {/* Footer Note */}
        <div className="max-w-md w-full mx-auto text-center pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} GlobTrottler. All rights reserved.
        </div>
      </div>
    </div>
  );
}
