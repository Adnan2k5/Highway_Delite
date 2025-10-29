import { Router } from "express";
import { Experience } from "../models/experience.model.js";
const routes = Router();

routes.get("/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return res.json(experiences);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

routes.get("/experiences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }
    return res.json(experience);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch experience" });
  }
});

routes.post("/experiences", async (req, res) => {
  try {
    const experienceData = req.body;

    const slotAvailability = [];

    experienceData.dates.forEach((date) => {
      const timeSlots = experienceData.slots.map((slot) => ({
        slot: slot,
        totalSlots: experienceData.slotsPerTimeSlot || 10,
        availableSlots: experienceData.slotsPerTimeSlot || 10,
      }));

      slotAvailability.push({
        date: new Date(date),
        timeSlots: timeSlots,
      });
    });

    const experienceToSave = {
      ...experienceData,
      slotAvailability: slotAvailability,
    };

    const newExperience = new Experience(experienceToSave);
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create experience", details: error.message });
  }
});

routes.delete("/experiences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExperience = await Experience.findByIdAndDelete(id);
    if (!deletedExperience) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

routes.get("/experiences/:id/availability/:date", async (req, res) => {
  try {
    const { id, date } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const targetDate = new Date(date);
    const availabilityForDate = experience.slotAvailability.find(
      (slot) => slot.date.toDateString() === targetDate.toDateString()
    );

    if (!availabilityForDate) {
      return res.status(404).json({ error: "No availability for this date" });
    }

    res.json(availabilityForDate);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

export default routes;
