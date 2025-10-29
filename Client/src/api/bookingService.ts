import { apiClient } from "./client";

export interface Booking {
  _id?: string;
  experienceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: Date;
  timeSlot: string;
  numberOfPeople: number;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "pending";
}

export interface CreateBookingRequest {
  experienceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  timeSlot: string;
  numberOfPeople: number;
}

export const bookingService = {
  async create(
    bookingData: CreateBookingRequest
  ): Promise<{ message: string; booking: Booking }> {
    return await apiClient.post("/bookings", bookingData);
  },

  async getAll(): Promise<Booking[]> {
    return await apiClient.get("/bookings");
  },

  async cancel(id: string): Promise<{ message: string }> {
    return await apiClient.delete(`/bookings/${id}`);
  },

  async getAvailability(experienceId: string, date: string) {
    return await apiClient.get(
      `/experiences/${experienceId}/availability/${date}`
    );
  },
};
