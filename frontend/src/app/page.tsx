import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
  Share2,
} from "lucide-react";

export default function HomePage() {
  const featureList = [
    {
      title: "Multi-City Itinerary Builder",
      description:
        "Easily sequence travel stops across countries and assign arrival and departure dates seamlessly.",
      icon: MapPin,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Activity & Tour Scheduling",
      description:
        "Discover and schedule curated sightseeing, food & drink, and adventure experiences with exact durations and costs.",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Visual Budget & Expense Breakdown",
      description:
        "Track total estimated costs against budget targets with categorized breakdowns and over-budget warnings.",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Interactive Timeline & Calendar",
      description:
        "Visualize your full journey chronologically with day-by-day activity blocks and daily cost tallies.",
      icon: Calendar,
      color: "from-purple-600 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10 shadow-inner">
              <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span>Odoo Hackathon Travel Planner</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Globe<span className="text-blue-500">Trotter</span>
              </h1>
              <p className="text-xl sm:text-2xl text-blue-200 font-semibold tracking-tight">
                Personalized Travel Planning
              </p>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
                Design custom multi-city journeys, discover top activities, organize day-by-day schedules, and track your travel budget with precision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-100"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all shadow-xs"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid Highlights */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Crafted for Modern Explorers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Everything you need to turn travel dreams into structured, unforgettable itineraries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureList.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Ready to embark on your next trip?
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl mx-auto leading-relaxed">
              Create your itinerary in minutes, add multi-city stops, schedule exciting tours, and stay within your budget.
            </p>
            <div className="pt-2">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                Plan Your Itinerary Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
