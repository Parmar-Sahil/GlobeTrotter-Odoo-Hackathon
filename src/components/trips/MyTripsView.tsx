import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Crown,
  Users,
  Copy,
  Calendar,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { TripCard } from './TripCard';
import { GlobiBanner } from '../mascot/GlobiBanner';

export const MyTripsView: React.FC<{ onOpenCreateTrip: () => void }> = ({ onOpenCreateTrip }) => {
  const { trips, currentUser, setCurrentView } = useTravel();
  const [filterTab, setFilterTab] = useState<'all' | 'hosting' | 'joined' | 'cloned'>('all');
  const [search, setSearch] = useState('');

  const hostingTrips = trips.filter(t => t.hostId === currentUser.id && !t.isCloned);
  const joinedTrips = trips.filter(
    t => t.hostId !== currentUser.id && t.members.some(m => m.userId === currentUser.id)
  );
  const clonedTrips = trips.filter(t => t.isCloned && t.hostId === currentUser.id);

  const getFilteredList = () => {
    let list = trips;
    if (filterTab === 'hosting') list = hostingTrips;
    else if (filterTab === 'joined') list = joinedTrips;
    else if (filterTab === 'cloned') list = clonedTrips;
    else {
      list = trips.filter(
        t => t.hostId === currentUser.id || t.members.some(m => m.userId === currentUser.id)
      );
    }

    if (search.trim()) {
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.destination.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  };

  const displayedTrips = getFilteredList();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      <GlobiBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Trip Hub
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {hostingTrips.length} Hosting • {joinedTrips.length} Joined
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mt-2">
            My Travel Expeditions & <span className="text-rose-500">Squads</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mt-1 leading-relaxed">
            Manage trips you are hosting, access group chats for squads you joined, and customize your cloned itineraries.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Journeys ({trips.filter(t => t.hostId === currentUser.id || t.members.some(m => m.userId === currentUser.id)).length})
          </button>

          <button
            onClick={() => setFilterTab('hosting')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === 'hosting'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Hosting ({hostingTrips.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('joined')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === 'joined'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Joined ({joinedTrips.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('cloned')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === 'cloned'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Cloned ({clonedTrips.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search my trips..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {displayedTrips.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3 shadow-sm">
          <Compass className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No trips in this view</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {filterTab === 'joined'
              ? 'You have not joined any group trips yet. Head over to Discover to find open squads!'
              : filterTab === 'cloned'
              ? 'You have not cloned any public itineraries yet.'
              : 'Create a new dream trip or browse the Discover feed for inspiration.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('discover')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              Browse Community Feed
            </button>
            <button
              onClick={onOpenCreateTrip}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm"
            >
              + Create Trip
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};
