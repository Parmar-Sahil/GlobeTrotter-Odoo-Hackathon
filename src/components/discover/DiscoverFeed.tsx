import React, { useState } from 'react';
import {
  Compass,
  Search,
  SlidersHorizontal,
  Filter,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Plus
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { TripCard } from '../trips/TripCard';
import { JoinRequestModal } from '../trips/JoinRequestModal';
import { Trip } from '../../types/travel';
import { GlobiBanner } from '../mascot/GlobiBanner';

const FILTER_TAGS = [
  'All',
  'Open to Join 🚀',
  'Culture',
  'Adventure',
  'Food & Wine',
  'Beach',
  'Luxury',
  'Nature',
  'Wellness',
  'Hiking'
];

export const DiscoverFeed: React.FC<{ onOpenCreateTrip: () => void }> = ({ onOpenCreateTrip }) => {
  const { trips, setCurrentView } = useTravel();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [onlyJoinable, setOnlyJoinable] = useState(false);
  const [budgetTier, setBudgetTier] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');
  const [selectedTripForJoin, setSelectedTripForJoin] = useState<Trip | null>(null);

  const publicTrips = trips.filter(
    t => t.visibility === 'public_view' || t.visibility === 'open_to_join' || t.visibility === 'friends'
  );

  const filteredTrips = publicTrips.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.country.toLowerCase().includes(search.toLowerCase()) ||
      t.hostName.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (selectedTag === 'Open to Join 🚀') {
      const spotsLeft = (t.maxSpots || 4) - t.members.length;
      if (t.visibility !== 'open_to_join' || spotsLeft <= 0) return false;
    } else if (selectedTag !== 'All') {
      if (!t.tags.includes(selectedTag)) return false;
    }

    if (onlyJoinable) {
      const spotsLeft = (t.maxSpots || 4) - t.members.length;
      if (t.visibility !== 'open_to_join' || spotsLeft <= 0) return false;
    }

    if (budgetTier === 'budget' && t.totalBudget >= 1200) return false;
    if (budgetTier === 'mid' && (t.totalBudget < 1200 || t.totalBudget > 2500)) return false;
    if (budgetTier === 'luxury' && t.totalBudget <= 2500) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      <GlobiBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Community Journeys Feed
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {filteredTrips.length} Trips Discovered
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mt-2">
            Discover Real Travel Plans. <span className="text-rose-500">Join or Clone.</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Browse itineraries crafted by travelers worldwide. Tap "Request to Join" open groups with available spots, or clone any plan directly into your personal trips with one click.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Publish Your Trip</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by destination (Bali, Kyoto, Amalfi), country or host..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Budget Tier Select */}
          <select
            value={budgetTier}
            onChange={e => setBudgetTier(e.target.value as any)}
            className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Budget Tiers</option>
            <option value="budget">Budget ($ &lt; $1.2k)</option>
            <option value="mid">Mid-Range ($$ $1.2k - $2.5k)</option>
            <option value="luxury">Luxury ($$$ &gt; $2.5k)</option>
          </select>

          {/* Quick Toggle: Open to Join Only */}
          <button
            onClick={() => setOnlyJoinable(!onlyJoinable)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              onlyJoinable
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Open Squads Only</span>
          </button>
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3 shadow-sm">
          <Compass className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No trips match your filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try clearing your search query or selecting "All" to browse all community itineraries.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedTag('All');
              setOnlyJoinable(false);
              setBudgetTier('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onRequestJoin={t => setSelectedTripForJoin(t)}
            />
          ))}
        </div>
      )}

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={Boolean(selectedTripForJoin)}
        onClose={() => setSelectedTripForJoin(null)}
        trip={selectedTripForJoin}
      />
    </div>
  );
};
