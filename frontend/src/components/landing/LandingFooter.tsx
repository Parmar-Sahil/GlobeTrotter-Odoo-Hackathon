import React from "react";
import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";

export function LandingFooter() {
  return (
    <footer className="bg-[#FAF7F2] border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <BrandLogo size="md" href="/" />
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Personalized multi-city travel planning, collaborative itinerary management, and smart budget tracking.
            </p>
            <p className="text-xs font-bold text-[#7C2D12]">
              Plan beautifully. Travel freely.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="#destinations" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#experiences" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  Experiences
                </a>
              </li>
              <li>
                <a href="#journey" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#inspiration" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  Inspiration
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/login" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-slate-600 hover:text-[#7C2D12] transition-colors">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Connect */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
              Connect & Support
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <span className="text-slate-600 hover:text-[#7C2D12] cursor-pointer transition-colors">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-slate-600 hover:text-[#7C2D12] cursor-pointer transition-colors">
                  Contact Support
                </span>
              </li>
              <li className="pt-2 flex items-center gap-4 text-slate-500">
                <span className="hover:text-slate-900 cursor-pointer font-bold">Instagram</span>
                <span className="hover:text-slate-900 cursor-pointer font-bold">X</span>
                <span className="hover:text-slate-900 cursor-pointer font-bold">LinkedIn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-100/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GlobTrottler. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
