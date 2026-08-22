import React from 'react';
import { Sparkles, Globe2, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { BrandLogo, BrandPlaneIcon } from '../common/BrandLogo';

export const Footer: React.FC<{ onOpenOnboarding: () => void }> = ({ onOpenOnboarding }) => {
  const { setCurrentView } = useTravel();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" />
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The modern social travel platform. Plan custom journeys with your AI companion Globi, discover public community itineraries, vote on group activities, and split expenses effortlessly.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#F2541B] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Globi AI Companion</span>
              </span>
              <button
                onClick={onOpenOnboarding}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4"
              >
                How it works
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('discover')} className="hover:text-[#F2541B] dark:hover:text-white transition-colors">
                  Community Feed
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('catalog')} className="hover:text-[#F2541B] dark:hover:text-white transition-colors">
                  Destination Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('trips')} className="hover:text-[#F2541B] dark:hover:text-white transition-colors">
                  My Trip Hub
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('profile')} className="hover:text-[#F2541B] dark:hover:text-white transition-colors">
                  Traveler Passport
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Social Layer</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Open / Joinable Trips</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2541B]" />
                <span>Group Chat & Live Polls</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Collaborative Voting</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Splitwise Group Balances</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 GlobTrottler Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Plan alone, but travel isn't lonely</span>
            <span>•</span>
            <span className="text-[#F2541B] font-semibold flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> 140+ Destinations Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
