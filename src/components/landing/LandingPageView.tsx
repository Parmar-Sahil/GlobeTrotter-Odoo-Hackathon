import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Heart,
  Copy,
  UserPlus,
  Flame,
  Award,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Vote,
  Receipt,
  CheckCircle2,
  Star,
  ShieldCheck,
  Plane,
  ChevronRight,
  Bot,
  Play
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { BrandLogo, BrandPlaneIcon } from '../common/BrandLogo';
import { TripCard } from '../trips/TripCard';
import { MOCK_DESTINATIONS } from '../../data/mockDestinations';
import { Trip } from '../../types/travel';
import { JoinRequestModal } from '../trips/JoinRequestModal';
import { GlobiChatModal } from '../mascot/GlobiChatModal';

export const LandingPageView: React.FC<{
  onOpenCreateTrip: () => void;
  onOpenOnboarding: () => void;
  onTriggerLoading?: () => void;
}> = ({ onOpenCreateTrip, onOpenOnboarding, onTriggerLoading }) => {
  const { trips, setCurrentView, triggerGlobiCelebration } = useTravel();
  const [selectedTripForJoin, setSelectedTripForJoin] = useState<Trip | null>(null);
  const [isGlobiChatOpen, setIsGlobiChatOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'mascot' | 'social' | 'voting' | 'splitwise'>('mascot');

  const featuredTrips = trips.slice(0, 3);

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Super Host & Digital Nomad',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      quote: 'Hosting open trips on GlobTrottler changed everything. Elena and Alex joined my Bali squad, and Globi kept our itinerary on track without any stress!',
      destination: 'Bali Expedition • 6 Co-Travelers'
    },
    {
      name: 'Alex Rivera',
      role: 'Adventure Photographer',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      quote: 'The collaborative voting feature is genius. I proposed a sunrise hike on Mount Batur, the squad voted thumbs up, and we booked it directly.',
      destination: 'Kyoto & Amalfi Coast'
    },
    {
      name: 'Elena Rostova',
      role: 'Solo Backpacker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: 'I used to struggle splitting villa and scooter bills with strangers. The built-in Splitwise ledger calculates who owes whom and settles in 1 click.',
      destination: 'Swiss Alps & Jaipur'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-12 animate-fadeIn overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#F2541B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 shadow-sm animate-bounce [animation-duration:3s]">
            <BrandPlaneIcon className="w-4 h-4" />
            <span className="text-xs font-extrabold text-[#F2541B] tracking-wide uppercase">
              The Next-Gen Social Travel Companion
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Plan Together. <br />
            <span className="text-[#F2541B]">Squad Up</span> Anywhere.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The modern travel platform with an active AI companion named <strong>Globi</strong>. Discover public community itineraries, vote on group activities, and split expenses effortlessly.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onOpenCreateTrip}
              className="px-7 py-3.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-sm shadow-brand hover:shadow-brand-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Start Planning Free</span>
            </button>

            <button
              onClick={() => setCurrentView('discover')}
              className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#F2541B]" />
              <span>Explore Open Trips</span>
            </button>

            <button
              onClick={() => setIsGlobiChatOpen(true)}
              className="px-5 py-3.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F2541B]" />
              <span>Meet Globi Mascot</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">4.9/5 Rating</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F2541B]" />
              <span>12,000+ Expeditions Formed</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>140+ Destinations</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-4 sm:p-6 space-y-5">
            {/* Mockup Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">app.globtrottler.com/bali-expedition</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ● 4 Co-Travelers Online
                </span>
              </div>
            </div>

            {/* Mockup Trip Hero Banner */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
              <img
                src="/assets/dest_bali.jpg"
                alt="Bali Bliss"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Floating Pill: Globi Companion Nudge */}
              <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 max-w-xs animate-bounce [animation-duration:4s]">
                <img src="/assets/globi_hero.jpg" alt="Globi" className="w-8 h-8 rounded-xl object-cover" />
                <div className="text-[11px] leading-tight">
                  <p className="font-bold text-slate-900 dark:text-white">Globi Companion</p>
                  <p className="text-slate-500 dark:text-slate-400">Day 3 afternoon has 2 hours free. Add sunset drinks?</p>
                </div>
              </div>

              {/* Floating Pill: Live Proposal Voting */}
              <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 space-y-1.5 hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">Proposal</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Mount Batur Sunrise Hike</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>3 Votes 👍</span>
                  <span className="font-bold text-emerald-600">Accepted by Host</span>
                </div>
              </div>

              {/* Trip Title */}
              <div className="absolute bottom-4 left-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F2541B] uppercase tracking-wider">
                  Open to Join (2 Spots Left)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display mt-1">
                  Bali Bliss & Sacred Temples Expedition
                </h3>
                <p className="text-xs text-orange-200">Hosted by Sarah Jenkins • Oct 10 - 17, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR SUPERPOWERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F2541B]">
            Why Modern Explorers Choose Us
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Everything You Need to Travel as a Squad
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Say goodbye to messy spreadsheets, forgotten bills, and fragmented group chats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Globi AI */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center text-[#F2541B]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Proactive AI Mascot
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Globi doesn't just wait for questions. He actively detects schedule gaps, monitors budget thresholds, and suggests 1-click activities.
            </p>
          </div>

          {/* Pillar 2: Open Joinable Trips */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Open Joinable Squads
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Browse public expeditions or mark your trip "Open to Join". Travelers submit request notes, and hosts approve before adding them to chat.
            </p>
          </div>

          {/* Pillar 3: Collaborative Voting */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Collaborative Itinerary
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every squad member can propose activities. The group votes thumbs up/down, and the host accepts confirmed items with 1 click.
            </p>
          </div>

          {/* Pillar 4: Splitwise Ledger */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Splitwise Expense Sync
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Automatic bilateral debt calculations (*"Alex owes Sarah $45"*), visual spending donut charts, and celebratory 1-tap "Settle Up".
            </p>
          </div>
        </div>
      </section>

      {/* 3. GLOBI MASCOT SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#F2541B] text-xs font-bold border border-orange-200 dark:border-orange-900/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Meet Globi AI</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Your Proactive 3D Mascot & Travel Co-Pilot
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike boring chatbot sidebars, Globi is an expressive companion that celebrates milestones, alerts you before you exceed budget limits, and suggests personalized hidden spots.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Packing Checklists:</strong> Instant climate-tailored essentials</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Cultural Etiquette:</strong> Temple rules and local tips</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Budget Guardian:</strong> Flags category overspending immediately</span>
                </div>
              </div>

              <button
                onClick={() => setIsGlobiChatOpen(true)}
                className="px-6 py-3 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-bold text-xs shadow-brand flex items-center gap-2 active:scale-95 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Chat with Globi Now</span>
              </button>
            </div>

            {/* Mascot Poses Carousel Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm animate-globi-soft">
                  <img src="/assets/globi_hero.jpg" alt="Hero Globi" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Hero Aviator</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Ready for takeoff</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm animate-globi-soft">
                  <img src="/assets/globi_idea.jpg" alt="Idea Globi" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Idea Generator</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">1-click suggestion chips</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm animate-globi-soft">
                  <img src="/assets/globi_budget.jpg" alt="Budget Globi" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Budget Guardian</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Shields against overspending</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm animate-globi-soft">
                  <img src="/assets/globi_celebrate.jpg" alt="Celebrate Globi" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Celebration</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Milestone confetti & stamps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DISCOVER COMMUNITY TRIPS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F2541B]">
              Real Community Journeys
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1">
              Join Open Squads or Clone Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Click any trip to inspect its day-by-day route, squad roster, and budget breakdown.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('discover')}
            className="text-xs font-bold text-[#F2541B] hover:underline flex items-center gap-1 group"
          >
            <span>Browse All Community Trips</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onRequestJoin={t => setSelectedTripForJoin(t)}
            />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS IN 3 STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F2541B]">
            Simple 3-Step Flow
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            How GlobTrottler Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#F2541B] font-extrabold flex items-center justify-center text-lg shadow-sm">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Create or Clone</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Launch your dream itinerary from scratch with cover art, dates, and budget, or clone a verified community plan in 1 click.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-lg shadow-sm">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Squad Up & Vote</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mark open spots, accept traveler requests, chat in the per-trip room, run live polls, and vote on activity proposals.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-lg shadow-sm">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Travel & Settle</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Follow your timeline calendar, track shared expenses in the Splitwise ledger, and settle up with one tap at the end!
            </p>
          </div>
        </div>
      </section>

      {/* 6. TRAVELER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F2541B]">
            Community Testimonials
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Loved by Travelers Everywhere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex text-amber-500 text-xs">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HIGH-ENERGY CONVERSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F2541B]/20 via-transparent to-[#F2541B]/20 pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-brand animate-flight">
              <BrandPlaneIcon size={56} />
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              Your Next Great Expedition Starts Here.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join thousands of modern explorers planning solo and squad journeys with Globi AI. Completely free to start.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenCreateTrip}
                className="px-8 py-3.5 rounded-full bg-[#F2541B] hover:bg-[#d9440f] text-white font-extrabold text-sm shadow-brand hover:shadow-brand-lg active:scale-95 transition-all"
              >
                Plan Your Trip Now
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
              >
                Open App Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <JoinRequestModal
        isOpen={Boolean(selectedTripForJoin)}
        onClose={() => setSelectedTripForJoin(null)}
        trip={selectedTripForJoin}
      />
      <GlobiChatModal
        isOpen={isGlobiChatOpen}
        onClose={() => setIsGlobiChatOpen(false)}
      />
    </div>
  );
};
