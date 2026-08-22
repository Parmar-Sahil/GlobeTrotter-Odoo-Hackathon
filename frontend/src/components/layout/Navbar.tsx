"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "../common/BrandLogo";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  User,
  LogOut,
  Plus,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Discover", href: "/explore?tab=discover", icon: Sparkles },
    { name: "My Trips", href: "/trips", icon: MapPin },
  ];

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-orange-100/90 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="shrink-0 flex items-center">
            <BrandLogo size="md" href="/dashboard" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-100 shadow-xs space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#7C2D12] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#7C2D12] hover:bg-orange-50/70"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-sm shadow-orange-950/20 transition-all hover:scale-103 active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Plan New Trip
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-orange-100 hover:border-orange-200 hover:bg-orange-50/60 transition-colors focus:outline-hidden"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F95724] text-white flex items-center justify-center font-extrabold text-xs uppercase shadow-2xs">
                    {user?.firstName?.[0] || user?.username?.[0] || "T"}
                  </div>
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate pr-1">
                    {user?.firstName || user?.username || "Traveler"}
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-xl border border-orange-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-orange-100/70">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {user?.firstName
                            ? `${user.firstName} ${user?.lastName || ""}`
                            : user?.username}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate font-medium">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#7C2D12] transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile & Settings
                      </Link>

                      <Link
                        href="/trips"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#7C2D12] transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        My Itineraries
                      </Link>

                      <div className="border-t border-orange-100/70 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#7C2D12] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#7C2D12] hover:bg-[#9A3412] rounded-full transition-all shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/trips/new"
              className="p-2 rounded-full bg-[#7C2D12] text-white shadow-xs"
              aria-label="New Trip"
            >
              <Plus className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-orange-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-orange-100 bg-[#FAF7F2] px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold ${
                  isActive
                    ? "bg-[#7C2D12] text-white"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}

          <div className="border-t border-orange-100 pt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-white"
                >
                  <User className="w-4 h-4 text-[#F95724]" />
                  Profile ({user?.username || "Account"})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-slate-700 bg-white rounded-full border border-orange-100"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#7C2D12] rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
