import { Router } from "express";
import { Booking } from "../models/booking.model.js";
import { Experience } from "../models/experience.model.js";

const router = Router();

router.post("/bookings", async (req, res) => {
  try {
    const {
      experienceId,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      timeSlot,
      numberOfPeople,
    } = req.body;

    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const targetDate = new Date(bookingDate);
    const availabilityIndex = experience.slotAvailability.findIndex(
      (slot) => slot.date.toDateString() === targetDate.toDateString()
    );

    if (availabilityIndex === -1) {
      return res.status(400).json({ error: "No availability for this date" });
    }

    const timeSlotIndex = experience.slotAvailability[
      availabilityIndex
    ].timeSlots.findIndex((slot) => slot.slot === timeSlot);

    if (timeSlotIndex === -1) {
      return res.status(400).json({ error: "Time slot not found" });
    }

    const availableSlots =
      experience.slotAvailability[availabilityIndex].timeSlots[timeSlotIndex]
        .availableSlots;

    if (availableSlots < numberOfPeople) {
      return res.status(400).json({
        error:
          availableSlots === 0
            ? "This time slot is sold out"
            : `Only ${availableSlots} slots available`,
      });
    }

    const existingBooking = await Booking.findOne({
      experienceId,
      bookingDate: targetDate,
      timeSlot,
      customerEmail,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({
          error: "You already have a booking for this date and time slot",
        });
    }

    experience.slotAvailability[availabilityIndex].timeSlots[
      timeSlotIndex
    ].availableSlots -= numberOfPeople;
    await experience.save();

    const booking = new Booking({
      experienceId,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate: targetDate,
      timeSlot,
      numberOfPeople,
      totalPrice: experience.price * numberOfPeople,
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking: savedBooking,
    });
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Failed to create booking", details: error.message });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("experienceId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const experience = await Experience.findById(booking.experienceId);
    if (experience) {
      const targetDate = booking.bookingDate;
      const availabilityIndex = experience.slotAvailability.findIndex(
        (slot) => slot.date.toDateString() === targetDate.toDateString()
      );

      if (availabilityIndex !== -1) {
        const timeSlotIndex = experience.slotAvailability[
          availabilityIndex
        ].timeSlots.findIndex((slot) => slot.slot === booking.timeSlot);

        if (timeSlotIndex !== -1) {
          experience.slotAvailability[availabilityIndex].timeSlots[
            timeSlotIndex
          ].availableSlots += booking.numberOfPeople;
          await experience.save();
        }
      }
    }

    await Booking.findByIdAndDelete(id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

export default router;
