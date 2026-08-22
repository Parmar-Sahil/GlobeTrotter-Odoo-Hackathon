import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
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
  UserPlus,
  Play,
  Share2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Compass,
  Check,
  X
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { BrandLogo, BrandPlaneIcon } from '../common/BrandLogo';
import { AuthModal } from '../auth/AuthModal';
import { GlobiChatModal } from '../mascot/GlobiChatModal';
import { MOCK_DESTINATIONS } from '../../data/mockDestinations';
import { Trip } from '../../types/travel';

export const LandingPage: React.FC = () => {
  const { trips, theme, toggleTheme, login, availableUsers, triggerGlobiCelebration } = useTravel();

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll Transforms for Parallax & Navbar
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setNavScrolled(latest > 40);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // State Management
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGlobiOpen, setIsGlobiOpen] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const [searchTravelers, setSearchTravelers] = useState(2);
  const [selectedItineraryDay, setSelectedItineraryDay] = useState(2);
  const [demoVoteCount, setDemoVoteCount] = useState(3);
  const [hasVotedDemo, setHasVotedDemo] = useState(false);
  const [demoSettled, setDemoSettled] = useState(false);

  // Popular inspirations
  const popularSpots = [
    { name: 'Bali, Indonesia', image: '/assets/dest_bali.jpg', tag: 'Tropical & Cultural', budget: '$65/day', days: '7 Days' },
    { name: 'Kyoto, Japan', image: '/assets/dest_kyoto.jpg', tag: 'Temples & Culinary', budget: '$120/day', days: '8 Days' },
    { name: 'Amalfi Coast, Italy', image: '/assets/dest_amalfi.jpg', tag: 'Coastal Luxe & Food', budget: '$160/day', days: '6 Days' },
    { name: 'Swiss Alps', image: '/assets/dest_swiss.jpg', tag: 'Alpine Hiking', budget: '$190/day', days: '5 Days' },
    { name: 'Jaipur, India', image: '/assets/dest_jaipur.jpg', tag: 'Royal Palaces', budget: '$45/day', days: '5 Days' },
    { name: 'Reykjavik, Iceland', image: '/assets/dest_iceland.jpg', tag: 'Aurora & Glaciers', budget: '$140/day', days: '6 Days' },
  ];

  // Itinerary Demo Mock
  const itineraryDays = [
    {
      day: 1,
      title: 'Arrival & Seaside Sunset Villa',
      location: 'Seminyak Coastal Villa',
      highlights: 'Airport pickup, check-in, beach club welcome toast',
      cost: '$85/person',
      accepted: true
    },
    {
      day: 2,
      title: 'Tirta Empul Holy Springs & Ubud Monkey Forest',
      location: 'Ubud Highlands',
      highlights: 'Sacred purification bath, artisanal lunch, jungle walk',
      cost: '$40/person',
      accepted: true
    },
    {
      day: 3,
      title: 'Mount Batur Sunrise Volcano Trek (Proposed)',
      location: 'Kintamani Crater',
      highlights: '4:00 AM Jeep safari, summit breakfast with sunrise clouds',
      cost: '$55/person',
      isProposal: true
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#F2541B] selection:text-white font-sans overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. SMOOTH NAVBAR TRANSFORMATION (Framer Motion) */}
      {/* ========================================================================= */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? 'bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 py-3.5 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-brand flex-shrink-0 flex items-center justify-center">
              <img src="/assets/logo-icon.png" alt="GlobTrottler Emblem" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-white">
                Glob<span className="text-[#F2541B]">Trottler</span>
              </span>
            </div>
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
            <a href="#how-it-works" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#itinerary-preview" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Itinerary Engine
            </a>
            <a href="#budget-preview" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Splitwise Ledger
            </a>
            <a href="#destinations" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#community-feed" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Open Squads
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Ask Globi AI Assistant */}
            <button
              onClick={() => setIsGlobiOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#F2541B] hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all text-xs font-bold shadow-sm group"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-400/60 flex-shrink-0">
                <img src="/assets/globi_hero.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <span>Ask Globi AI</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F2541B] animate-pulse" />
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-sm"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Log In Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hidden sm:block px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Log In
            </button>

            {/* Sign Up / Launch CTA */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] active:scale-95 text-white font-extrabold text-xs shadow-brand transition-all flex items-center gap-1.5"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ========================================================================= */}
      {/* 2. CINEMATIC HERO SECTION (Parallax + Staggered Reveal) */}
      {/* ========================================================================= */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        {/* Soft Background Blur Circles */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#F2541B]/10 dark:bg-[#F2541B]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 shadow-sm"
          >
            <Plane className="w-3.5 h-3.5 text-[#F2541B]" />
            <span className="text-xs font-extrabold text-[#F2541B] tracking-wide uppercase">
              The Intelligent Social Travel Platform
            </span>
          </motion.div>

          {/* Main Cinematic Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Plan Together. <br />
            <span className="text-[#F2541B]">Squad Up</span> Anywhere.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one collaborative trip companion powered by <strong>Globi AI</strong>. Vote on multi-city itineraries, hop into open joinable squads, and split expenses effortlessly.
          </motion.p>

          {/* Floating Search Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-2"
          >
            <div className="max-w-3xl mx-auto rounded-3xl sm:rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-xl p-3 sm:p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 text-left">
              {/* Destination */}
              <div className="w-full sm:w-1/3 px-4 py-2 space-y-0.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Destination
                </label>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F2541B]" />
                  <input
                    type="text"
                    value={searchDestination}
                    onChange={e => setSearchDestination(e.target.value)}
                    placeholder="Bali, Kyoto, Swiss..."
                    className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="w-full sm:w-1/3 px-4 py-2 space-y-0.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Dates
                </label>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Calendar className="w-3.5 h-3.5 text-[#F2541B]" />
                  <span>Oct 10 – 17, 2026</span>
                </div>
              </div>

              {/* Travelers */}
              <div className="w-full sm:w-1/4 px-4 py-2 space-y-0.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Squad Size
                </label>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Users className="w-3.5 h-3.5 text-[#F2541B]" />
                  <span>{searchTravelers} Co-Travelers</span>
                </div>
              </div>

              {/* Search CTA */}
              <div className="w-full sm:w-auto pt-2 sm:pt-0 sm:pr-1 flex items-center justify-center">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-xs shadow-brand transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>Search Trips</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">4.98/5 Rating</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F2541B]" />
              <span>12,400+ Expeditions Formed</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>140+ Destinations</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Interactive App Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-4 sm:p-6 space-y-5"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">globtrottler.app/bali-bliss-squad</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ● 4 Co-Travelers Online
              </span>
            </div>
          </div>

          {/* Interactive Hero Banner */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
            <img
              src="/assets/dest_bali.jpg"
              alt="Bali Bliss"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Floating Pill 1: Globi Proactive Companion */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 max-w-xs"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                <img src="/assets/globi_idea.jpg" alt="Globi" className="w-full h-full object-cover" />
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Globi Companion</span>
                  <Sparkles className="w-3 h-3 text-[#F2541B]" />
                </p>
                <p className="text-slate-500 dark:text-slate-400">"Day 3 sunset slot is open. Add beach seafood dinner?"</p>
              </div>
            </motion.div>

            {/* Floating Pill 2: Splitwise Settle Banner */}
            <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 space-y-1 hidden sm:block">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Receipt className="w-3.5 h-3.5 text-purple-500" />
                <span>Splitwise Squad Ledger</span>
              </div>
              <p className="text-[11px] text-slate-500">Alex owes Sarah $45.00 • Villa Share</p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ✓ Settle with 1-Tap
              </span>
            </div>

            {/* Trip Info Bottom Left */}
            <div className="absolute bottom-4 left-4 text-white space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F2541B] uppercase tracking-wider">
                Open to Join (2 Spots Remaining)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display drop-shadow">
                Bali Bliss & Sacred Temples Expedition
              </h3>
              <p className="text-xs text-orange-200">Hosted by Sarah Jenkins • Oct 10 - 17, 2026</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW GLOBETROTTER WORKS (3-Step Animated Flow) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F2541B]">
              Streamlined Social Travel
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              How GlobeTrotter Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Transform your travel from chaotic group messages into an organized, collaborative squad experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-[#F2541B] font-black text-xl shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Create or Clone Itinerary
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Build your itinerary in minutes with Globi AI assistance, or clone an award-winning public route from verified community Super Hosts.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xl shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Squad Up & Approve Joins
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Open spots for solo adventurers. Travelers send intro notes, and the host approves before granting access to private group chat.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Vote & Settle Automatically
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Co-travelers propose activities and the group votes with thumbs up/down. All villa, food, and ride bills split smoothly in Splitwise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MULTI-CITY ITINERARY & COLLABORATIVE VOTING PREVIEW */}
      {/* ========================================================================= */}
      <section id="itinerary-preview" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F2541B]">
              Democratic Squad Planning
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Multi-City Itinerary Engine with Live Thumbs-Up Voting
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              No more endless arguing in WhatsApp chats. When someone finds an exciting excursion, they post an activity proposal. The squad casts votes, and the host accepts it into the master schedule with one tap.
            </p>

            <div className="space-y-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time schedule conflict prevention by Globi AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Per-activity budget estimations and duration cards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Offline-ready itinerary timeline with interactive maps</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Try Demo Itinerary Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Itinerary Live Widget */}
          <div className="w-full lg:w-[500px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Bali Expedition Timeline</p>
                <p className="text-[10px] text-slate-400">Day-by-Day Activity Schedule</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-orange-50 dark:bg-orange-950/40 text-[#F2541B] border border-orange-200 dark:border-orange-900/60">
                Interactive Demo
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="flex gap-2">
              {[1, 2, 3].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedItineraryDay(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedItineraryDay === d
                      ? 'bg-[#F2541B] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>

            {/* Selected Day Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {selectedItineraryDay === 3 ? 'Community Proposal' : 'Confirmed Schedule'}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {itineraryDays[selectedItineraryDay - 1].cost}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {itineraryDays[selectedItineraryDay - 1].title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {itineraryDays[selectedItineraryDay - 1].highlights}
              </p>

              {/* Interactive Thumbs Up/Down Voting Widget for Day 3 */}
              {selectedItineraryDay === 3 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (!hasVotedDemo) {
                          setDemoVoteCount(prev => prev + 1);
                          setHasVotedDemo(true);
                          triggerGlobiCelebration();
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        hasVotedDemo
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{demoVoteCount} Upvotes</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-600">
                    {hasVotedDemo ? '✓ Vote Recorded!' : 'Click to Vote'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BUDGET & SPLITWISE GROUP EXPENSE LEDGER PREVIEW */}
      {/* ========================================================================= */}
      <section id="budget-preview" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F2541B]">
              Frictionless Group Finance
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Built-In Splitwise Ledger & Settle Up
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              No calculators, no debt disputes. Add expenses, auto-split equally or by item, and settle up with 1 tap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Split Card 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Villa Share</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  Paid by Sarah
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">$360.00 Total</h4>
                <p className="text-xs text-slate-500">Split equally among 4 squad members ($90 each)</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>3 of 4 Settled</span>
              </div>
            </div>

            {/* Split Card 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Seaside Seafood Feast</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Paid by Alex
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">$140.00 Total</h4>
                <p className="text-xs text-slate-500">Split among 4 squad members ($35 each)</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-bold">
                Pending Settle
              </div>
            </div>

            {/* Interactive Settle Action Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-[#F2541B] text-white shadow-brand space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">Net Debt Calculation</span>
                </div>
                <h4 className="text-2xl font-black">Alex owes Sarah $45.00</h4>
                <p className="text-xs text-orange-100">
                  Calculated automatically after offsetting the villa share with seafood dinner.
                </p>
              </div>

              <button
                onClick={() => {
                  setDemoSettled(true);
                  triggerGlobiCelebration();
                }}
                className="w-full py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                {demoSettled ? '🎉 Settled & Balanced!' : 'Tap to Settle All Debts'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DESTINATION INSPIRATION GALLERY */}
      {/* ========================================================================= */}
      <section id="destinations" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F2541B]">
              Top World Expeditions
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1">
              Destination Inspiration
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Curated locations with local weather ratings, daily budget forecasts, and squad interest.
            </p>
          </div>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-xs font-bold text-[#F2541B] hover:underline flex items-center gap-1 group"
          >
            <span>Explore All 140+ Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSpots.map((spot, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              onClick={() => setIsAuthOpen(true)}
              className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 aspect-[16/11] cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={spot.image}
                alt={spot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-sm">
                  {spot.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h3 className="text-xl font-bold font-display drop-shadow">
                  {spot.name}
                </h3>
                <div className="flex items-center justify-between text-xs font-semibold text-orange-200">
                  <span>Avg. {spot.budget}</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Plan Squad Itinerary →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OPEN COMMUNITY SQUADS FEED PREVIEW */}
      {/* ========================================================================= */}
      <section id="community-feed" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#F2541B]">
                Live Community Feed
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1">
                Join Open Expeditions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Verified Super Hosts with open spots waiting for solo travelers.
              </p>
            </div>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-bold text-[#F2541B] hover:underline flex items-center gap-1"
            >
              <span>View All Squads</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trips.slice(0, 3).map(trip => {
              const spotsLeft = (trip.maxSpots || 4) - trip.members.length;
              return (
                <div
                  key={trip.id}
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{spotsLeft} Spots Open</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{trip.title}</h4>
                      <span className="text-xs font-bold text-amber-500">★ 4.95</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{trip.description}</p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={trip.hostAvatar} alt={trip.hostName} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{trip.hostName.split(' ')[0]}</span>
                      </div>

                      <button className="px-3.5 py-1.5 rounded-full bg-[#F2541B] text-white font-bold text-xs shadow-sm">
                        Join Squad
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FINAL HIGH-ENERGY CONVERSION BANNER */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F2541B]/25 via-transparent to-[#F2541B]/25 pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-brand animate-flight flex items-center justify-center">
              <img src="/assets/logo-icon.png" alt="GlobTrottler Plane" className="w-full h-full object-cover" />
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              Ready for Your Next Great Expedition?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Start planning your solo itinerary or form an unforgettable group squad with Globi AI companion. Completely free to use.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-8 py-4 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-sm shadow-brand hover:shadow-brand-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Plan My Trip Free</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => login(availableUsers[0])}
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
              >
                ⚡ Instant Reviewer Demo Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. COMPLETE MODERN FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs text-slate-600 dark:text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/assets/logo-icon.png" alt="GlobTrottler" className="w-7 h-7 rounded-xl object-cover" />
                <span className="font-display font-extrabold text-base text-slate-900 dark:text-white">GlobTrottler</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                The modern social travel platform. Plan custom journeys with your AI companion Globi, discover public community itineraries, vote on group activities, and split expenses effortlessly.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Features</h4>
              <ul className="space-y-2">
                <li><a href="#itinerary-preview" className="hover:underline">Multi-City Itinerary Engine</a></li>
                <li><a href="#budget-preview" className="hover:underline">Splitwise Expense Ledger</a></li>
                <li><a href="#how-it-works" className="hover:underline">Collaborative Thumbs-Up Voting</a></li>
                <li><button onClick={() => setIsGlobiOpen(true)} className="hover:underline">Globi AI Companion</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Destinations</h4>
              <ul className="space-y-2">
                <li><a href="#destinations" className="hover:underline">Bali Bliss Expedition</a></li>
                <li><a href="#destinations" className="hover:underline">Kyoto Heritage Journey</a></li>
                <li><a href="#destinations" className="hover:underline">Amalfi Coast Luxury</a></li>
                <li><a href="#destinations" className="hover:underline">Swiss Alps Glacier Route</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Account</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Log In to App</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:underline">Create Free Account</button></li>
                <li><button onClick={() => login(availableUsers[0])} className="hover:underline">Demo Persona Access</button></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 GlobTrottler, Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 font-semibold text-slate-800 dark:text-slate-200">
              <span>🌐 English (US)</span>
              <span>•</span>
              <span>$ USD</span>
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
