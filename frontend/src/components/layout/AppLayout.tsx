import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function AppLayout({ children, hideFooter = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      {!hideFooter && <Footer />}
      <MobileNav />
    </div>
  );
}
