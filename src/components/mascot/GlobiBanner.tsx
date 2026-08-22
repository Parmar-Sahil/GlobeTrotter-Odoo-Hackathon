import React from 'react';
import { Sparkles, X, ArrowRight, Lightbulb, AlertTriangle, PartyPopper } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export const GlobiBanner: React.FC = () => {
  const { globiTip, dismissGlobiTip, setCurrentView } = useTravel();

  if (!globiTip) return null;

  const getMascotImage = () => {
    switch (globiTip.type) {
      case 'suggestion':
        return '/assets/globi_idea.jpg';
      case 'budget_alert':
        return '/assets/globi_budget.jpg';
      case 'celebration':
        return '/assets/globi_celebrate.jpg';
      default:
        return '/assets/globi_hero.jpg';
    }
  };

  const handleAction = () => {
    if (globiTip.type === 'budget_alert') {
      setCurrentView('budget', globiTip.targetTripId);
    } else if (globiTip.actionLabel?.includes('Chat')) {
      setCurrentView('chat', globiTip.targetTripId);
    } else if (globiTip.actionLabel?.includes('Discover')) {
      setCurrentView('discover');
    } else if (globiTip.actionLabel?.includes('Analytics')) {
      setCurrentView('admin');
    } else if (globiTip.targetTripId) {
      setCurrentView('trip-detail', globiTip.targetTripId);
    } else {
      setCurrentView('discover');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side: Mascot Avatar + Text */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm animate-globi-soft">
              <img
                src={getMascotImage()}
                alt="Globi Companion"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-teal-500 text-white rounded-full text-xs font-bold shadow-sm">
              {globiTip.type === 'suggestion' && <Lightbulb className="w-3 h-3" />}
              {globiTip.type === 'budget_alert' && <AlertTriangle className="w-3 h-3" />}
              {globiTip.type === 'celebration' && <PartyPopper className="w-3 h-3" />}
              {globiTip.type === 'nudge' && <Sparkles className="w-3 h-3" />}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Globi AI Nudge
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                {globiTip.title}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {globiTip.message}
            </p>
          </div>
        </div>

        {/* Right side: Action Button & Dismiss */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {globiTip.actionLabel && (
            <button
              onClick={handleAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <span>{globiTip.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={dismissGlobiTip}
            title="Dismiss tip"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
