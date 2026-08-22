"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  PlusCircle,
  User,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Trips", href: "/trips", icon: MapPin },
    { name: "Plan", href: "/trips/new", icon: PlusCircle, isSpecial: true },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-orange-200/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (item.isSpecial) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="p-3 bg-[#7C2D12] rounded-full text-white shadow-lg shadow-orange-950/30 hover:bg-[#9A3412] active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#7C2D12] mt-1">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? "text-[#7C2D12] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-[#7C2D12]" : "text-slate-400"
                }`}
              />
              <span className="text-[10px] mt-0.5 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
