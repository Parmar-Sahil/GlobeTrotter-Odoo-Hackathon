"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { AppLayout } from "@/components/layout/AppLayout";
import { createTripSchema, CreateTripFormData } from "@/schemas/trip.schema";
import { useTripMutations } from "@/hooks/use-trips";
import {
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Globe,
  ArrowLeft,
  Sparkles,
  Plane,
  Lock,
  Users,
} from "lucide-react";
import Link from "next/link";

const PRESET_COVERS = [
  {
    name: "Paris / Europe",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Tokyo / Asia",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Tropical Coast",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Alpine Mountains",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80",
  },
];

export default function NewTripPage() {
  const router = useRouter();
  const { createTrip, isCreating } = useTripMutations();
  const [selectedPreset, setSelectedPreset] = useState(PRESET_COVERS[0].url);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      budgetLimit: undefined,
      currency: "USD",
      coverImage: PRESET_COVERS[0].url,
      visibility: "PRIVATE",
    },
  });

  const currentCover = watch("coverImage");

  const onSubmit = async (data: CreateTripFormData) => {
    try {
      setServerError(null);
      const trip = await createTrip({
        title: data.title,
        description: data.description || undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        budgetLimit: data.budgetLimit ? Number(data.budgetLimit) : undefined,
        currency: data.currency,
        coverImage: data.coverImage || selectedPreset,
        visibility: data.visibility,
      });

      router.push(`/trips/${trip.id}`);
    } catch (err: any) {
      setServerError(
        err.message || "Failed to create trip itinerary. Please try again."
      );
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back navigation */}
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Trips
        </Link>

        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Plane className="w-6 h-6" />
            </span>
            Create Your Next Trip
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Set up the basics for your itinerary. You will be able to add multiple cities, activities, and budget goals right after.
          </p>
        </div>

        {serverError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {serverError}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8"
        >
          {/* Trip Details Section */}
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Trip Essentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trip Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Summer in Southern Italy & Sicily"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.title && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Notes (Optional)
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="e.g. Exploring ancient ruins, relaxing by the Amalfi coast, and authentic culinary experiences..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.description && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Dates Section */}
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Travel Dates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.startDate && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.endDate && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Budget & Visibility Section */}
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Budget & Privacy
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Budget Target (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    {...register("budgetLimit")}
                    placeholder="2500"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                {errors.budgetLimit && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.budgetLimit.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Visibility
                </label>
                <select
                  {...register("visibility")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="PRIVATE">Private (Only me)</option>
                  <option value="PUBLIC">Public (Visible with link)</option>
                  <option value="FRIENDS">Shared (Collaborators only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Image Selection */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              Cover Image
            </h2>

            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose a curated destination cover or paste your custom image URL:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_COVERS.map((preset) => {
                  const isSelected =
                    currentCover === preset.url ||
                    (!currentCover && selectedPreset === preset.url);
                  return (
                    <div
                      key={preset.name}
                      onClick={() => {
                        setSelectedPreset(preset.url);
                        setValue("coverImage", preset.url);
                      }}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all relative h-24 ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-500/30 scale-102 shadow-md"
                          : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                        <span className="text-[11px] font-bold text-white leading-tight">
                          {preset.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <input
                  type="text"
                  {...register("coverImage")}
                  placeholder="Or paste a custom image URL..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.coverImage && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              href="/trips"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isCreating ? "Creating Itinerary..." : "Create & Start Planning"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
