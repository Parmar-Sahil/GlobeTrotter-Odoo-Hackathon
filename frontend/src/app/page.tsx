import Link from "next/link";
import { Compass } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            GlobeTrotter
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Personalized Travel Planning
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
