import React, { useState } from 'react';
import { UserPlus, Sparkles, X, Send, Heart, MapPin, CheckCircle } from 'lucide-react';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

export const JoinRequestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}> = ({ isOpen, onClose, trip }) => {
  const { currentUser, submitJoinRequest } = useTravel();
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !trip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitJoinRequest(trip.id, note || `Hey ${trip.hostName}! I’d love to join your ${trip.destination} expedition. My travel vibe matches the group!`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNote('');
      onClose();
    }, 1800);
  };

  const spotsLeft = (trip.maxSpots || 4) - trip.members.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Header with trip preview */}
        <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-sm">
                {spotsLeft} Spots Left
              </span>
              <h3 className="text-lg font-bold font-display mt-1 line-clamp-1 drop-shadow">
                {trip.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-rose-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">Request Sent to {trip.hostName}!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When {trip.hostName.split(' ')[0]} approves, you will be automatically added to the trip group chat and collaborative itinerary.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-slate-900">
            {/* Host info card */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img
                src={trip.hostAvatar}
                alt={trip.hostName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Trip Host</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{trip.hostName}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{trip.hostBio}</p>
              </div>
            </div>

            {/* Applicant Profile preview */}
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-1">
              <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Applying as: {currentUser.name}
              </p>
              <div className="flex flex-wrap gap-1">
                {currentUser.travelStyleTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Note field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Introduce Yourself & Why You Want to Join
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={`Hey ${trip.hostName.split(' ')[0]}! I would love to explore ${trip.destination} with your group. I love hiking, photography, and trying local food...`}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Join Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
