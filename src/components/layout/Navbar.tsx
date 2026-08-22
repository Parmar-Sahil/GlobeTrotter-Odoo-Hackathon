import React, { useState } from 'react';
import {
  Compass,
  Search,
  Bell,
  Plus,
  Sparkles,
  Users,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  MessageSquare,
  Award,
  BarChart3,
  Sun,
  Moon,
  Globe2
} from 'lucide-react';
import { useTravel, AppView } from '../../context/TravelContext';
import { PersonaSwitcher } from '../common/PersonaSwitcher';
import { NotificationDrawer } from './NotificationDrawer';
import { GlobiChatModal } from '../mascot/GlobiChatModal';

interface NavbarProps {
  onOpenCreateTrip: () => void;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateTrip, onOpenOnboarding }) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    unreadCount,
    theme,
    toggleTheme
  } = useTravel();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isGlobiOpen, setIsGlobiOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'discover', label: 'Community Feed', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'trips', label: 'My Trips', icon: <MapPin className="w-4 h-4" /> },
    { id: 'catalog', label: 'Destinations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'profile', label: 'Passport', icon: <Award className="w-4 h-4" /> },
  ];

  if (currentUser.isAdmin) {
    navLinks.push({ id: 'admin', label: 'Admin', icon: <BarChart3 className="w-4 h-4" /> });
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full clean-nav transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white flex items-center justify-center p-0.5">
                <img
                  src="/assets/logo.jpg"
                  alt="GlobeTrotter Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    Globe<span className="text-rose-500">Trotter</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Social Travel Planner
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links (Clean Airbnb-style pill tabs) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Ask Globi AI Companion Button */}
            <button
              onClick={() => setIsGlobiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-all text-xs font-bold group shadow-sm"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-teal-400/60 flex-shrink-0">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">Ask Globi</span>
              <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
            </button>

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-sm"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Persona Switcher Trigger */}
            <button
              onClick={() => setIsPersonaOpen(true)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-all group"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                />
                {currentUser.isAdmin && (
                  <span className="absolute -top-1 -right-1 p-0.5 bg-purple-500 rounded-full text-white">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {currentUser.name.split(' ')[0]}
                </p>
              </div>
              <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 hidden lg:block" />
            </button>

            {/* Plan Trip CTA (Airbnb Coral Style) */}
            <button
              onClick={onOpenCreateTrip}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Plan Trip</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-fadeIn shadow-lg">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === link.id
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  onOpenOnboarding();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Intro Guide
              </button>
              <button
                onClick={() => {
                  setIsPersonaOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/30 rounded-xl"
              >
                Switch Persona
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals triggered from navbar */}
      <PersonaSwitcher isOpen={isPersonaOpen} onClose={() => setIsPersonaOpen(false)} />
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <GlobiChatModal isOpen={isGlobiOpen} onClose={() => setIsGlobiOpen(false)} />
    </>
  );
};
