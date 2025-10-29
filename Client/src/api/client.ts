const API_BASE_URL = "https://highway-delite-1hnq.vercel.app/api";

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    return result;
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    return result;
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    return result;
  },
};
