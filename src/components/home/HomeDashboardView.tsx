import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Heart,
  Copy,
  UserPlus,
  Flame,
  Award,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Palmtree,
  Camera,
  Utensils,
  Mountain,
  Sun,
  Globe2,
  Search
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { TripCard } from '../trips/TripCard';
import { GlobiBanner } from '../mascot/GlobiBanner';
import { MOCK_DESTINATIONS } from '../../data/mockDestinations';
import { JoinRequestModal } from '../trips/JoinRequestModal';
import { Trip } from '../../types/travel';

export const HomeDashboardView: React.FC<{
  onOpenCreateTrip: () => void;
  onOpenOnboarding: () => void;
}> = ({ onOpenCreateTrip, onOpenOnboarding }) => {
  const { trips, currentUser, setCurrentView } = useTravel();
  const [selectedTripForJoin, setSelectedTripForJoin] = useState<Trip | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const myTrips = trips.filter(
    t => t.hostId === currentUser.id || t.members.some(m => m.userId === currentUser.id)
  );

  const openCommunityTrips = trips.filter(
    t => t.visibility === 'open_to_join' || t.visibility === 'public_view'
  );

  const categories = [
    { label: 'All Trips', icon: <Globe2 className="w-4 h-4" /> },
    { label: 'Beach', icon: <Palmtree className="w-4 h-4" /> },
    { label: 'Culture', icon: <Camera className="w-4 h-4" /> },
    { label: 'Mountains', icon: <Mountain className="w-4 h-4" /> },
    { label: 'Food & Wine', icon: <Utensils className="w-4 h-4" /> },
    { label: 'Luxury', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 animate-fadeIn">
      {/* Top Proactive Globi Companion Banner */}
      <GlobiBanner />

      {/* Clean Hero Search Banner (Airbnb Style) */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Social Travel Experience</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
              Where will you explore next, <span className="text-rose-500">{currentUser.name.split(' ')[0]}</span>?
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Plan custom itineraries with your AI companion Globi, discover verified community journeys, or join open squads with collaborative voting and real-time expense splitting.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenCreateTrip}
                className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Plan New Trip</span>
              </button>

              <button
                onClick={() => setCurrentView('discover')}
                className="px-5 py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-rose-500" />
                <span>Explore Squads</span>
              </button>

              <button
                onClick={onOpenOnboarding}
                className="px-3 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold underline underline-offset-4"
              >
                How it works
              </button>
            </div>
          </div>

          {/* Right Mascot Mini Widget */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 flex-shrink-0 w-full sm:w-80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm animate-globi-soft flex-shrink-0">
                <img src="/assets/globi_hero.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Globi Companion</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Ready to optimize plans</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
              "You have {myTrips.length} active journey{myTrips.length !== 1 ? 's' : ''} lined up. Check Day 3 Bali for open schedule slots!"
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{currentUser.travelStreakDays} Day Streak</span>
              </span>
              <button
                onClick={() => setCurrentView('profile')}
                className="text-rose-500 font-bold hover:underline"
              >
                View Passport →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Airbnb Category Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 border-b border-slate-200 dark:border-slate-800">
        {categories.map((cat, idx) => {
          const isSelected = (activeCategory === 'All' && idx === 0) || activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => {
                setActiveCategory(cat.label);
                if (idx !== 0) setCurrentView('discover');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Discover Section (Teaser into social layer) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                Community Feed
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                Open Community Trips
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hop into open traveler squads or clone itineraries into your personal plans
            </p>
          </div>

          <button
            onClick={() => setCurrentView('discover')}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 group"
          >
            <span>View All ({openCommunityTrips.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {openCommunityTrips.slice(0, 3).map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onRequestJoin={t => setSelectedTripForJoin(t)}
            />
          ))}
        </div>
      </div>

      {/* My Active Expeditions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              My Expeditions ({myTrips.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Collaborative itineraries, group chats, and Splitwise expense ledgers
            </p>
          </div>

          <button
            onClick={() => setCurrentView('trips')}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 group"
          >
            <span>Manage All Trips</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onRequestJoin={t => setSelectedTripForJoin(t)}
            />
          ))}
        </div>
      </div>

      {/* Curated Destinations Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Curated Destination Explorer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hand-picked spots with top weather, cultural heritage, and activities
            </p>
          </div>

          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 group"
          >
            <span>Explorer Database</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DESTINATIONS.slice(0, 3).map(dest => (
            <div
              key={dest.id}
              onClick={() => setCurrentView('catalog')}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 aspect-[16/11] cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
            >
              <img
                src={dest.coverImage}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white shadow-sm">
                  {dest.region}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                <h3 className="text-xl font-extrabold font-display drop-shadow">
                  {dest.city}, {dest.country}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-1">{dest.tagline}</p>
                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-rose-300">
                  <span>${dest.avgBudgetDaily} / day</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Explore Experiences →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={Boolean(selectedTripForJoin)}
        onClose={() => setSelectedTripForJoin(null)}
        trip={selectedTripForJoin}
      />
    </div>
  );
};
