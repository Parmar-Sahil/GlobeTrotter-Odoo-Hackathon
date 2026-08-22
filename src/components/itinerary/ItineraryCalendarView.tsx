import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { Trip } from '../../types/travel';

export const ItineraryCalendarView: React.FC<{ trip: Trip }> = ({ trip }) => {
  const days = trip.days || [];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Timeline Calendar</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sequential chronological flow of your journey</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          {trip.durationDays} Days Planned
        </span>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {days.map(day => (
          <div key={day.dayNumber} className="relative pl-8 space-y-3">
            {/* Timeline Dot */}
            <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-rose-500 border-4 border-white dark:border-slate-900 shadow-sm" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-rose-500 uppercase tracking-wider">Day {day.dayNumber}</span>
                <span className="text-xs text-slate-400">•</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{day.city || trip.destination}</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{day.highlights}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {day.activities.map(act => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{act.timeSlot}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">{act.location}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="capitalize">{act.category}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${act.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
