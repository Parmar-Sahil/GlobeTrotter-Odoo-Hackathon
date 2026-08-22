import React, { useState } from 'react';
import { Share2, Copy, Check, X, QrCode, Globe, Shield, MessageCircle } from 'lucide-react';
import { Trip } from '../../types/travel';

export const ShareModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}> = ({ isOpen, onClose, trip }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const shareUrl = `${window.location.origin}/#trip-${trip.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Share Expedition Plan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{trip.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Direct Trip Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                }`}
              >
                {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Trip Privacy: {trip.visibility.replace('_', ' ').toUpperCase()}</p>
            <p>
              {trip.visibility === 'open_to_join'
                ? 'Anyone with this link can view the itinerary and send a request to join your open squad.'
                : 'Anyone with this link can view your itinerary.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
