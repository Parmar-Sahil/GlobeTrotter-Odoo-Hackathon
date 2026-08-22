import React from 'react';
import {
  Clock,
  MapPin,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  CheckCircle,
  Trash2,
  Utensils,
  Camera,
  Compass,
  Bed,
  Palmtree,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ItineraryActivity, ActivityCategory } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface ActivityCardProps {
  activity: ItineraryActivity;
  tripId: string;
  isHost: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, tripId, isHost }) => {
  const { currentUser, voteOnActivity, acceptProposedActivity, deleteActivity } = useTravel();

  const votes = activity.votes || [];
  const upVotes = votes.filter(v => v.vote === 'up');
  const downVotes = votes.filter(v => v.vote === 'down');
  const myVote = votes.find(v => v.userId === currentUser.id)?.vote;

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-rose-500" />;
      case 'sightseeing':
        return <Camera className="w-3.5 h-3.5 text-amber-500" />;
      case 'adventure':
        return <Compass className="w-3.5 h-3.5 text-blue-500" />;
      case 'stay':
        return <Bed className="w-3.5 h-3.5 text-indigo-500" />;
      case 'relaxation':
        return <Palmtree className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  const getCategoryBadgeClass = (category: ActivityCategory) => {
    switch (category) {
      case 'food':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'sightseeing':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'adventure':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'stay':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'relaxation':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
    }
  };

  return (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
        activity.isProposal
          ? 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-200 dark:border-blue-800/60 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Meta: Time + Category + Booked Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{activity.timeSlot}</span>
          </span>

          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getCategoryBadgeClass(
              activity.category
            )}`}
          >
            {getCategoryIcon(activity.category)}
            <span>{activity.category}</span>
          </span>

          {activity.booked && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Booked</span>
            </span>
          )}
        </div>

        {/* Cost & Duration */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>{activity.durationHours} hrs</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">${activity.estimatedCost}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1 my-2">
        <h4 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center justify-between">
          <span>{activity.title}</span>
          {isHost && (
            <button
              onClick={() => deleteActivity(tripId, activity.id)}
              className="hover:text-rose-500 p-1 text-slate-400 dark:text-slate-500 transition-colors"
              title="Remove activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </h4>

        <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span>{activity.location}</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
          {activity.description}
        </p>
      </div>

      {/* Contextual Globi Tip if present */}
      {activity.globiTip && (
        <div className="mt-3 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center gap-2 text-xs text-teal-800 dark:text-teal-200">
          <img src="/assets/globi_hero.jpg" alt="Globi" className="w-5 h-5 rounded-full object-cover border border-teal-400" />
          <span className="font-medium">{activity.globiTip}</span>
        </div>
      )}

      {/* Co-Traveler Proposal Banner & Voting */}
      {activity.isProposal && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Proposal
            </span>
            {activity.proposedBy && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <img
                  src={activity.proposedBy.userAvatar}
                  alt={activity.proposedBy.userName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                />
                <span>Proposed by {activity.proposedBy.userName.split(' ')[0]}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => voteOnActivity(tripId, activity.id, 'up')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                myVote === 'up'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upVotes.length}</span>
            </button>

            <button
              onClick={() => voteOnActivity(tripId, activity.id, 'down')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                myVote === 'down'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{downVotes.length}</span>
            </button>

            {isHost && (
              <button
                onClick={() => acceptProposedActivity(tripId, activity.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Accept into Plan</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
