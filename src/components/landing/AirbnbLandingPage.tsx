import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  Heart,
  Star,
  Globe2,
  Menu,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Palmtree,
  Camera,
  Mountain,
  Utensils,
  Plane,
  ArrowRight,
  Bot,
  CheckCircle2,
  Vote,
  Receipt,
  UserPlus
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { BrandLogo, BrandPlaneIcon } from '../common/BrandLogo';
import { AuthModal } from '../auth/AuthModal';
import { GlobiChatModal } from '../mascot/GlobiChatModal';
import { MOCK_DESTINATIONS } from '../../data/mockDestinations';
import { Trip } from '../../types/travel';

export const AirbnbLandingPage: React.FC = () => {
  const { trips, theme, toggleTheme, login, availableUsers } = useTravel();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGlobiOpen, setIsGlobiOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedSpots, setSelectedSpots] = useState<number | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  const categories = [
    { label: 'All Trips', icon: <Globe2 className="w-4 h-4" /> },
    { label: 'Tropical Beach', icon: <Palmtree className="w-4 h-4" /> },
    { label: 'Heritage Culture', icon: <Camera className="w-4 h-4" /> },
    { label: 'Alpine Mountain', icon: <Mountain className="w-4 h-4" /> },
    { label: 'Food & Wine', icon: <Utensils className="w-4 h-4" /> },
    { label: 'Luxury Villas', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const filteredTrips = trips.filter(trip => {
    if (destinationSearch.trim()) {
      const q = destinationSearch.toLowerCase();
      const match =
        trip.title.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q) ||
        trip.country.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeCategory === 'Tropical Beach' && !trip.tags.includes('Beach') && !trip.destination.toLowerCase().includes('bali')) return false;
    if (activeCategory === 'Heritage Culture' && !trip.tags.includes('Culture') && !trip.destination.toLowerCase().includes('kyoto') && !trip.destination.toLowerCase().includes('jaipur')) return false;
    if (activeCategory === 'Alpine Mountain' && !trip.tags.includes('Adventure') && !trip.destination.toLowerCase().includes('swiss') && !trip.destination.toLowerCase().includes('iceland')) return false;
    if (activeCategory === 'Food & Wine' && !trip.tags.includes('Food & Wine') && !trip.destination.toLowerCase().includes('amalfi')) return false;

    if (selectedBudget === 'budget' && trip.totalBudget > 1200) return false;
    if (selectedBudget === 'mid' && (trip.totalBudget < 1200 || trip.totalBudget > 2500)) return false;
    if (selectedBudget === 'luxury' && trip.totalBudget <= 2500) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#F2541B] selection:text-white transition-colors duration-200">
      {/* 1. PUBLIC AIRBNB-STYLE NAVBAR */}
      <header className="sticky top-0 z-40 w-full clean-nav transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group text-left"
          >
            <BrandPlaneIcon className="w-10 h-10 shadow-brand" />
            <div className="leading-tight">
              <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Glob<span className="text-[#F2541B]">Trottler</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Social Travel & Expeditions
              </p>
            </div>
          </button>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Ask Globi AI Assistant */}
            <button
              onClick={() => setIsGlobiOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#F2541B] hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all text-xs font-bold shadow-sm"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400/60 flex-shrink-0">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <span>Ask Globi AI</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F2541B] animate-pulse" />
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Become a Host / Plan Trip */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hidden md:block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#F2541B] dark:hover:text-white px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Host an Expedition
            </button>

            {/* Log In Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all shadow-sm"
            >
              Log In
            </button>

            {/* Sign Up / Enter App CTA (Orange) */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] active:scale-95 text-white font-extrabold text-xs shadow-brand transition-all flex items-center gap-1.5"
            >
              <span>Explore Web App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SEARCH WIDGET (AIRBNB & MAKEMYTRIP STYLE) */}
      <section className="relative pt-8 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F2541B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Copy */}
        <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 shadow-sm">
            <Plane className="w-3.5 h-3.5 text-[#F2541B]" />
            <span className="text-xs font-extrabold text-[#F2541B] tracking-wide uppercase">
              Social Travel Planner & Open Squads
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
            Find Open Travel Squads. <br />
            <span className="text-[#F2541B]">Explore the World Together.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover verified community itineraries, send requests to join open spots, collaborate with live thumbs-up voting, and split villa bills with 1-tap Splitwise.
          </p>
        </div>

        {/* Mega Search Bar (Airbnb Style) */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl p-3 sm:p-4 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3 items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {/* Field 1: Destination */}
            <div className="px-3 py-2 space-y-0.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Where to?
              </label>
              <input
                type="text"
                value={destinationSearch}
                onChange={e => setDestinationSearch(e.target.value)}
                placeholder="Bali, Kyoto, Amalfi..."
                className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Field 2: Dates */}
            <div className="px-3 py-2 space-y-0.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                When
              </label>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#F2541B]" />
                <span>Any Season / Flexible</span>
              </div>
            </div>

            {/* Field 3: Budget Filter */}
            <div className="px-3 py-2 space-y-0.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Budget Tier
              </label>
              <select
                value={selectedBudget}
                onChange={e => setSelectedBudget(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">Any Budget ($ / $$ / $$$)</option>
                <option value="budget">Budget (&lt; $1,200)</option>
                <option value="mid">Mid-Range ($1,200 - $2,500)</option>
                <option value="luxury">Luxury (&gt; $2,500)</option>
              </select>
            </div>

            {/* Field 4: Search Action Button */}
            <div className="pl-3 py-1 flex items-center justify-end">
              <button
                onClick={() => {
                  const element = document.getElementById('expeditions-grid');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-xs shadow-brand flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Search className="w-4 h-4 stroke-[3]" />
                <span>Search Expeditions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Airbnb Category Pill Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          {categories.map((cat, idx) => {
            const isSelected = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED EXPEDITIONS GRID (AIRBNB CARD STYLE) */}
      <section id="expeditions-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Open Community Expeditions ({filteredTrips.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Browse joinable squads with available spots or clone itineraries into your personal drafts
            </p>
          </div>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-xs font-bold text-[#F2541B] hover:underline flex items-center gap-1 group"
          >
            <span>Sign In to Unlock Full Web App</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => {
            const spotsLeft = (trip.maxSpots || 4) - trip.members.length;
            return (
              <div
                key={trip.id}
                onClick={() => setIsAuthOpen(true)}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Cover photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{spotsLeft > 0 ? `${spotsLeft} Spots Open` : 'Squad Ready'}</span>
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setIsAuthOpen(true);
                      }}
                      className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-sm"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#F2541B] fill-[#F2541B]" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1 font-bold drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>{trip.destination}, {trip.country}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] font-medium">
                      {trip.durationDays} Days
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-[#F2541B] transition-colors line-clamp-1">
                        {trip.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>4.95</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>
                  </div>

                  {/* Host & Roster */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={trip.hostAvatar}
                        alt={trip.hostName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {trip.hostName.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center -space-x-1.5">
                      {trip.members.map((m, idx) => (
                        <img
                          key={idx}
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price & Join CTA */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ${trip.totalBudget}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">total budget</span>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setIsAuthOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-bold text-xs shadow-brand flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Join Squad</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MAKEMYTRIP-STYLE "WHY GLOBTROTTLER" PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full mt-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F2541B]">
              The All-in-One Travel Ecosystem
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Why Travelers Choose GlobTrottler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#F2541B] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Globi AI Companion</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Smart assistant that proactively flags open gaps, recommends hidden local spots, and protects your budget.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Open Joinable Trips</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hosts post open spots. Travelers send introduction notes, and hosts approve before adding them to group chat.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Vote className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Collaborative Voting</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Co-travelers propose activities and the squad votes with thumbs up/down before confirming items.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Splitwise Expense Sync</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time bilateral debt calculations and 1-tap "Settle Up" with celebratory confetti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURATED DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full mt-16">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Top Explorer Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Hand-picked spots with top weather, seasonal highlights, and daily budgets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DESTINATIONS.slice(0, 3).map(dest => (
            <div
              key={dest.id}
              onClick={() => setIsAuthOpen(true)}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 aspect-[16/11] cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
            >
              <img
                src={dest.coverImage}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white shadow-sm">
                  {dest.region}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                <h3 className="text-xl font-extrabold font-display drop-shadow">
                  {dest.city}, {dest.country}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-1">{dest.tagline}</p>
                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-orange-300">
                  <span>${dest.avgBudgetDaily} / day</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Explore Experiences →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INSTANT ACCESS / DEMO PERSONAS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-[#F2541B] text-white">
                Reviewer & Judge Demo Access
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
              Ready to Test the Full Web App?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Click below to instantly log in as <strong>Sarah (Host)</strong>, <strong>Alex (Traveler)</strong>, or <strong>Admin</strong> and test real-time collaborative itineraries, squad chats, and Splitwise expense ledgers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => login(availableUsers[0])}
              className="px-6 py-3.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-xs shadow-brand hover:shadow-brand-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <span>1-Click Enter as Sarah (Host)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              Select Another Persona
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <BrandPlaneIcon className="w-6 h-6" />
            <span className="font-bold text-slate-900 dark:text-white">GlobTrottler</span>
            <span>• © 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-[#F2541B]">Log In</button>
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-[#F2541B]">Sign Up</button>
            <button onClick={() => setIsGlobiOpen(true)} className="hover:text-[#F2541B]">Ask Globi AI</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <GlobiChatModal isOpen={isGlobiOpen} onClose={() => setIsGlobiOpen(false)} />
    </div>
  );
};
