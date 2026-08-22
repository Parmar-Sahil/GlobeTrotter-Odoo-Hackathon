import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Copy,
  UserPlus,
  MessageSquare,
  Sparkles,
  Star
} from 'lucide-react';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface TripCardProps {
  trip: Trip;
  onRequestJoin?: (trip: Trip) => void;
  onShare?: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onRequestJoin }) => {
  const { currentUser, setCurrentView, cloneTrip, toggleLikeTrip } = useTravel();

  const isHost = trip.hostId === currentUser.id;
  const isMember = trip.members.some(m => m.userId === currentUser.id);
  const hasPendingRequest = trip.joinRequests?.some(
    r => r.userId === currentUser.id && r.status === 'pending'
  );
  const spotsLeft = (trip.maxSpots || 4) - trip.members.length;
  const isOpenToJoin = trip.visibility === 'open_to_join' && spotsLeft > 0;

  const getVisibilityBadge = () => {
    switch (trip.visibility) {
      case 'open_to_join':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{spotsLeft > 0 ? `${spotsLeft} Spots Open` : 'Full Squad'}</span>
          </span>
        );
      case 'public_view':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-sm">
            Public Itinerary
          </span>
        );
      case 'friends':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-sm">
            Friends Only
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700 text-white shadow-sm">
            Private Plan
          </span>
        );
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-all duration-200">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {getVisibilityBadge()}

          <button
            onClick={e => {
              e.stopPropagation();
              toggleLikeTrip(trip.id);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-white text-xs font-semibold backdrop-blur-md shadow-sm transition-all active:scale-90"
          >
            <Heart className="w-3.5 h-3.5 text-[#F2541B] fill-[#F2541B]" />
            <span>{trip.likesCount}</span>
          </button>
        </div>

        {/* Destination bottom pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 font-bold drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{trip.destination}, {trip.country}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-medium">
            {trip.durationDays} Days
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Trip Title & Star Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => setCurrentView('trip-detail', trip.id)}
              className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-[#F2541B] transition-colors cursor-pointer line-clamp-1"
            >
              {trip.title}
            </h3>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.95</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {trip.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {trip.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Host & Squad Avatars */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={trip.hostAvatar}
              alt={trip.hostName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <p className="text-[10px] text-slate-400 leading-none">Hosted by</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {trip.hostName.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Member Avatars */}
          <div className="flex items-center -space-x-1.5">
            {trip.members.map((m, idx) => (
              <img
                key={idx}
                src={m.avatar}
                alt={m.name}
                title={m.name}
                className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
            ))}
            {trip.visibility === 'open_to_join' && spotsLeft > 0 && (
              <div
                title={`${spotsLeft} open spots remaining`}
                className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-[10px] text-emerald-700 dark:text-emerald-300 font-bold"
              >
                +{spotsLeft}
              </div>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 space-y-2.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Budget</span>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {trip.currency} {trip.totalBudget.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                / {trip.durationDays} days
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCurrentView('trip-detail', trip.id)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors text-center"
            >
              View Plan
            </button>

            {isMember ? (
              <button
                onClick={() => setCurrentView('chat', trip.id)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Group Chat</span>
              </button>
            ) : hasPendingRequest ? (
              <button
                disabled
                className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold text-xs cursor-default text-center"
              >
                Requested
              </button>
            ) : isOpenToJoin ? (
              <button
                onClick={() => onRequestJoin && onRequestJoin(trip)}
                className="w-full py-2 px-3 rounded-xl bg-[#F2541B] hover:bg-[#d9440f] text-white font-bold text-xs shadow-brand transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Squad</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const cloned = cloneTrip(trip.id);
                  setCurrentView('trip-detail', cloned.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clone</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
