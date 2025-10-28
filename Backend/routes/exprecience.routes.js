import { Router } from "express";
import { Experience } from "../models/experience.model";
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
    const newExperience = new Experience(experienceData);
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
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
    console.error("Error deleting experience:", error);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

export default routes;
