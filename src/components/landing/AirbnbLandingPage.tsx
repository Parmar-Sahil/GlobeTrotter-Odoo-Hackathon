import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Heart,
  Star,
  Globe2,
  Menu,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Palmtree,
  Camera,
  Mountain,
  Utensils,
  Plane,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  Building,
  Flame,
  User as UserIcon,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { BrandPlaneIcon } from '../common/BrandLogo';
import { AuthModal } from '../auth/AuthModal';
import { GlobiChatModal } from '../mascot/GlobiChatModal';
import { Trip } from '../../types/travel';

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

const AIRBNB_CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Trips', icon: '✨' },
  { id: 'beach', label: 'Beachfront', icon: '🏖️' },
  { id: 'culture', label: 'Historical', icon: '🏛️' },
  { id: 'mountain', label: 'Amazing views', icon: '🏔️' },
  { id: 'tropical', label: 'Tropical', icon: '🌴' },
  { id: 'foodie', label: 'Food & Wine', icon: '🍷' },
  { id: 'pools', label: 'Amazing pools', icon: '🏊' },
  { id: 'islands', label: 'Islands', icon: '🏝️' },
  { id: 'castles', label: 'Castles', icon: '🏰' },
  { id: 'camping', label: 'Camping', icon: '⛺' },
  { id: 'luxe', label: 'Luxe', icon: '💎' },
  { id: 'arctic', label: 'Arctic', icon: '❄️' },
];

export const AirbnbLandingPage: React.FC = () => {
  const { trips, theme, toggleTheme, login, availableUsers } = useTravel();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGlobiOpen, setIsGlobiOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'stays' | 'expeditions' | 'experiences'>('expeditions');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [likedTripIds, setLikedTripIds] = useState<Record<string, boolean>>({});

  // Search Bar States
  const [activeSearchSection, setActiveSearchSection] = useState<'where' | 'when' | 'who' | null>(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [travelersCount, setTravelersCount] = useState(1);
  const [showTaxes, setShowTaxes] = useState(true);

  // Quick destinations dropdown
  const popularRegions = [
    { title: "I'm flexible", icon: '🗺️', desc: 'Search worldwide' },
    { title: 'Southeast Asia', icon: '🌴', desc: 'Bali, Thailand, Vietnam' },
    { title: 'Europe', icon: '🏰', desc: 'Italy, Swiss Alps, France' },
    { title: 'Japan', icon: '⛩️', desc: 'Kyoto, Tokyo, Mount Fuji' },
    { title: 'India', icon: '🕌', desc: 'Jaipur, Kerala, Himalayas' },
  ];

  const toggleLike = (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    setLikedTripIds(prev => ({ ...prev, [tripId]: !prev[tripId] }));
  };

  const filteredTrips = trips.filter(trip => {
    if (destinationInput.trim()) {
      const q = destinationInput.toLowerCase();
      const match =
        trip.title.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q) ||
        trip.country.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory === 'beach' && !trip.tags.includes('Beach') && !trip.destination.toLowerCase().includes('bali')) return false;
    if (selectedCategory === 'culture' && !trip.tags.includes('Culture') && !trip.destination.toLowerCase().includes('kyoto') && !trip.destination.toLowerCase().includes('jaipur')) return false;
    if (selectedCategory === 'mountain' && !trip.tags.includes('Adventure') && !trip.destination.toLowerCase().includes('swiss') && !trip.destination.toLowerCase().includes('iceland')) return false;
    if (selectedCategory === 'foodie' && !trip.tags.includes('Food & Wine') && !trip.destination.toLowerCase().includes('amalfi')) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#F2541B] selection:text-white font-sans">
      {/* ========================================================================= */}
      {/* 1. AIRBNB HEADER & TOP FLOATING NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDestinationInput('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left"
            >
              <BrandPlaneIcon className="w-9 h-9 shadow-sm" />
              <span className="font-display font-extrabold text-2xl tracking-tight text-[#F2541B]">
                Glob<span className="text-slate-900 dark:text-white">Trottler</span>
              </span>
            </button>
          </div>

          {/* Center Tabs: Stays | Expeditions | Experiences (Airbnb Style) */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('expeditions')}
              className={`text-sm font-semibold transition-colors pb-1 relative ${
                activeTab === 'expeditions'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Expeditions & Squads
              {activeTab === 'expeditions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('stays')}
              className={`text-sm font-semibold transition-colors pb-1 relative ${
                activeTab === 'stays'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Stays & Villas
              {activeTab === 'stays' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('experiences')}
              className={`text-sm font-semibold transition-colors pb-1 relative ${
                activeTab === 'experiences'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Experiences
              {activeTab === 'experiences' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* Right Action Menu: Host | Globi AI | Theme | User Capsule */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask Globi AI Assistant Pill */}
            <button
              onClick={() => setIsGlobiOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#F2541B] hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all text-xs font-bold shadow-sm"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400/60 flex-shrink-0">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <span>Ask Globi AI</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F2541B] animate-pulse" />
            </button>

            {/* Become a Host Link */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2.5 rounded-full transition-colors hidden sm:block"
            >
              GlobTrottler your trip
            </button>

            {/* Globe / Currency Indicator */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Airbnb-style User Capsule Button */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-3.5 rounded-full border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all bg-white dark:bg-slate-800"
              >
                <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <div className="w-7 h-7 rounded-full bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                  <UserIcon className="w-4 h-4" />
                </div>
              </button>

              {/* Airbnb User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-left text-xs"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">Welcome to GlobTrottler</p>
                    <p className="text-[11px] text-slate-400">Collaborative squad trips & AI companion</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-900 dark:text-white text-left transition-colors flex items-center justify-between"
                  >
                    <span>Sign up</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                  >
                    Log in
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  {/* 1-Click Demo Login for Judges */}
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase text-[#F2541B] tracking-wider">
                    ⚡ Instant Demo Personas
                  </div>
                  {availableUsers.slice(0, 3).map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setUserDropdownOpen(false);
                        login(u);
                      }}
                      className="w-full px-4 py-2 hover:bg-orange-50/60 dark:hover:bg-slate-800 flex items-center gap-2 text-left transition-colors"
                    >
                      <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 leading-none">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.roleTitle}</p>
                      </div>
                    </button>
                  ))}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsGlobiOpen(true);
                    }}
                    className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left"
                  >
                    Ask Globi AI Companion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THE ICONIC AIRBNB BIG FLOATING SEARCH PILL */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mx-auto px-4 pb-6 pt-2">
          <div className="relative rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-md hover:shadow-lg transition-all p-1.5 flex items-center justify-between divide-x divide-slate-200 dark:divide-slate-800">
            {/* 1. WHERE */}
            <div
              onClick={() => setActiveSearchSection(activeSearchSection === 'where' ? null : 'where')}
              className={`flex-1 px-6 py-2.5 rounded-full cursor-pointer transition-colors text-left relative ${
                activeSearchSection === 'where' ? 'bg-slate-100 dark:bg-slate-800 shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <label className="text-[11px] font-extrabold text-slate-900 dark:text-white block tracking-tight">
                Where
              </label>
              <input
                type="text"
                value={destinationInput}
                onChange={e => setDestinationInput(e.target.value)}
                placeholder="Search destinations"
                className="w-full bg-transparent text-xs text-slate-600 dark:text-slate-300 font-medium placeholder-slate-400 focus:outline-none truncate"
              />

              {/* Where Popover Suggestions */}
              {activeSearchSection === 'where' && (
                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute left-0 top-16 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-fadeIn"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                    Search by region
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {popularRegions.map(reg => (
                      <button
                        key={reg.title}
                        onClick={() => {
                          setDestinationInput(reg.title === "I'm flexible" ? '' : reg.title);
                          setActiveSearchSection(null);
                        }}
                        className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white transition-all text-left group flex flex-col gap-1"
                      >
                        <span className="text-2xl">{reg.icon}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{reg.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. WHEN / DATES */}
            <div
              onClick={() => setActiveSearchSection(activeSearchSection === 'when' ? null : 'when')}
              className={`flex-1 px-6 py-2.5 rounded-full cursor-pointer transition-colors text-left hidden sm:block ${
                activeSearchSection === 'when' ? 'bg-slate-100 dark:bg-slate-800 shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <p className="text-[11px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                When
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Any week • Flexible
              </p>
            </div>

            {/* 3. WHO / GUESTS */}
            <div
              onClick={() => setActiveSearchSection(activeSearchSection === 'who' ? null : 'who')}
              className={`flex-1 px-6 py-2.5 rounded-full cursor-pointer transition-colors text-left relative hidden md:block ${
                activeSearchSection === 'who' ? 'bg-slate-100 dark:bg-slate-800 shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <p className="text-[11px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                Who
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {travelersCount === 1 ? 'Add guests' : `${travelersCount} travelers`}
              </p>

              {/* Who Popover */}
              {activeSearchSection === 'who' && (
                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute right-0 top-16 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-fadeIn space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">Squad Size</p>
                      <p className="text-[11px] text-slate-400">Co-travelers looking for spots</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold">{travelersCount}</span>
                      <button
                        onClick={() => setTravelersCount(travelersCount + 1)}
                        className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. CIRCULAR SEARCH BUTTON (Brand Orange #F2541B) */}
            <div className="pl-2 pr-1">
              <button
                onClick={() => {
                  setActiveSearchSection(null);
                  const el = document.getElementById('airbnb-listings');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-3.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white shadow-brand transition-transform active:scale-95 flex items-center justify-center"
              >
                <Search className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. AIRBNB HORIZONTAL CATEGORY ICON BAR & TAX TOGGLE */}
        {/* ========================================================================= */}
        <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-6 py-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Scrollable Categories with tiny icons & text */}
          <div className="flex items-center gap-7 overflow-x-auto no-scrollbar py-1">
            {AIRBNB_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 pb-2 transition-all flex-shrink-0 border-b-2 ${
                    isSelected
                      ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold opacity-100'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 opacity-80'
                  }`}
                >
                  <span className="text-xl leading-none">{cat.icon}</span>
                  <span className="text-[11px] font-semibold whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Filters & Total Price Toggle (Exact Airbnb Feature) */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            {/* Filter Pill */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-xs font-bold transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Display Total Price Toggle Pill */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Display total before taxes</span>
              <button
                onClick={() => setShowTaxes(!showTaxes)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  showTaxes ? 'bg-slate-900 dark:bg-white' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 transition-transform ${
                    showTaxes ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4. EXACT AIRBNB LISTING CARD GRID */}
      {/* ========================================================================= */}
      <main id="airbnb-listings" className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-1 w-full space-y-12">
        {/* Listings Grid: 4 Columns on Large screens like Airbnb */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredTrips.map((trip, index) => {
            const isLiked = likedTripIds[trip.id];
            const spotsLeft = (trip.maxSpots || 4) - trip.members.length;
            const isGuestFavorite = index === 0 || index === 2;

            return (
              <div
                key={trip.id}
                onClick={() => setIsAuthOpen(true)}
                className="group cursor-pointer flex flex-col space-y-3"
              >
                {/* Image Container with Airbnb Aspect Ratio & Heart */}
                <div className="relative aspect-square sm:aspect-[20/19] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Top Left: Airbnb "Guest favorite" or "Open Squad" Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {isGuestFavorite ? (
                      <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-[11px] font-extrabold shadow-md backdrop-blur-md flex items-center gap-1">
                        <span>🏆 Guest favorite</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-[#F2541B] text-[11px] font-extrabold shadow-md backdrop-blur-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F2541B] animate-pulse" />
                        <span>{spotsLeft > 0 ? `${spotsLeft} spots open` : 'Squad full'}</span>
                      </span>
                    )}
                  </div>

                  {/* Top Right: Heart Floating Button */}
                  <button
                    onClick={e => toggleLike(e, trip.id)}
                    className="absolute top-3 right-3 p-2 text-white hover:scale-110 active:scale-90 transition-transform drop-shadow"
                  >
                    <Heart
                      className={`w-6 h-6 stroke-white stroke-2 ${
                        isLiked ? 'fill-[#F2541B] stroke-[#F2541B]' : 'fill-black/30'
                      }`}
                    />
                  </button>

                  {/* Bottom Image Overlay: Squad avatars */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center -space-x-1.5">
                      {trip.members.map((m, mIdx) => (
                        <img
                          key={mIdx}
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ))}
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold">
                      {trip.durationDays} Days
                    </span>
                  </div>
                </div>

                {/* 4-Line Typography (Exact Airbnb Hierarchy) */}
                <div className="space-y-0.5 text-[15px] leading-snug">
                  {/* Line 1: Title / Location + Star Rating */}
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {trip.destination}, {trip.country}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-slate-900 dark:fill-white text-slate-900 dark:text-white" />
                      <span>4.95</span>
                    </div>
                  </div>

                  {/* Line 2: Host & Squad Theme */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Hosted by {trip.hostName.split(' ')[0]} • {trip.tags.slice(0, 2).join(' & ')}
                  </p>

                  {/* Line 3: Dates */}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {trip.startDate} – {trip.endDate}
                  </p>

                  {/* Line 4: Price Per Person */}
                  <div className="pt-1 flex items-baseline gap-1 text-sm">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ${Math.round(trip.totalBudget / (trip.members.length || 1))}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">per person total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 5. AIRBNB-STYLE PROMO BANNER / DISCOVER MORE */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#F2541B] flex items-center justify-center shadow-sm">
            <BrandPlaneIcon size={32} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Traveling is better when you squad up.
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Log in to propose activities, vote in group polls with thumbs up/down, chat with your squad, and automatically settle shared villa expenses.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => login(availableUsers[0])}
              className="px-6 py-3 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-bold text-xs shadow-brand transition-all flex items-center gap-2"
            >
              <span>1-Click Enter as Sarah (Superhost)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Sign up with Email
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 6. AIRBNB FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-[#F7F7F7] dark:bg-slate-950 py-12 transition-colors">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 text-xs text-slate-600 dark:text-slate-400">
          {/* 4 Column Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Support</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Help Centre</button></li>
                <li><button onClick={() => setIsGlobiOpen(true)} className="hover:underline">Ask Globi AI</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Safety information</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Cancellation options</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Community</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">GlobTrottler squads</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Collaborative voting</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Splitwise ledger</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Digital passport stamps</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Hosting</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Host an expedition</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Open joinable spots</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Host community guidelines</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">GlobTrottler</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Newsroom</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">New features</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Careers</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Investors</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>© 2026 GlobTrottler, Inc.</span>
              <span>·</span>
              <button onClick={() => setIsAuthOpen(true)} className="hover:underline">Privacy</button>
              <span>·</span>
              <button onClick={() => setIsAuthOpen(true)} className="hover:underline">Terms</button>
              <span>·</span>
              <button onClick={() => setIsAuthOpen(true)} className="hover:underline">Sitemap</button>
            </div>

            <div className="flex items-center gap-4 font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1">🌐 English (IN)</span>
              <span>₹ INR</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <GlobiChatModal isOpen={isGlobiOpen} onClose={() => setIsGlobiOpen(false)} />
    </div>
  );
};
