"use client";

import React from "react";
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
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-orange-100 selection:text-orange-900">
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
        <div id="destinations">
          <DestinationShowcase />
        </div>

        {/* 6. Experience Discovery */}
        <div id="experiences">
          <ExperienceShowcase />
        </div>

        {/* 7. Multi-City Journey & Route */}
        <div id="journey">
          <MultiCityJourney />
        </div>

        {/* 8. Itinerary Preview (Day 3 Goa) */}
        <ItineraryPreview />

        {/* 9. Budget Preview */}
        <BudgetPreview />

        {/* 10. Calendar / Timeline Preview */}
        <TimelinePreview />

        {/* 11. Travel Inspiration */}
        <div id="inspiration">
          <TravelInspiration />
        </div>

        {/* 12. Share Your Journey */}
        <ShareJourney />

        {/* 13. Final CTA */}
        <FinalCTA />
      </main>

      {/* 14. Footer */}
      <LandingFooter />
    </div>
  );
}
