export interface Experience {
  _id?: string;
  title: string;
  location: string;
  description: string;
  dates: Date[];
  slots: string[];
  slotAvailability?: Array<{
    date: Date;
    timeSlots: Array<{
      slot: string;
      totalSlots: number;
      availableSlots: number;
    }>;
  }>;
  price: number;
  imageUrl: string;
}

export interface CreateExperienceRequest {
  title: string;
  location: string;
  description: string;
  dates: Date[];
  slots: string[];
  slotsPerTimeSlot: number;
  price: number;
  imageUrl: string;
}
