import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  X,
  Check,
  Plus
} from 'lucide-react';
import { Trip, ActivityCategory } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

export const AddActivityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  initialDay?: number;
}> = ({ isOpen, onClose, trip, initialDay = 1 }) => {
  const { currentUser, addActivity, triggerGlobiCelebration } = useTravel();

  const [day, setDay] = useState(initialDay);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('sightseeing');
  const [estimatedCost, setEstimatedCost] = useState(25);
  const [durationHours, setDurationHours] = useState(2);

  if (!isOpen) return null;

  const isHost = trip.hostId === currentUser.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addActivity(trip.id, day, {
      day,
      timeSlot,
      title,
      location: location || trip.destination,
      description: description || 'Exciting travel activity.',
      category,
      estimatedCost: Number(estimatedCost) || 0,
      durationHours: Number(durationHours) || 2,
      isProposal: !isHost,
      proposedBy: !isHost
        ? {
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar
          }
        : undefined,
      votes: !isHost
        ? [
            {
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              vote: 'up'
            }
          ]
        : undefined,
      status: isHost ? 'accepted' : 'proposed'
    });

    triggerGlobiCelebration();
    onClose();
    setTitle('');
    setLocation('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                {isHost ? 'Add Itinerary Activity' : 'Propose Activity to Squad'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHost ? 'Confirmed immediately into plan' : 'Squad members can vote with 👍 / 👎'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Day Number
              </label>
              <select
                value={day}
                onChange={e => setDay(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              >
                {Array.from({ length: trip.durationDays || 7 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Time Slot
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                placeholder="10:00 AM"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Tirta Empul Holy Water Temple Purification"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Tampaksiring, Bali"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="culture">Culture</option>
                <option value="food">Food</option>
                <option value="adventure">Adventure</option>
                <option value="relaxation">Relaxation</option>
                <option value="stay">Stay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Cost ($)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={e => setEstimatedCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Duration (h)
              </label>
              <input
                type="number"
                step="0.5"
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key highlights or travel tips for this stop..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isHost ? 'Add to Itinerary' : 'Submit Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
