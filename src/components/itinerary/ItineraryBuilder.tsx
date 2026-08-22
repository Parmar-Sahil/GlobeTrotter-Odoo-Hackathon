import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Sparkles,
  CloudSun,
  MapPin,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Lightbulb,
  Check
} from 'lucide-react';
import { Trip, ItineraryDay, ItineraryActivity } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { ActivityCard } from './ActivityCard';
import { AddActivityModal } from './AddActivityModal';

interface ItineraryBuilderProps {
  trip: Trip;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ trip }) => {
  const { currentUser, addActivity, triggerGlobiCelebration } = useTravel();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetModalDay, setTargetModalDay] = useState(1);

  const isHost = trip.hostId === currentUser.id;
  const days = trip.days || [];

  const getGlobiSuggestionChips = (dayNumber: number) => {
    if (trip.destination.toLowerCase().includes('bali')) {
      return [
        {
          text: '💡 Add Tegallalang Giant Jungle Swing ($15)',
          activity: {
            day: dayNumber,
            timeSlot: '03:00 PM',
            title: 'Tegallalang Giant Jungle Swing',
            location: 'Ubud Jungle Terraces',
            description: 'Fly high above the palm trees and emerald paddies for unforgettable photos.',
            category: 'adventure' as const,
            estimatedCost: 15,
            durationHours: 1.5,
            status: 'accepted' as const,
            globiTip: 'Globi says: Wear bright clothes for epic contrast in photos!'
          }
        },
        {
          text: '🥥 Add Organic Acai Bowls & Raw Food Lunch ($12)',
          activity: {
            day: dayNumber,
            timeSlot: '12:30 PM',
            title: 'Organic Acai Bowls & Raw Food Lunch',
            location: 'Alchemy Bali, Ubud',
            description: 'Fresh dragonfruit smoothies, raw vegan salad bar, and herbal tonics.',
            category: 'food' as const,
            estimatedCost: 12,
            durationHours: 1,
            status: 'accepted' as const
          }
        }
      ];
    }

    if (trip.destination.toLowerCase().includes('kyoto')) {
      return [
        {
          text: '⛩️ Add Gion Evening Tea House Walk ($25)',
          activity: {
            day: dayNumber,
            timeSlot: '06:00 PM',
            title: 'Gion Evening Lanterns & Tea House Walk',
            location: 'Gion Historic District, Kyoto',
            description: 'Stroll cobblestone alleys flanked by 17th century wooden machiya houses.',
            category: 'culture' as const,
            estimatedCost: 25,
            durationHours: 2,
            status: 'accepted' as const
          }
        }
      ];
    }

    return [
      {
        text: '📸 Add Golden Hour Viewpoint & Sunset Drinks ($18)',
        activity: {
          day: dayNumber,
          timeSlot: '06:00 PM',
          title: 'Panoramic Sunset Viewpoint & Cocktail Bar',
          location: `${trip.destination} Sky Terrace`,
          description: 'Relax after sightseeing with panoramic sunset views over the city.',
          category: 'relaxation' as const,
          estimatedCost: 18,
          durationHours: 2,
          status: 'accepted' as const
        }
      }
    ];
  };

  const handleApplyGlobiChip = (dayNum: number, activityData: any) => {
    addActivity(trip.id, dayNum, activityData);
    triggerGlobiCelebration();
  };

  const activeDay = days.find(d => d.dayNumber === selectedDayNumber) || days[0];

  return (
    <div className="space-y-6">
      {/* Day Selector Pills & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {Array.from({ length: trip.durationDays || days.length || 7 }, (_, i) => {
            const dayNum = i + 1;
            const isSelected = selectedDayNumber === dayNum;
            const dayActivities = days.find(d => d.dayNumber === dayNum)?.activities || [];
            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDayNumber(dayNum)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>Day {dayNum}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white font-extrabold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {dayActivities.length}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setTargetModalDay(selectedDayNumber);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 flex-shrink-0 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isHost ? 'Add Activity' : 'Propose Activity'}</span>
        </button>
      </div>

      {/* Active Day Card */}
      {activeDay && (
        <div className="space-y-4">
          {/* Day Header Banner with Weather Forecast */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-rose-500 text-white">
                  Day {activeDay.dayNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {activeDay.city || trip.destination}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {activeDay.highlights || 'Exciting day of exploration and local culture'}
              </p>
            </div>

            {/* Live Weather Forecast */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-lg">
                {activeDay.weatherForecast?.icon || '☀️'}
              </span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {activeDay.weatherForecast?.tempC || 28}°C • {activeDay.weatherForecast?.condition || 'Warm & Sunny'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Satellite AI forecast</p>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {activeDay.activities && activeDay.activities.length > 0 ? (
              activeDay.activities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  tripId={trip.id}
                  isHost={isHost}
                />
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3 shadow-sm">
                <Calendar className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No activities scheduled yet for Day {activeDay.dayNumber}.
                </p>
                <button
                  onClick={() => {
                    setTargetModalDay(activeDay.dayNumber);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold"
                >
                  + Add First Activity
                </button>
              </div>
            )}
          </div>

          {/* Globi Inline Suggestion Chips */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-teal-400 shadow-sm flex-shrink-0 bg-white dark:bg-slate-800">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <h5 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                Globi AI Suggestion Chips for Day {activeDay.dayNumber}
              </h5>
            </div>

            <div className="flex flex-wrap gap-2">
              {getGlobiSuggestionChips(activeDay.dayNumber).map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyGlobiChip(activeDay.dayNumber, chip.activity)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 border border-teal-200 dark:border-teal-700 text-xs text-slate-800 dark:text-slate-200 font-medium transition-all text-left flex items-center gap-2 group active:scale-95 shadow-sm"
                >
                  <span>{chip.text}</span>
                  <Plus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        trip={trip}
        initialDay={targetModalDay}
      />
    </div>
  );
};
