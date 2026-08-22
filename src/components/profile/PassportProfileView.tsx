import React from 'react';
import {
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Flame,
  Globe2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Plane,
  Heart
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { ALL_AVAILABLE_BADGES, PASSPORT_STAMPS } from '../../data/mockBadges';

export const PassportProfileView: React.FC = () => {
  const { currentUser, trips } = useTravel();

  const myTrips = trips.filter(
    t => t.hostId === currentUser.id || t.members.some(m => m.userId === currentUser.id)
  );

  const xpProgress = Math.min(100, Math.round((currentUser.xp / 1000) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header Profile Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-rose-500 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 p-1.5 bg-rose-500 text-white rounded-full">
                <Plane className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                  {currentUser.roleTitle}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{currentUser.homeCity}</span>
                </span>
                <span>•</span>
                <span>Level {currentUser.level} Traveler</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Travel XP Progress */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full sm:w-72 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Level {currentUser.level} Explorer</span>
              <span className="text-rose-500 font-extrabold">{currentUser.xp} / 1000 XP</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
              {1000 - currentUser.xp} XP to Level {currentUser.level + 1}
            </p>
          </div>
        </div>

        {/* Travel Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {currentUser.countriesVisited}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Countries Visited</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {myTrips.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Active Expeditions</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-2xl font-extrabold text-orange-500 font-display flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />
              <span>{currentUser.travelStreakDays}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Day Travel Streak</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
              {ALL_AVAILABLE_BADGES.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Badges Unlocked</p>
          </div>
        </div>
      </div>

      {/* Digital Passport Stamps Book */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Verified Digital Passport
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
            Country Entry Stamps ({PASSPORT_STAMPS.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Earn official digital passport stamps upon completing verified community and solo trips
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PASSPORT_STAMPS.map(stamp => (
            <div
              key={stamp.code}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-2 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl font-bold shadow-sm">
                {stamp.icon}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{stamp.country}</h4>
                <p className="text-[10px] text-slate-400">{stamp.city}</p>
                <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{stamp.date}</p>
              </div>

              <div className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1">
                {stamp.code} IMMIGRATION
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            Achievement Badges & Accolades
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gamified badges awarded for super hosting, active collaboration, and budget mastery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_AVAILABLE_BADGES.map(badge => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                {badge.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{badge.name}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">Requirement: {badge.requirement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
