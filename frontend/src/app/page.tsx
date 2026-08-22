"use client";

import React from "react";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { motion, useScroll, useSpring } from "framer-motion";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { PlanningSearch } from "@/components/landing/PlanningSearch";
import { TravelCategories } from "@/components/landing/TravelCategories";
import { DestinationShowcase } from "@/components/landing/DestinationShowcase";
import { ExperienceShowcase } from "@/components/landing/ExperienceShowcase";
import { MultiCityJourney } from "@/components/landing/MultiCityJourney";
import { ItineraryPreview } from "@/components/landing/ItineraryPreview";
import { BudgetPreview } from "@/components/landing/BudgetPreview";
import { TimelinePreview } from "@/components/landing/TimelinePreview";
import { TravelInspiration } from "@/components/landing/TravelInspiration";
import { ShareJourney } from "@/components/landing/ShareJourney";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <SmoothScrollProvider>
      {/* Minimal Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#F95724] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-orange-100 selection:text-orange-900">
        {/* 1. Floating Navbar */}
        <LandingNavbar />

        <main className="flex-1">
          {/* 2. Hero Section */}
          <Hero />

          {/* 3. Search / Start Planning Module */}
          <PlanningSearch />

          {/* 4. Travel Categories */}
          <TravelCategories />

          {/* 5. Destination Discovery */}
          <DestinationShowcase />

          {/* 6. Experience Discovery */}
          <ExperienceShowcase />

          {/* 7. Multi-City Journey & Route */}
          <MultiCityJourney />

          {/* 8. Itinerary Preview (Day 3 Goa) */}
          <ItineraryPreview />

          {/* 9. Budget Preview */}
          <BudgetPreview />

          {/* 10. Calendar / Timeline Preview */}
          <TimelinePreview />

          {/* 11. Travel Inspiration */}
          <TravelInspiration />

          {/* 12. Share Your Journey */}
          <ShareJourney />

          {/* 13. Final CTA */}
          <FinalCTA />
        </main>

        {/* 14. Footer */}
        <LandingFooter />
      </div>
    </SmoothScrollProvider>
  );
}
