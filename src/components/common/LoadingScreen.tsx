import React, { useState, useEffect } from 'react';
import { Sparkles, Plane, Cloud, MapPin } from 'lucide-react';
import { BrandPlaneIcon } from './BrandLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
  message?: string;
}

const LOADING_TIPS = [
  'Plotting optimal scenic travel routes...',
  'Globi is curating local hidden gems...',
  'Checking satellite weather forecasts...',
  'Syncing Splitwise group ledger balances...',
  'Assembling your collaborative squad...',
  'Stamping your digital explorer passport...',
  'Ready for takeoff!'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 2200,
  message
}) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const intervalMs = 25;
    const step = 100 / (minDurationMs / intervalMs);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 400);
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, [minDurationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-[#0B0F17] transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambience & Soft Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F2541B]/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-10 left-10 text-slate-200 dark:text-slate-800/40 animate-pulse">
          <Cloud className="w-32 h-32" />
        </div>
        <div className="absolute top-10 right-10 text-slate-200 dark:text-slate-800/40 animate-pulse [animation-delay:1s]">
          <Cloud className="w-24 h-24" />
        </div>
      </div>

      {/* Main Center Animation Stage */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Animated Flight Stage */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Radar Waves / Pulse Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#F2541B]/20 animate-ping [animation-duration:2.5s]" />
          <div className="absolute inset-3 rounded-full border border-[#F2541B]/30 animate-pulse" />

          {/* Ascending Plane Icon with Soft Float Animation */}
          <div className="relative z-10 animate-flight">
            <BrandPlaneIcon size={88} className="shadow-brand-lg" />
          </div>

          {/* Floating Clouds / Sparks */}
          <div className="absolute -bottom-2 -left-2 p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 animate-bounce [animation-delay:0.3s]">
            <Sparkles className="w-4 h-4 text-[#F2541B]" />
          </div>
          <div className="absolute -top-1 -right-2 p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 animate-bounce [animation-delay:0.7s]">
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Glob<span className="text-[#F2541B]">Trottler</span>
          </h2>
          <p className="text-xs font-semibold text-[#F2541B] tracking-wider uppercase">
            Social Travel Companion
          </p>
        </div>

        {/* Dynamic Tip Text */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium transition-all duration-300 animate-fadeIn">
            {message || LOADING_TIPS[tipIndex]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-56 space-y-1.5">
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F2541B] via-orange-500 to-amber-400 transition-all duration-75 shadow-sm"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
            <span>FLIGHT READY</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
