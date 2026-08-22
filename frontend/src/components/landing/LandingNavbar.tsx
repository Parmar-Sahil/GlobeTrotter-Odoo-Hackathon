"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "../common/BrandLogo";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "#destinations" },
    { name: "Experiences", href: "#experiences" },
    { name: "How It Works", href: "#journey" },
    { name: "Inspiration", href: "#inspiration" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-orange-100/80 py-3 shadow-xs"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <BrandLogo size="md" href="/" variant={isScrolled ? "dark" : "auto"} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-100/80 shadow-xs space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#7C2D12] hover:bg-orange-50/80 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#7C2D12] transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/15 transition-all hover:scale-103 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Plan My Trip
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/trips/new"
              className="px-3.5 py-1.5 rounded-full bg-[#7C2D12] text-white text-xs font-bold shadow-xs"
            >
              Plan Trip
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-orange-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF7F2] border-b border-orange-200 px-4 pt-3 pb-6 space-y-3 overflow-hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-800 hover:bg-white hover:text-[#7C2D12] transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="border-t border-orange-100 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-slate-700 bg-white rounded-2xl border border-orange-100"
              >
                Log In
              </Link>
              <Link
                href="/trips/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#7C2D12] rounded-2xl shadow-md shadow-orange-950/20"
              >
                Plan My Trip
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
