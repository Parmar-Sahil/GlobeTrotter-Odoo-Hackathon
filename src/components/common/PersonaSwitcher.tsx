import React from 'react';
import { Users, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { User } from '../../types/travel';

export const PersonaSwitcher: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, availableUsers } = useTravel();

  if (!isOpen) return null;

  const handleSelect = (u: User) => {
    setCurrentUser(u);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">Switch Demo Persona</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Test different user roles and permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 bg-white dark:bg-slate-900">
          {availableUsers.map(u => {
            const isSelected = currentUser.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => handleSelect(u)}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 ring-1 ring-rose-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                    />
                    {u.isAdmin && (
                      <span className="absolute -top-1 -right-1 p-0.5 bg-purple-500 text-white rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</h4>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{u.roleTitle}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{u.bio}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
