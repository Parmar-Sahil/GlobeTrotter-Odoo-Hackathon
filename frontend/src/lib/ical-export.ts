import { Trip, ItinerarySection, ItineraryItem } from "@/types";

/**
 * Formats a JavaScript Date or YYYY-MM-DD string into iCal datetime format (YYYYMMDDTHHmmSSZ or YYYYMMDD)
 */
function formatICalDate(dateStr: string, timeStr?: string | null): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");

    if (timeStr && timeStr.includes(":")) {
      const [hours, minutes] = timeStr.split(":");
      return `${year}${month}${day}T${hours.padStart(2, "0")}${minutes.padStart(2, "0")}00Z`;
    }

    return `${year}${month}${day}`;
  } catch {
    return "";
  }
}

/**
 * Escapes characters for iCal text fields
 */
function escapeICalText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generates an RFC 5545 compliant .ics string from Trip & Itinerary data
 */
export function generateTripICalendar(trip: Trip, sections: ItinerarySection[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let icsLines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GlobTrottler//Travel Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICalText(trip.title)}`,
    `X-WR-CALDESC:${escapeICalText(trip.description || "GlobeTrotter Trip Itinerary")}`,
  ];

  let eventCounter = 1;

  sections.forEach((section, sIdx) => {
    const sectionDate = section.arrivalDate || section.date || trip.startDate;
    const locationName = section.destination
      ? `${section.destination.name}, ${section.destination.country}`
      : section.title;

    // Add Stop Level summary event if it has start/end date
    if (section.arrivalDate && section.departureDate) {
      const dtStart = formatICalDate(section.arrivalDate);
      const dtEnd = formatICalDate(section.departureDate);
      if (dtStart && dtEnd) {
        icsLines.push(
          "BEGIN:VEVENT",
          `UID:stop-${section.id || sIdx}-${eventCounter++}@globetrotter.app`,
          `DTSTAMP:${timestamp}`,
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:📍 Stop: ${escapeICalText(section.title || section.destination?.name || `Stop ${sIdx + 1}`)}`,
          `LOCATION:${escapeICalText(locationName)}`,
          `DESCRIPTION:${escapeICalText(`Destination Stop in ${locationName}. Activities scheduled: ${section.items?.length || 0}`)}`,
          "STATUS:CONFIRMED",
          "END:VEVENT"
        );
      }
    }

    // Add individual activity events
    (section.items || []).forEach((item, iIdx) => {
      const itemDate = sectionDate;
      const startTime = item.startTime || "09:00";
      let endTime = item.endTime;

      if (!endTime && startTime) {
        const [h, m] = startTime.split(":").map(Number);
        const durationMins = item.durationMinutes || 60;
        const totalMins = h * 60 + m + durationMins;
        const endH = String(Math.floor(totalMins / 60) % 24).padStart(2, "0");
        const endM = String(totalMins % 60).padStart(2, "0");
        endTime = `${endH}:${endM}`;
      }

      const dtStart = formatICalDate(itemDate, startTime);
      const dtEnd = formatICalDate(itemDate, endTime);

      if (dtStart) {
        const descParts: string[] = [];
        if (item.description) descParts.push(item.description);
        if (item.cost && item.cost > 0) descParts.push(`Estimated Cost: ₹${item.cost}`);
        if (item.category) descParts.push(`Category: ${item.category}`);
        descParts.push(`Stop: ${section.title}`);

        icsLines.push(
          "BEGIN:VEVENT",
          `UID:item-${item.id || `${sIdx}-${iIdx}`}-${eventCounter++}@globetrotter.app`,
          `DTSTAMP:${timestamp}`,
          `DTSTART:${dtStart}`,
          dtEnd ? `DTEND:${dtEnd}` : `DTEND:${dtStart}`,
          `SUMMARY:${escapeICalText(item.title)}`,
          `LOCATION:${escapeICalText(locationName)}`,
          `DESCRIPTION:${escapeICalText(descParts.join(" | "))}`,
          "STATUS:CONFIRMED",
          "END:VEVENT"
        );
      }
    });
  });

  icsLines.push("END:VCALENDAR");

  return icsLines.join("\r\n");
}

/**
 * Triggers browser download of .ics file
 */
export function downloadTripICalFile(trip: Trip, sections: ItinerarySection[]): void {
  const icsData = generateTripICalendar(trip, sections);
  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const sanitizedTitle = trip.title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
  link.setAttribute("download", `${sanitizedTitle || "trip"}_itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
