"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Trip, ItinerarySection, ItineraryItem, ActivityCategory } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTripMutations } from "@/hooks/use-trips";
import { TimelineQuickEditModal } from "./timeline/TimelineQuickEditModal";
import { CalendarMonthGrid } from "./timeline/CalendarMonthGrid";
import { DayScheduleHourlyView } from "./timeline/DayScheduleHourlyView";
import { AddActivityModal } from "../itinerary/AddActivityModal";
import { AddStopModal } from "../itinerary/AddStopModal";
import { downloadTripICalFile } from "@/lib/ical-export";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  GripVertical,
  Edit2,
  Trash2,
  AlertTriangle,
  Layers,
  LayoutGrid,
  ListOrdered,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  CloudSun,
  Compass,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";

export type CalendarViewMode = "timeline" | "month" | "hourly";

interface CalendarViewProps {
  trip: Trip;
  sections: ItinerarySection[];
}

export function CalendarView({ trip, sections: initialSections }: CalendarViewProps) {
  const [localSections, setLocalSections] = useState<ItinerarySection[]>(initialSections);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("timeline");

  // Keep localSections synced when props change
  useEffect(() => {
    setLocalSections(initialSections);
  }, [initialSections]);

  const {
    updateItem,
    deleteItem,
    addItem,
    addSection,
    updateSection,
    deleteSection,
  } = useTripMutations(trip.id);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [costFilter, setCostFilter] = useState<"ALL" | "FREE" | "PAID">("ALL");

  // Accordion Expand/Collapse state for each section
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Modals state
  const [quickEditItem, setQuickEditItem] = useState<{
    item: ItineraryItem;
    sectionId: string;
  } | null>(null);

  const [activeSectionForAddActivity, setActiveSectionForAddActivity] =
    useState<ItinerarySection | null>(null);
  const [presetStartTimeForAdd, setPresetStartTimeForAdd] = useState<string | undefined>(undefined);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);

  // Drag and Drop state
  const [draggedItemInfo, setDraggedItemInfo] = useState<{
    itemId: string;
    sourceSectionId: string;
  } | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  // Category Color Map
  const categoryConfig: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    SIGHTSEEING: {
      label: "Sightseeing",
      bg: "bg-orange-50",
      text: "text-[#7C2D12]",
      border: "border-orange-200",
      dot: "bg-[#F95724]",
    },
    FOOD_DRINK: {
      label: "Food & Dining",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    CULTURE: {
      label: "Culture",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    ADVENTURE: {
      label: "Adventure",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    RELAXATION: {
      label: "Relaxation",
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
      dot: "bg-teal-500",
    },
    NIGHTLIFE: {
      label: "Nightlife",
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    SHOPPING: {
      label: "Shopping",
      bg: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    OTHER: {
      label: "Other",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-500",
    },
  };

  // Weather icons / presets based on index
  const weatherPresets = [
    { temp: "24°C", text: "Sunny & Clear", icon: Sun },
    { temp: "21°C", text: "Partly Cloudy", icon: CloudSun },
    { temp: "19°C", text: "Pleasant Breeze", icon: CloudSun },
    { temp: "26°C", text: "Warm & Sunny", icon: Sun },
  ];

  // Helper to get time of day grouping
  const getTimePeriod = (timeStr?: string | null) => {
    if (!timeStr || !timeStr.includes(":")) return { label: "Flexible Time", icon: Sparkles };
    const h = parseInt(timeStr.split(":")[0], 10);
    if (h < 12) return { label: "Morning", icon: Sunrise };
    if (h < 17) return { label: "Afternoon", icon: Sun };
    if (h < 21) return { label: "Evening", icon: Sunset };
    return { label: "Night", icon: Moon };
  };

  // Convert time to minutes from midnight
  const timeToMinutes = (timeStr?: string | null) => {
    if (!timeStr || !timeStr.includes(":")) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  // Check for time conflicts within a list of items
  const getItemWithConflictCheck = (items: ItineraryItem[]) => {
    return items.map((item, idx) => {
      const startMin = timeToMinutes(item.startTime);
      const duration = item.durationMinutes || 60;
      const endMin =
        timeToMinutes(item.endTime) ??
        (startMin !== null ? startMin + duration : null);

      let hasConflict = false;

      if (startMin !== null && endMin !== null) {
        items.forEach((other, oIdx) => {
          if (idx === oIdx) return;
          const otherStart = timeToMinutes(other.startTime);
          const otherDuration = other.durationMinutes || 60;
          const otherEnd =
            timeToMinutes(other.endTime) ??
            (otherStart !== null ? otherStart + otherDuration : null);

          if (otherStart !== null && otherEnd !== null) {
            if (startMin < otherEnd && endMin > otherStart) {
              hasConflict = true;
            }
          }
        });
      }

      return {
        ...item,
        hasConflict,
      };
    });
  };

  // Filter sections and items based on search query, category, and price
  const filteredSections = useMemo(() => {
    return localSections.map((sec) => {
      const rawItems = sec.items || [];
      const checkedItems = getItemWithConflictCheck(rawItems);

      const items = checkedItems.filter((item) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title?.toLowerCase().includes(q);
          const matchesDesc = item.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "ALL") {
          const itemCat = item.category || item.activity?.category || "SIGHTSEEING";
          if (itemCat !== selectedCategory) return false;
        }

        // Cost filter
        if (costFilter === "FREE" && (item.cost || 0) > 0) return false;
        if (costFilter === "PAID" && (item.cost || 0) === 0) return false;

        return true;
      });

      // Sort items chronologically by startTime
      items.sort((a, b) => {
        const tA = timeToMinutes(a.startTime) ?? 9999;
        const tB = timeToMinutes(b.startTime) ?? 9999;
        return tA - tB;
      });

      const totalCost = items.reduce((acc, i) => acc + (i.cost || 0), 0);

      return {
        ...sec,
        items,
        totalCost,
      };
    });
  }, [localSections, searchQuery, selectedCategory, costFilter]);

  const totalCalculatedExpenses = filteredSections.reduce(
    (acc, sec) => acc + sec.totalCost,
    0
  );

  const totalScheduledActivities = filteredSections.reduce(
    (acc, sec) => acc + (sec.items?.length || 0),
    0
  );

  // Global expand / collapse all
  const allCollapsed =
    localSections.length > 0 &&
    localSections.every((sec) => collapsedSections[sec.id]);

  const handleToggleExpandAll = () => {
    if (allCollapsed) {
      setCollapsedSections({});
    } else {
      const newMap: Record<string, boolean> = {};
      localSections.forEach((sec) => {
        newMap[sec.id] = true;
      });
      setCollapsedSections(newMap);
    }
  };

  const handleToggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Reordering: Move activity up or down
  const handleMoveActivity = (
    sectionId: string,
    itemId: string,
    direction: "up" | "down"
  ) => {
    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId || !sec.items) return sec;
        const items = [...sec.items];
        const idx = items.findIndex((i) => i.id === itemId);
        if (idx === -1) return sec;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= items.length) return sec;

        const temp = items[idx];
        items[idx] = items[targetIdx];
        items[targetIdx] = temp;
        return { ...sec, items };
      })
    );
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    itemId: string,
    sourceSectionId: string
  ) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ itemId, sourceSectionId }));
    e.dataTransfer.effectAllowed = "move";
    setDraggedItemInfo({ itemId, sourceSectionId });
  };

  const handleDragOver = (e: React.DragEvent, targetItemId?: string, targetSectionId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (targetItemId) setDragOverItemId(targetItemId);
    if (targetSectionId) setDragOverSectionId(targetSectionId);
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetSectionId: string,
    targetItemId?: string
  ) => {
    e.preventDefault();
    setDragOverItemId(null);
    setDragOverSectionId(null);

    if (!draggedItemInfo) return;
    const { itemId, sourceSectionId } = draggedItemInfo;
    setDraggedItemInfo(null);

    // If dropped in same place, no-op
    if (sourceSectionId === targetSectionId && itemId === targetItemId) return;

    // Find the item
    let draggedItem: ItineraryItem | null = null;
    localSections.forEach((sec) => {
      if (sec.id === sourceSectionId) {
        const found = sec.items?.find((i) => i.id === itemId);
        if (found) draggedItem = found;
      }
    });

    if (!draggedItem) return;

    // Update local state optimistically
    setLocalSections((prev) => {
      // Remove from source
      const cleaned = prev.map((sec) => {
        if (sec.id === sourceSectionId) {
          return {
            ...sec,
            items: (sec.items || []).filter((i) => i.id !== itemId),
          };
        }
        return sec;
      });

      // Insert into target
      return cleaned.map((sec) => {
        if (sec.id === targetSectionId) {
          const items = [...(sec.items || [])];
          if (targetItemId) {
            const targetIdx = items.findIndex((i) => i.id === targetItemId);
            if (targetIdx !== -1) {
              items.splice(targetIdx, 0, { ...draggedItem!, sectionId: targetSectionId });
              return { ...sec, items };
            }
          }
          items.push({ ...draggedItem!, sectionId: targetSectionId });
          return { ...sec, items };
        }
        return sec;
      });
    });

    // If moved between different sections, persist stopId update
    if (sourceSectionId !== targetSectionId) {
      try {
        await updateItem({
          itemId,
          tripId: trip.id,
          data: { stopId: targetSectionId },
        });
      } catch (err) {
        console.error("Failed to persist item section change:", err);
      }
    }
  };

  // Quick edit save handler
  const handleSaveQuickEdit = async (
    itemId: string,
    updatedData: {
      title: string;
      description?: string;
      category?: ActivityCategory;
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      cost?: number;
      stopId?: string;
    }
  ) => {
    // Update local state
    setLocalSections((prev) =>
      prev.map((sec) => {
        let items = sec.items || [];
        // If moving to another section
        if (updatedData.stopId && updatedData.stopId !== sec.id) {
          items = items.filter((i) => i.id !== itemId);
        } else if (sec.id === (updatedData.stopId || sec.id)) {
          items = items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  ...updatedData,
                  cost: updatedData.cost ?? i.cost,
                }
              : i
          );
        }
        return { ...sec, items };
      })
    );

    // If destination section changed, append to target section
    if (updatedData.stopId) {
      setLocalSections((prev) =>
        prev.map((sec) => {
          if (sec.id === updatedData.stopId) {
            const existing = sec.items?.some((i) => i.id === itemId);
            if (!existing) {
              const itemObj = localSections
                .flatMap((s) => s.items || [])
                .find((i) => i.id === itemId);
              if (itemObj) {
                return {
                  ...sec,
                  items: [...(sec.items || []), { ...itemObj, ...updatedData }],
                };
              }
            }
          }
          return sec;
        })
      );
    }

    // Persist via mutation
    await updateItem({
      itemId,
      tripId: trip.id,
      data: {
        title: updatedData.title,
        description: updatedData.description,
        category: updatedData.category,
        startTime: updatedData.startTime,
        endTime: updatedData.endTime,
        durationMinutes: updatedData.durationMinutes,
        cost: updatedData.cost,
        stopId: updatedData.stopId,
      },
    });
  };

  // Delete activity handler
  const handleDeleteActivity = async (itemId: string) => {
    setLocalSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        items: (sec.items || []).filter((i) => i.id !== itemId),
      }))
    );

    await deleteItem({
      itemId,
      tripId: trip.id,
    });
  };

  // Add activity modal submit
  const handleAddActivitySubmit = async (data: {
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    cost?: number;
    activityId?: string;
    category?: ActivityCategory;
  }) => {
    if (!activeSectionForAddActivity) return;
    const sectionId = activeSectionForAddActivity.id;

    await addItem({
      sectionId,
      tripId: trip.id,
      data: {
        ...data,
        startTime: data.startTime || presetStartTimeForAdd || "10:00",
      },
    });
  };

  // Add stop modal submit
  const handleAddStopSubmit = async (data: {
    destinationId?: string;
    title: string;
    arrivalDate?: string;
    departureDate?: string;
  }) => {
    await addSection({
      id: trip.id,
      data,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Toolbar: Mode Switcher & Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-orange-100 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#F95724]" />
              Trip Timeline & Schedule
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Chronological day-by-day visualization, hourly rails, interactive calendar matrix, and drag-and-drop reordering
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-[#FAF7F5] rounded-full border border-orange-200/80">
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "timeline"
                    ? "bg-[#7C2D12] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Timeline Stream
              </button>

              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "month"
                    ? "bg-[#7C2D12] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Calendar Grid
              </button>

              <button
                type="button"
                onClick={() => setViewMode("hourly")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  viewMode === "hourly"
                    ? "bg-[#7C2D12] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                Hourly Day Schedule
              </button>
            </div>

            {/* iCal Export Button */}
            <button
              type="button"
              onClick={() => downloadTripICalFile(trip, localSections)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F5] border border-orange-200 text-slate-700 hover:bg-orange-50 text-xs font-bold transition-all shadow-2xs"
              title="Download iCal (.ics) file to sync with Apple / Google / Outlook Calendar"
            >
              <Download className="w-3.5 h-3.5 text-[#F95724]" />
              Export iCal (.ics)
            </button>

            {/* Add Stop Button */}
            <button
              type="button"
              onClick={() => setIsAddStopOpen(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all hover:scale-103 active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Travel Stop
            </button>
          </div>
        </div>

        {/* 2. Compact Metric Highlights & Search/Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-orange-100/70">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter activities by title or notes..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium cursor-pointer"
            >
              <option value="ALL">All Categories ({totalScheduledActivities})</option>
              <option value="SIGHTSEEING">Sightseeing</option>
              <option value="FOOD_DRINK">Food & Dining</option>
              <option value="CULTURE">Culture</option>
              <option value="ADVENTURE">Adventure</option>
              <option value="RELAXATION">Relaxation</option>
              <option value="NIGHTLIFE">Nightlife</option>
              <option value="SHOPPING">Shopping</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Price Filter Pill */}
          <div className="md:col-span-2">
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium cursor-pointer"
            >
              <option value="ALL">All Prices</option>
              <option value="FREE">Free Only</option>
              <option value="PAID">Paid Only</option>
            </select>
          </div>

          {/* Expand/Collapse Toggle & Stats */}
          <div className="md:col-span-3 flex items-center justify-end gap-3">
            {viewMode === "timeline" && (
              <button
                type="button"
                onClick={handleToggleExpandAll}
                className="text-xs font-bold text-[#7C2D12] hover:underline flex items-center gap-1"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {allCollapsed ? "Expand All Days" : "Collapse All Days"}
              </button>
            )}

            <span className="text-xs font-extrabold text-[#7C2D12] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
              {formatCurrency(totalCalculatedExpenses)} Total
            </span>
          </div>
        </div>
      </div>

      {/* 3. Render View Modes */}
      {viewMode === "month" ? (
        <CalendarMonthGrid
          trip={trip}
          sections={localSections}
          onQuickEditActivity={(item, sectionId) =>
            setQuickEditItem({ item, sectionId })
          }
          onAddActivityToSection={(section) => {
            setActiveSectionForAddActivity(section);
            setPresetStartTimeForAdd(undefined);
          }}
        />
      ) : viewMode === "hourly" ? (
        <DayScheduleHourlyView
          trip={trip}
          sections={localSections}
          onQuickEditActivity={(item, sectionId) =>
            setQuickEditItem({ item, sectionId })
          }
          onAddActivityToSection={(section, presetTime) => {
            setActiveSectionForAddActivity(section);
            setPresetStartTimeForAdd(presetTime);
          }}
          onDeleteActivity={handleDeleteActivity}
        />
      ) : (
        /* Vertical Timeline Stream View */
        <div className="space-y-8 animate-in fade-in duration-200">
          {filteredSections.length > 0 ? (
            <div className="relative pl-6 sm:pl-10 border-l-2 border-orange-200/90 space-y-12 ml-4 sm:ml-6">
              {filteredSections.map((section, idx) => {
                const isCollapsed = !!collapsedSections[section.id];
                const weather = weatherPresets[idx % weatherPresets.length];
                const WeatherIcon = weather.icon;
                const isDragOverSec = dragOverSectionId === section.id;

                return (
                  <div
                    key={section.id || idx}
                    onDragOver={(e) => handleDragOver(e, undefined, section.id)}
                    onDrop={(e) => handleDrop(e, section.id)}
                    className={`relative space-y-5 transition-all ${
                      isDragOverSec ? "scale-[1.01]" : ""
                    }`}
                  >
                    {/* Glowing Timeline Marker Node */}
                    <div className="absolute -left-[37px] sm:-left-[53px] top-3.5 w-8 h-8 rounded-full bg-[#7C2D12] border-4 border-white text-white flex items-center justify-center font-black text-xs shadow-md shadow-orange-950/20 ring-2 ring-orange-300">
                      {idx + 1}
                    </div>

                    {/* Day / Stop Accordion Header Card */}
                    <div className="bg-gradient-to-r from-[#2A0E06] via-[#3B150A] to-[#5C2314] text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-orange-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#F95724]" />
                            <h3 className="text-lg font-extrabold text-white truncate">
                              {section.title || section.destination?.name || `Stop ${idx + 1}`}
                            </h3>
                          </div>
                          {section.destination?.country && (
                            <span className="text-xs font-bold text-orange-300">
                              • {section.destination.country}
                            </span>
                          )}

                          {/* Weather Forecast Badge */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-200 text-[11px] font-medium backdrop-blur-md">
                            <WeatherIcon className="w-3.5 h-3.5 text-amber-300" />
                            {weather.temp} {weather.text}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#F95724]" />
                            {section.arrivalDate ? formatDate(section.arrivalDate) : "Flexible date"}
                            {section.departureDate ? ` – ${formatDate(section.departureDate)}` : ""}
                          </span>
                          <span>•</span>
                          <span>
                            {section.items?.length || 0}{" "}
                            {section.items?.length === 1 ? "Activity" : "Activities"}
                          </span>
                        </div>
                      </div>

                      {/* Header Actions: Day Spend & Collapse Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Day Spend
                          </span>
                          <span className="text-base font-extrabold text-white">
                            {formatCurrency(section.totalCost)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionForAddActivity(section);
                            setPresetStartTimeForAdd(undefined);
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#F95724] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          Add Activity
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSectionCollapse(section.id)}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label={isCollapsed ? "Expand Stop" : "Collapse Stop"}
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Activities Grid / List */}
                    {!isCollapsed && (
                      <div className="space-y-3 pt-1">
                        {section.items && section.items.length > 0 ? (
                          <div className="space-y-3">
                            {section.items.map((item, itemIdx) => {
                              const period = getTimePeriod(item.startTime);
                              const PeriodIcon = period.icon;
                              const cat = item.category || item.activity?.category || "SIGHTSEEING";
                              const catStyle =
                                categoryConfig[cat] || categoryConfig.SIGHTSEEING;

                              const isFirst = itemIdx === 0;
                              const isLast = itemIdx === (section.items?.length || 0) - 1;
                              const isDraggingThis = draggedItemInfo?.itemId === item.id;
                              const isDragTarget = dragOverItemId === item.id;

                              return (
                                <div
                                  key={item.id || itemIdx}
                                  draggable={true}
                                  onDragStart={(e) =>
                                    handleDragStart(e, item.id, section.id)
                                  }
                                  onDragOver={(e) =>
                                    handleDragOver(e, item.id, section.id)
                                  }
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) =>
                                    handleDrop(e, section.id, item.id)
                                  }
                                  className={`group bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    isDraggingThis
                                      ? "opacity-40 border-dashed border-orange-400 scale-95"
                                      : isDragTarget
                                      ? "border-[#F95724] ring-2 ring-orange-400/40 bg-orange-50/40"
                                      : item.hasConflict
                                      ? "border-amber-300 bg-amber-50/30"
                                      : "border-orange-100 hover:border-orange-200"
                                  }`}
                                >
                                  <div className="flex items-start gap-3.5 min-w-0">
                                    {/* Drag Handle & Reorder buttons */}
                                    <div className="flex items-center gap-1 shrink-0 pt-1 sm:pt-0">
                                      <div
                                        className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-600 rounded-md transition-colors"
                                        title="Drag to reorder across stops or time slots"
                                      >
                                        <GripVertical className="w-4 h-4" />
                                      </div>

                                      <div className="flex flex-col items-center gap-0.5">
                                        <button
                                          type="button"
                                          disabled={isFirst}
                                          onClick={() =>
                                            handleMoveActivity(section.id, item.id, "up")
                                          }
                                          className="p-0.5 rounded text-slate-300 hover:text-slate-900 disabled:opacity-20 transition-colors"
                                          aria-label="Move Up"
                                        >
                                          <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={isLast}
                                          onClick={() =>
                                            handleMoveActivity(section.id, item.id, "down")
                                          }
                                          className="p-0.5 rounded text-slate-300 hover:text-slate-900 disabled:opacity-20 transition-colors"
                                          aria-label="Move Down"
                                        >
                                          <ChevronDown className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Activity Image / Thumbnail */}
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                      {item.activity?.imageUrl ? (
                                        <img
                                          src={item.activity.imageUrl}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-orange-50 text-[#F95724]">
                                          <Sparkles className="w-5 h-5" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Activity Information */}
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                                          {item.title}
                                        </h4>

                                        {/* Category Pill */}
                                        <span
                                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                                        >
                                          {cat.replace("_", " ")}
                                        </span>

                                        {/* Time of day pill */}
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F5] border border-slate-200/70 text-[10px] font-bold text-slate-600">
                                          <PeriodIcon className="w-3 h-3 text-[#F95724]" />
                                          {period.label}
                                        </span>

                                        {/* Overlap Conflict Pill */}
                                        {item.hasConflict && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-bold">
                                            <AlertTriangle className="w-3 h-3" /> Time overlap
                                          </span>
                                        )}
                                      </div>

                                      {item.description && (
                                        <p className="text-xs text-slate-500 line-clamp-1 font-normal">
                                          {item.description}
                                        </p>
                                      )}

                                      {/* Time & Duration Meta */}
                                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                                        {item.startTime && (
                                          <span className="flex items-center gap-1 text-slate-700 font-bold">
                                            <Clock className="w-3.5 h-3.5 text-[#F95724]" />
                                            {item.startTime} {item.endTime ? `– ${item.endTime}` : ""}
                                          </span>
                                        )}
                                        {item.durationMinutes && (
                                          <span className="font-medium">
                                            • {item.durationMinutes} mins
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Cost & Edit/Delete Controls */}
                                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                    <span className="text-sm font-extrabold text-[#7C2D12]">
                                      {item.cost && item.cost > 0
                                        ? formatCurrency(item.cost)
                                        : "Free"}
                                    </span>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setQuickEditItem({
                                            item,
                                            sectionId: section.id,
                                          })
                                        }
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#7C2D12] hover:bg-orange-50 transition-colors"
                                        title="Quick Edit Activity"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteActivity(item.id)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                        title="Remove Activity"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Empty Stop State with Drop Zone */
                          <div
                            onDragOver={(e) => handleDragOver(e, undefined, section.id)}
                            onDrop={(e) => handleDrop(e, section.id)}
                            className="text-center py-8 bg-white rounded-3xl border border-dashed border-orange-200 space-y-2"
                          >
                            <Sparkles className="w-6 h-6 text-orange-300 mx-auto" />
                            <p className="text-xs text-slate-500 font-medium">
                              No activities scheduled for this stop yet. Drag activities here or click below to schedule.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSectionForAddActivity(section);
                                setPresetStartTimeForAdd(undefined);
                              }}
                              className="text-xs font-bold text-[#7C2D12] hover:underline"
                            >
                              + Add first activity to this stop
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-3xl bg-orange-50 text-[#F95724] flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  No stops found
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {searchQuery || selectedCategory !== "ALL"
                    ? "No activities match your current search and category filters."
                    : "Add your first destination stop to generate the chronological timeline."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStopOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20"
              >
                <Plus className="w-4 h-4" />
                Add First Stop
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Modals */}
      {/* Quick Edit Modal */}
      {quickEditItem && (
        <TimelineQuickEditModal
          isOpen={!!quickEditItem}
          item={quickEditItem.item}
          currentSectionId={quickEditItem.sectionId}
          sections={localSections}
          onClose={() => setQuickEditItem(null)}
          onSave={handleSaveQuickEdit}
          onDelete={handleDeleteActivity}
        />
      )}

      {/* Add Activity Modal */}
      {activeSectionForAddActivity && (
        <AddActivityModal
          isOpen={!!activeSectionForAddActivity}
          onClose={() => setActiveSectionForAddActivity(null)}
          onAddActivity={handleAddActivitySubmit}
          destinationId={activeSectionForAddActivity.destinationId}
          stopTitle={activeSectionForAddActivity.title}
        />
      )}

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        onAddStop={handleAddStopSubmit}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
      />
    </div>
  );
}
