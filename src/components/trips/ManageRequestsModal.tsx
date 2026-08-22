import React from 'react';
import { Users, Check, X, Shield, Sparkles, MessageSquare, Clock } from 'lucide-react';
import { Trip } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

export const ManageRequestsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}> = ({ isOpen, onClose, trip }) => {
  const { respondToJoinRequest, setCurrentView } = useTravel();

  if (!isOpen || !trip) return null;

  const requests = trip.joinRequests || [];
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pastRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Manage Join Requests</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{trip.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-white dark:bg-slate-900">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5">
              <span>Pending Requests ({pendingRequests.length})</span>
            </h4>

            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs">
                No pending join requests right now. Your trip is visible on the Community Feed!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.userAvatar}
                        alt={req.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                      />
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">{req.userName}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{req.userBio}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {req.userTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic">
                      "{req.note}"
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => respondToJoinRequest(req.id, 'declined')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-all flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => respondToJoinRequest(req.id, 'approved')}
                        className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Approve & Add to Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Requests */}
          {pastRequests.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Processed Requests
              </h4>
              <div className="space-y-2">
                {pastRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.userAvatar}
                        alt={req.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{req.userName}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.status === 'approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
