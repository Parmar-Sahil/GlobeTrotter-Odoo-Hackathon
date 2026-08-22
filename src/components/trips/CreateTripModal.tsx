import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Users,
  Shield,
  Eye,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { TripVisibility } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COVERS = [
  { label: 'Bali Tropical', src: '/assets/dest_bali.jpg', dest: 'Bali', country: 'Indonesia' },
  { label: 'Kyoto Heritage', src: '/assets/dest_kyoto.jpg', dest: 'Kyoto', country: 'Japan' },
  { label: 'Amalfi Coast', src: '/assets/dest_amalfi.jpg', dest: 'Amalfi Coast', country: 'Italy' },
  { label: 'Swiss Alps', src: '/assets/dest_swiss.jpg', dest: 'Interlaken', country: 'Switzerland' },
  { label: 'Jaipur Royal', src: '/assets/dest_jaipur.jpg', dest: 'Jaipur', country: 'India' },
  { label: 'Iceland Aurora', src: '/assets/dest_iceland.jpg', dest: 'Reykjavik', country: 'Iceland' }
];

const AVAILABLE_TAGS = [
  'Adventure', 'Culture', 'Food & Wine', 'Beach', 'Nature', 'Wellness',
  'Photography', 'Luxury', 'Budget Backpacker', 'Hiking', 'Road Trip', 'Nightlife'
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose }) => {
  const { createTrip, setCurrentView } = useTravel();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Culture', 'Food & Wine']);
  const [coverImage, setCoverImage] = useState('/assets/dest_bali.jpg');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<TripVisibility>('open_to_join');
  const [maxSpots, setMaxSpots] = useState(4);
  const [totalBudget, setTotalBudget] = useState(1800);
  const [currency, setCurrency] = useState('USD');

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectCover = (cover: typeof PRESET_COVERS[0]) => {
    setCoverImage(cover.src);
    if (!destination) setDestination(cover.dest);
    if (!country) setCountry(cover.country);
    if (!title) setTitle(`${cover.dest} Dream Expedition`);
  };

  const calculateDuration = () => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 7;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip = createTrip({
      title: title || `${destination || 'Global'} Journey`,
      destination: destination || 'Global Explorer',
      country: country || 'World',
      startDate,
      endDate,
      durationDays: calculateDuration(),
      coverImage,
      description: description || `Join us for an unforgettable travel journey through ${destination}!`,
      tags: selectedTags,
      visibility,
      maxSpots: visibility === 'open_to_join' ? maxSpots : undefined,
      totalBudget,
      currency
    });

    onClose();
    setCurrentView('trip-detail', newTrip.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Step Tracker */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Plan New Trip with Globi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 3: {step === 1 ? 'Trip Basics' : step === 2 ? 'Visuals & Vibe' : 'Social Tier & Budget'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
            className="bg-rose-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 bg-white dark:bg-slate-900">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Trip Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Bali Bliss & Sacred Temples Expedition"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    City / Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Ubud & Uluwatu"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. Indonesia"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    End Date ({calculateDuration()} days)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Select Cover Art (Generated High-Res)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_COVERS.map((cover, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectCover(cover)}
                      className={`relative h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        coverImage === cover.src
                          ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={cover.src}
                        alt={cover.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[11px] font-bold text-white drop-shadow">
                          {cover.label}
                        </span>
                      </div>
                      {coverImage === cover.src && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Trip Description & Host Pitch
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Share what makes this trip special, travel style, and expectations for co-travelers..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Trip Vibes & Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TAGS.map(tag => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Trip Privacy & Social Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setVisibility('open_to_join')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      visibility === 'open_to_join'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1">
                      <Users className="w-4 h-4" />
                      <span>Open to Join (Recommended)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Shows on Discover feed. Travelers send requests, you approve before they join group chat.
                    </p>
                  </div>

                  <div
                    onClick={() => setVisibility('public_view')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      visibility === 'public_view'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-1">
                      <Eye className="w-4 h-4" />
                      <span>Public View-Only</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Anyone can view and clone your itinerary into their personal plans.
                    </p>
                  </div>

                  <div
                    onClick={() => setVisibility('friends')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      visibility === 'friends'
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-1 ring-purple-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-sm mb-1">
                      <Shield className="w-4 h-4" />
                      <span>Friends Circle</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Visible only to travelers you share direct invite links with.
                    </p>
                  </div>

                  <div
                    onClick={() => setVisibility('private')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      visibility === 'private'
                        ? 'bg-slate-200 dark:bg-slate-700 border-slate-500 ring-1 ring-slate-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm mb-1">
                      <Lock className="w-4 h-4" />
                      <span>Private Plan</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Visible only to you. Perfect for personal drafts.
                    </p>
                  </div>
                </div>
              </div>

              {visibility === 'open_to_join' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Max Squad Size</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total travelers allowed including you</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMaxSpots(Math.max(2, maxSpots - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-slate-900 dark:text-white min-w-4 text-center">
                      {maxSpots}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMaxSpots(Math.min(12, maxSpots + 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Total Budget
                  </label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={e => setTotalBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-7 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Trip</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
