import { apiClient } from "./client";
import type { Experience, CreateExperienceRequest } from "./types";

export const experienceService = {
  getAll: async (): Promise<Experience[]> => {
    return apiClient.get("/experiences");
  },

  getById: async (id: string): Promise<Experience> => {
    return apiClient.get(`/experiences/${id}`);
  },

  create: async (data: CreateExperienceRequest): Promise<Experience> => {
    return apiClient.post("/experiences", data);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/experiences/${id}`);
  },
};
