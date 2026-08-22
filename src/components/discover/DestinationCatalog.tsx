import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Compass,
  ArrowRight,
  Plus,
  Check
} from 'lucide-react';
import { MOCK_DESTINATIONS } from '../../data/mockDestinations';
import { DestinationCatalogItem } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

export const DestinationCatalog: React.FC<{ onOpenCreateTrip: () => void }> = ({ onOpenCreateTrip }) => {
  const { trips, activeTrip, addActivity, triggerGlobiCelebration, setCurrentView } = useTravel();

  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<DestinationCatalogItem | null>(null);

  const regions = ['All', 'Southeast Asia', 'East Asia', 'Southern Europe', 'Central Europe', 'South Asia', 'Northern Europe'];

  const filtered = MOCK_DESTINATIONS.filter(d => {
    if (selectedRegion === 'All') return true;
    return d.region === selectedRegion;
  });

  const handleAddFeaturedActivity = (activity: DestinationCatalogItem['featuredActivities'][0]) => {
    if (!activeTrip) {
      alert('Please create or select an active trip first!');
      return;
    }
    addActivity(activeTrip.id, 1, {
      day: 1,
      timeSlot: '11:00 AM',
      title: activity.title,
      location: selectedDestination ? `${selectedDestination.city}, ${selectedDestination.country}` : activeTrip.destination,
      description: `Curated activity from GlobeTrotter Explorer catalog. Estimated duration: ${activity.duration}.`,
      category: activity.category,
      estimatedCost: activity.cost,
      durationHours: 3,
      status: 'accepted'
    });
    triggerGlobiCelebration();
    setCurrentView('itinerary', activeTrip.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              World Explorer Database
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curated Destinations & Top Experiences</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mt-2">
            Explore Iconic Cities & <span className="text-rose-500">Experiences</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Browse world-class destinations, check best travel seasons, average daily budgets, and add top-rated activities directly into your itinerary.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Plan Custom Destination</span>
        </button>
      </div>

      {/* Region Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {regions.map(r => (
          <button
            key={r}
            onClick={() => setSelectedRegion(r)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedRegion === r
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(dest => (
          <div
            key={dest.id}
            className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Cover */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={dest.coverImage}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-white shadow-sm">
                  {dest.region}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-extrabold shadow-sm">
                  <Star className="w-3 h-3 fill-white" />
                  {dest.rating}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display font-extrabold text-xl drop-shadow">
                  {dest.city}, {dest.country}
                </h3>
                <p className="text-xs text-rose-300 line-clamp-1 font-medium">{dest.tagline}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">Avg Daily Budget</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${dest.avgBudgetDaily} / day</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">Best Season</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{dest.bestTimeToVisit}</span>
                  </div>
                </div>

                {/* Match Tags */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {dest.matchTags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedDestination(dest)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View {dest.featuredActivities.length} Featured Experiences</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Experiences Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                  Top Experiences in {selectedDestination.city}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">1-click add to your active trip itinerary</p>
              </div>
              <button
                onClick={() => setSelectedDestination(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-2.5 flex-1 bg-white dark:bg-slate-900">
              {selectedDestination.featuredActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      {act.category}
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{act.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Duration: {act.duration} • <strong className="text-emerald-600 dark:text-emerald-400">${act.cost}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddFeaturedActivity(act)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1 flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add to Trip</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
