import React, { useState } from 'react';
import {
  Compass,
  Users,
  Sparkles,
  ArrowRight,
  Check,
  X,
  MapPin,
  DollarSign,
  Vote
} from 'lucide-react';

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Meet Globi, Your AI Travel Companion',
      badge: 'Proactive Intelligence',
      image: '/assets/globi_hero.jpg',
      description:
        'Globi is not just a passive chatbot. Globi proactively detects open gaps in your itinerary, warns you when spending exceeds category budgets, and suggests hidden gems!'
    },
    {
      title: 'Discover & Join Real Travel Squads',
      badge: 'Social & Collaborative Layer',
      image: '/assets/dest_bali.jpg',
      description:
        'Browse open community expeditions. Send a request to join open spots, get approved by the host, and collaborate on activities with live thumbs-up/down voting.'
    },
    {
      title: 'Splitwise-Style Group Balances & Polls',
      badge: 'Effortless Group Sync',
      image: '/assets/globi_budget.jpg',
      description:
        'Record shared expenses, calculate exact bilateral net debts, settle up with one tap, and run live group decision polls inside your trip chat room.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        {/* Slide Visual */}
        <div className="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500 text-white">
              {slides[currentSlide].badge}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1 bg-white dark:bg-slate-900">
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            {slides[currentSlide].title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {slides[currentSlide].description}
          </p>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-rose-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Next Feature</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Exploring GlobeTrotter</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
