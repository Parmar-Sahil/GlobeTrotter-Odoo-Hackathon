"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useMyTrips } from "@/hooks/use-trips";
import { formatDate } from "@/lib/utils";
import { AvatarEditModal } from "@/components/profile/AvatarEditModal";
import {
  User as UserIcon,
  Mail,
  MapPin,
  Globe,
  DollarSign,
  Shield,
  Save,
  Check,
  LogOut,
  Sparkles,
  Camera,
  ArrowLeft,
  Calendar,
  Lock,
  Compass,
  AlertCircle,
  Phone,
  HelpCircle,
  KeyRound,
  ExternalLink,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    updateProfile,
    isUpdatingProfile,
    logout,
  } = useAuth();

  const { data: tripsData } = useMyTrips();
  const tripCount = user?._count?.trips ?? tripsData?.trips?.length ?? 0;

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  // UI state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form from user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || user.phoneNumber || "");
      setCity(user.city || "");
      setCountry(user.country || "");
      setBio(user.bio || "");
      setLanguage(user.language || user.preferredLanguage || "en");
      setCurrency(user.currency || "USD");
      setIsDirty(false);
    }
  }, [user]);

  // Unauthenticated Redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Compute initials for fallback avatar (e.g. SP or A)
  const userInitials = (() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return "GT";
  })();

  const displayName = (() => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.username || "Traveler";
  })();

  // Form input change tracker
  const handleFieldChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setIsDirty(true);
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  // Form submission handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        bio: bio.trim() || undefined,
        language,
        currency,
      });

      setSavedSuccess(true);
      setIsDirty(false);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Could not update your profile. Please check your information and try again."
      );
    }
  };

  // Avatar update handler
  const handleSaveAvatar = async (avatarUrl: string) => {
    try {
      await updateProfile({
        avatarUrl,
        profilePhotoUrl: avatarUrl,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage("Failed to update avatar photo.");
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfile({
        avatarUrl: "",
        profilePhotoUrl: "",
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage("Failed to remove avatar photo.");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  // Loading Skeletons
  if (authLoading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
          <div className="h-20 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-96 bg-slate-200 rounded-3xl" />
            <div className="lg:col-span-8 h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user && !authLoading) {
    return null;
  }

  const avatarSrc = user?.profilePhotoUrl || user?.avatarUrl;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Page Top Breadcrumb & Header */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Link
                href="/dashboard"
                className="hover:text-[#7C2D12] transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <span>/</span>
              <span className="text-[#F95724]">My Profile</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <UserIcon className="w-7 h-7 text-[#F95724]" />
              Account Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Manage your personal credentials, contact info, and regional travel preferences
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/trips"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F5] border border-orange-200 text-slate-700 hover:bg-orange-50 text-xs font-bold transition-all shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5 text-[#F95724]" />
              View My Itineraries
            </Link>
          </div>
        </div>

        {/* Success / Error Feedback Toasts */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="font-bold">
                ✓ Profile updated successfully. Changes are synchronized across your account.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-700 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Grid: Left Column User Identity / Right Column Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Avatar & Account Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-7 text-center space-y-5 shadow-xs">
              {/* Avatar with Camera Overlay */}
              <div className="relative inline-block mx-auto group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-orange-950/15 bg-[#2A0E06] ring-2 ring-orange-200">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#7C2D12] via-[#9A3412] to-[#F95724] text-white flex items-center justify-center text-3xl font-black">
                      {userInitials}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white shadow-md shadow-orange-950/30 transition-all hover:scale-110 active:scale-95"
                  title="Change Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name & Handle */}
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 truncate">
                  {displayName}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  @{user?.username || "user"}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-[#7C2D12] border border-orange-200">
                    <Sparkles className="w-3 h-3 text-[#F95724]" />
                    GlobeTrotter Member
                  </span>
                </div>
              </div>

              {/* Quick Account Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-orange-100/70 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-orange-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Trips Created
                  </span>
                  <p className="text-base font-extrabold text-[#7C2D12]">
                    {tripCount}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-orange-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Account Status
                  </span>
                  <p className="text-base font-extrabold text-emerald-600 uppercase text-xs pt-1">
                    Active
                  </p>
                </div>
              </div>

              {/* Account Meta & Security Shortcuts */}
              <div className="pt-2 space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Member Since</span>
                  <span className="font-bold text-slate-700">
                    {user?.createdAt ? formatDate(user.createdAt) : "August 2026"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Role</span>
                  <span className="font-bold text-slate-700 uppercase text-[11px]">
                    {user?.role || "Traveler"}
                  </span>
                </div>

                <Link
                  href="/forgot-password"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F5] hover:bg-orange-50 text-slate-700 hover:text-[#7C2D12] transition-colors font-bold text-xs border border-orange-100"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#F95724]" />
                    Reset Account Password
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of GlobeTrotter
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Personal Info Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-xs space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Section 1: Personal Information */}
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-orange-100/70 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-[#F95724]" />
                      Personal Information
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your public traveler identity and contact information
                    </p>
                  </div>

                  {isDirty && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 animate-pulse">
                      • Unsaved changes
                    </span>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => handleFieldChange(setFirstName, e.target.value)}
                      placeholder="e.g. Sahil"
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => handleFieldChange(setLastName, e.target.value)}
                      placeholder="e.g. Parmar"
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                    />
                  </div>
                </div>

                {/* Username & Email (Read-only Account Details) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Username</span>
                      <span className="text-[10px] text-slate-400 lowercase font-normal">
                        (unique identifier)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={user?.username || ""}
                        className="w-full px-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-600 font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Email Address</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (managed by account)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        readOnly
                        disabled
                        value={user?.email || ""}
                        className="w-full px-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-600 font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handleFieldChange(setPhone, e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Home City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => handleFieldChange(setCity, e.target.value)}
                      placeholder="e.g. San Francisco"
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Home Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => handleFieldChange(setCountry, e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
                    />
                  </div>
                </div>

                {/* Travel Bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Travel Bio & Interests</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({bio.length}/300 characters)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={bio}
                    onChange={(e) => handleFieldChange(setBio, e.target.value)}
                    placeholder="Tell fellow travelers about your travel style (e.g. adventure trails, historic architecture, local culinary street food)..."
                    className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-normal focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724] leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 2: Regional & App Preferences */}
              <div className="space-y-5 pt-2">
                <div className="border-b border-orange-100/70 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#F95724]" />
                    Regional & Currency Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set default localization and currency formatting for your trips and budget views
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => handleFieldChange(setLanguage, e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium cursor-pointer"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español (Spanish)</option>
                      <option value="fr">Français (French)</option>
                      <option value="de">Deutsch (German)</option>
                      <option value="ja">日本語 (Japanese)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Default Currency Display
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => handleFieldChange(setCurrency, e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium cursor-pointer"
                    >
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="JPY">JPY (¥ - Japanese Yen)</option>
                      <option value="CAD">CAD (C$ - Canadian Dollar)</option>
                      <option value="AUD">AUD (A$ - Australian Dollar)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit / Save Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span>* Email address is managed directly via authentication</span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => {
                        if (user) {
                          setFirstName(user.firstName || "");
                          setLastName(user.lastName || "");
                          setPhone(user.phone || user.phoneNumber || "");
                          setCity(user.city || "");
                          setCountry(user.country || "");
                          setBio(user.bio || "");
                          setLanguage(user.language || user.preferredLanguage || "en");
                          setCurrency(user.currency || "USD");
                          setIsDirty(false);
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Reset
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white font-bold text-xs shadow-md shadow-orange-950/20 transition-all hover:scale-103 active:scale-98 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Saving Profile...
                      </>
                    ) : savedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Avatar Edit Modal */}
        <AvatarEditModal
          isOpen={isAvatarModalOpen}
          currentAvatarUrl={avatarSrc}
          userInitials={userInitials}
          onClose={() => setIsAvatarModalOpen(false)}
          onSaveAvatar={handleSaveAvatar}
          onRemoveAvatar={handleRemoveAvatar}
        />

        {/* Sign Out Confirmation Modal */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-sm p-6 space-y-5 animate-in zoom-in-95 duration-150 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  Sign out of GlobeTrotter?
                </h3>
                <p className="text-xs text-slate-500">
                  You will need to log back in to access your planned trips and custom itineraries.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
