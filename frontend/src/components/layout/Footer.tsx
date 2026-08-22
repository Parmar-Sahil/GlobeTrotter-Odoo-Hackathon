import React from "react";
import Link from "next/link";
import { Compass, Heart, Globe, Shield, MapPin } from "lucide-react";
import { BrandLogo } from "../common/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="sm" href="/" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Personalized multi-city travel planning, collaborative itinerary management, and smart budget tracking.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Planning
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-slate-600 hover:text-blue-600 transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link href="/trips/new" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Create Trip
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Curated Activities
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Sample Itineraries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              GlobeTrotter
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Crafted for modern travelers exploring the world seamlessly.
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> Multi-City
              </span>
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Real-time
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/explore" className="hover:text-slate-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
