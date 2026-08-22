import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "GlobeTrotter - Personalized Travel Planning",
  description: "Create and customize multi-city trips, itineraries, budgets, and discover destinations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
