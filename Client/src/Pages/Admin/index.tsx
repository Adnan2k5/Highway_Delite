import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

interface Experience {
  _id?: string;
  title: string;
  location: string;
  description: string;
  dates: string[];
  slots: string[];
  price: number;
  imageUrl: string;
}

interface ExperienceFormData {
  title: string;
  location: string;
  description: string;
  dates: { value: string }[];
  slots: { value: string }[];
  price: number;
  imageUrl: string;
}

const API_BASE_URL = "http://localhost:5000/api"; // Adjust this to your backend URL

export const Admin = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    defaultValues: {
      title: "",
      location: "",
      description: "",
      dates: [{ value: "" }],
      slots: [{ value: "" }],
      price: 0,
      imageUrl: "",
    },
  });

  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: "dates",
  });

  const {
    fields: slotFields,
    append: appendSlot,
    remove: removeSlot,
  } = useFieldArray({
    control,
    name: "slots",
  });

  // Fetch all experiences
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/experiences`);
      if (!response.ok) throw new Error("Failed to fetch experiences");
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      showNotification("Failed to fetch experiences", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create new experience
  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setLoading(true);

      const experienceData = {
        ...data,
        dates: data.dates.map((d) => d.value).filter(Boolean),
        slots: data.slots.map((s) => s.value).filter(Boolean),
      };

      const response = await fetch(`${API_BASE_URL}/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceData),
      });

      if (!response.ok) throw new Error("Failed to create experience");

      showNotification("Experience created successfully!", "success");
      reset();
      if (activeTab === "list") {
        fetchExperiences();
      }
    } catch (error) {
      console.error("Error creating experience:", error);
      showNotification("Failed to create experience", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete experience
  const deleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete experience");

      showNotification("Experience deleted successfully!", "success");
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      showNotification("Failed to delete experience", "error");
    }
  };

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load experiences when switching to list tab
  useEffect(() => {
    if (activeTab === "list") {
      fetchExperiences();
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Experience Management Dashboard
          </h1>
          <p className="text-gray-600">Create and manage your experiences</p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "create"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Create Experience
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Experiences ({experiences.length})
            </button>
          </nav>
        </div>

        {/* Create Experience Tab */}
        {activeTab === "create" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Create New Experience
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter experience title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    {...register("location", {
                      required: "Location is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter experience description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Price must be positive" },
                    })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    {...register("imageUrl", {
                      required: "Image URL is required",
                    })}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.imageUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Dates *
                </label>
                {dateFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input
                      {...register(`dates.${index}.value`, {
                        required: "Date is required",
                      })}
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {dateFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDate(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendDate({ value: "" })}
                  className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  Add Another Date
                </button>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slots *
                </label>
                {slotFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input
                      {...register(`slots.${index}.value`, {
                        required: "Time slot is required",
                      })}
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 9:00 AM - 11:00 AM"
                    />
                    {slotFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendSlot({ value: "" })}
                  className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  Add Another Time Slot
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Experiences Tab */}
        {activeTab === "list" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                All Experiences
              </h2>
              <button
                onClick={fetchExperiences}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading experiences...</div>
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No experiences found. Create your first experience!
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <div
                    key={experience._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={experience.imageUrl}
                      alt={experience.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {experience.location}
                      </p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {experience.description}
                      </p>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Available Dates:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {experience.dates.map((date, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {new Date(date).toLocaleDateString()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Time Slots:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {experience.slots.map((slot, index) => (
                            <span
                              key={index}
                              className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ${experience.price}
                        </span>
                        <button
                          onClick={() => deleteExperience(experience._id!)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
