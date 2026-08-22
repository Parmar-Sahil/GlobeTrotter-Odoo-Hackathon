import React, { useState } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPageView } from './components/landing/LandingPageView';
import { HomeDashboardView } from './components/home/HomeDashboardView';
import { DiscoverFeed } from './components/discover/DiscoverFeed';
import { MyTripsView } from './components/trips/MyTripsView';
import { TripDetailView } from './components/trips/TripDetailView';
import { DestinationCatalog } from './components/discover/DestinationCatalog';
import { PassportProfileView } from './components/profile/PassportProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CreateTripModal } from './components/trips/CreateTripModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { GlobiChatModal } from './components/mascot/GlobiChatModal';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView } = useTravel();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isFloatingGlobiOpen, setIsFloatingGlobiOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPageView
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onTriggerLoading={() => setShowLoadingDemo(true)}
          />
        );
      case 'discover':
        return <DiscoverFeed onOpenCreateTrip={() => setIsCreateTripOpen(true)} />;
      case 'trips':
        return <MyTripsView onOpenCreateTrip={() => setIsCreateTripOpen(true)} />;
      case 'trip-detail':
      case 'itinerary':
      case 'budget':
      case 'chat':
        return <TripDetailView />;
      case 'catalog':
        return <DestinationCatalog onOpenCreateTrip={() => setIsCreateTripOpen(true)} />;
      case 'profile':
        return <PassportProfileView />;
      case 'admin':
        return <AdminDashboard />;
      case 'home':
      default:
        return (
          <HomeDashboardView
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#F2541B] selection:text-white relative bg-[#FAFAFA] dark:bg-[#0B0F17] transition-colors duration-200">
      {/* Flight Takeoff Loading Screen on initial launch */}
      {isInitialLoading && (
        <LoadingScreen
          minDurationMs={1800}
          onComplete={() => setIsInitialLoading(false)}
        />
      )}

      {/* Manual Demo Loading Screen trigger */}
      {showLoadingDemo && (
        <LoadingScreen
          minDurationMs={2000}
          onComplete={() => setShowLoadingDemo(false)}
        />
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onTriggerLoading={() => setShowLoadingDemo(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full pb-12">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer onOpenOnboarding={() => setIsOnboardingOpen(true)} />

      {/* Floating Globi AI Mascot Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsFloatingGlobiOpen(true)}
          className="relative group flex items-center gap-2.5 p-2 pr-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-slate-800 animate-globi-soft flex-shrink-0">
            <img src="/assets/globi_hero.jpg" alt="Globi Mascot" className="w-full h-full object-cover" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <span>Globi</span>
              <Sparkles className="w-3 h-3 text-[#F2541B] animate-pulse" />
            </p>
            <p className="text-[10px] text-[#F2541B] font-medium">AI Companion</p>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>
      </div>

      {/* Modals */}
      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <GlobiChatModal
        isOpen={isFloatingGlobiOpen}
        onClose={() => setIsFloatingGlobiOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}
