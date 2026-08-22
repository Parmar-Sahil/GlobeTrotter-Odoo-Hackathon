import * as tripCoreService from './services/trip-core.service';
import * as tripItineraryService from './services/trip-itinerary.service';
import * as tripCalendarService from './services/trip-calendar.service';

export class TripFacade {
  // Core Trip Operations
  static async createTrip(userId: string, data: any) {
    return await tripCoreService.createTrip(userId, data);
  }

  static async getUserTrips(userId: string, query: any) {
    return await tripCoreService.getUserTrips(userId, query);
  }

  static async getTripById(tripId: string, userId?: string) {
    return await tripCoreService.getTripById(tripId, userId);
  }

  static async updateTrip(tripId: string, userId: string, data: any) {
    return await tripCoreService.updateTrip(tripId, userId, data);
  }

  static async deleteTrip(tripId: string, userId: string) {
    return await tripCoreService.deleteTrip(tripId, userId);
  }

  // Itinerary & Section Operations
  static async addSectionToTrip(tripId: string, userId: string, data: any) {
    return await tripItineraryService.addSectionToTrip(tripId, userId, data);
  }

  static async addItemToSection(sectionId: string, userId: string, data: any) {
    return await tripItineraryService.addItemToSection(sectionId, userId, data);
  }

  static async updateItineraryItem(itemId: string, userId: string, data: any) {
    return await tripItineraryService.updateItineraryItem(itemId, userId, data);
  }

  static async deleteItineraryItem(itemId: string, userId: string) {
    return await tripItineraryService.deleteItineraryItem(itemId, userId);
  }

  static async updateTripSection(sectionId: string, userId: string, data: any) {
    return await tripItineraryService.updateTripSection(sectionId, userId, data);
  }

  static async deleteTripSection(sectionId: string, userId: string) {
    return await tripItineraryService.deleteTripSection(sectionId, userId);
  }

  static async getTripItinerary(tripId: string) {
    return await tripItineraryService.getTripItinerary(tripId);
  }

  static async getBudgetSummary(tripId: string) {
    return await tripItineraryService.getBudgetSummary(tripId);
  }

  // Calendar View Operations
  static async getUserCalendarEvents(userId: string, year?: number, month?: number) {
    return await tripCalendarService.getUserCalendarEvents(userId, year, month);
  }
}
