import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Users, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { BrandPlaneIcon } from '../common/BrandLogo';
import { User } from '../../types/travel';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { availableUsers, login } = useTravel();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handlePersonaLogin = (u: User) => {
    login(u);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // Logs in as active user
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandPlaneIcon className="w-8 h-8 shadow-brand" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              {tab === 'login' ? 'Log In to GlobTrottler' : 'Create GlobTrottler Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 bg-white dark:bg-slate-900 overflow-y-auto max-h-[80vh]">
          {/* Welcome Text */}
          <div className="space-y-1">
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Welcome to Glob<span className="text-[#F2541B]">Trottler</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your collaborative itineraries, squad chats, and AI companion Globi.
            </p>
          </div>

          {/* Quick 1-Click Demo Login (Super helpful for hackathon judges & reviewers) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F2541B] uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Demo Personas (Instant Access)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {availableUsers.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handlePersonaLogin(u)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-orange-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#F2541B]/50 transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#F2541B] transition-colors">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{u.roleTitle}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-[#F2541B] group-hover:bg-[#F2541B] group-hover:text-white transition-all shadow-sm">
                    Enter →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or with credentials
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#F2541B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#F2541B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-xs shadow-brand transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{tab === 'login' ? 'Log In to Web App' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Tab Footer */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {tab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-bold text-[#F2541B] hover:underline"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-bold text-[#F2541B] hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
