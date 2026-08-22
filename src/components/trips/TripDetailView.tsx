import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Share2,
  Copy,
  UserPlus,
  MessageSquare,
  Sparkles,
  Plus,
  Heart,
  ChevronLeft,
  CalendarDays,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { ItineraryBuilder } from '../itinerary/ItineraryBuilder';
import { BudgetOverview } from '../budget/BudgetOverview';
import { GroupChatView } from '../chat/GroupChatView';
import { ItineraryCalendarView } from '../itinerary/ItineraryCalendarView';
import { ShareModal } from '../common/ShareModal';
import { JoinRequestModal } from './JoinRequestModal';
import { ManageRequestsModal } from './ManageRequestsModal';
import { GlobiBadge } from '../mascot/GlobiBadge';

export const TripDetailView: React.FC = () => {
  const {
    activeTrip,
    currentUser,
    setCurrentView,
    cloneTrip,
    toggleLikeTrip
  } = useTravel();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'chat' | 'calendar'>('itinerary');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isManageRequestsOpen, setIsManageRequestsOpen] = useState(false);

  if (!activeTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Trip Selected</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Select a trip from Discover or My Trips to view details.</p>
        <button
          onClick={() => setCurrentView('discover')}
          className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm shadow-sm"
        >
          Explore Trips
        </button>
      </div>
    );
  }

  const isHost = activeTrip.hostId === currentUser.id;
  const isMember = activeTrip.members.some(m => m.userId === currentUser.id);
  const pendingRequestsCount = activeTrip.joinRequests?.filter(r => r.status === 'pending').length || 0;
  const spotsLeft = (activeTrip.maxSpots || 4) - activeTrip.members.length;
  const isOpenToJoin = activeTrip.visibility === 'open_to_join' && spotsLeft > 0;
  const hasPendingRequest = activeTrip.joinRequests?.some(
    r => r.userId === currentUser.id && r.status === 'pending'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('trips')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleLikeTrip(activeTrip.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{activeTrip.likesCount}</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        {/* Background Cover */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={activeTrip.coverImage}
            alt={activeTrip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

          {/* Top Privacy & Host Status */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                {activeTrip.visibility === 'open_to_join'
                  ? `🚀 Open to Join (${spotsLeft} spots)`
                  : activeTrip.visibility === 'public_view'
                  ? '🌐 Public View'
                  : activeTrip.visibility === 'friends'
                  ? '👥 Friends Only'
                  : '🔒 Private Plan'}
              </span>

              {isHost && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
                  👑 You are Host
                </span>
              )}
              {isMember && !isHost && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-sm">
                  🤝 Co-Traveler
                </span>
              )}
            </div>

            {isHost && pendingRequestsCount > 0 && (
              <button
                onClick={() => setIsManageRequestsOpen(true)}
                className="px-3.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md animate-pulse flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{pendingRequestsCount} Join Request{pendingRequestsCount > 1 ? 's' : ''}!</span>
              </button>
            )}
          </div>

          {/* Bottom Title & Details */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
            <div className="flex flex-wrap gap-1.5">
              {activeTrip.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight drop-shadow">
              {activeTrip.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1 font-semibold text-rose-300">
                <MapPin className="w-4 h-4 text-rose-400" />
                {activeTrip.destination}, {activeTrip.country}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-300" />
                {activeTrip.startDate} to {activeTrip.endDate} ({activeTrip.durationDays} Days)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-white">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Budget: {activeTrip.currency} {activeTrip.totalBudget}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar: Host Info & Squad Roster */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={activeTrip.hostAvatar}
              alt={activeTrip.hostName}
              className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{activeTrip.hostName}</h4>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                  Host
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{activeTrip.hostBio || 'Active Trip Host'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Squad Members</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeTrip.members.length} / {activeTrip.maxSpots || 4} spots filled
              </p>
            </div>

            <div className="flex items-center -space-x-2">
              {activeTrip.members.map((m, idx) => (
                <img
                  key={idx}
                  src={m.avatar}
                  alt={m.name}
                  title={`${m.name} (${m.role})`}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm"
                />
              ))}
              {isOpenToJoin && (
                <div
                  onClick={() => !isMember && setIsJoinOpen(true)}
                  title="Open spot — click to join"
                  className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-dashed border-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  +{spotsLeft}
                </div>
              )}
            </div>

            {isHost ? (
              <button
                onClick={() => setIsManageRequestsOpen(true)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Requests ({pendingRequestsCount})</span>
              </button>
            ) : isMember ? (
              <button
                onClick={() => setActiveTab('chat')}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Squad Chat</span>
              </button>
            ) : hasPendingRequest ? (
              <button
                disabled
                className="px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs cursor-default"
              >
                Request Pending
              </button>
            ) : isOpenToJoin ? (
              <button
                onClick={() => setIsJoinOpen(true)}
                className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <UserPlus className="w-4 h-4 stroke-[3]" />
                <span>Request to Join</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const cloned = cloneTrip(activeTrip.id);
                  setCurrentView('trip-detail', cloned.id);
                }}
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Clone Trip</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Clean underline style) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'itinerary'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Itinerary & Collaboration</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'budget'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Budget & Group Splitwise</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Group Chat & Live Polls</span>
          {activeTrip.messages.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'calendar'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Timeline Calendar</span>
        </button>
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'itinerary' && <ItineraryBuilder trip={activeTrip} />}
        {activeTab === 'budget' && <BudgetOverview trip={activeTrip} />}
        {activeTab === 'chat' && <GroupChatView trip={activeTrip} />}
        {activeTab === 'calendar' && <ItineraryCalendarView trip={activeTrip} />}
      </div>

      {/* Modals */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} trip={activeTrip} />
      <JoinRequestModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} trip={activeTrip} />
      <ManageRequestsModal isOpen={isManageRequestsOpen} onClose={() => setIsManageRequestsOpen(false)} trip={activeTrip} />
    </div>
  );
};
