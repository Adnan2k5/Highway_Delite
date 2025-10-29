import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  experienceService,
  bookingService,
  type Experience,
  type Booking,
} from "../../api";

interface ExperienceFormData {
  title: string;
  location: string;
  description: string;
  dates: { value: string }[];
  slots: { startTime: string; endTime: string }[];
  slotsPerTimeSlot: number;
  price: number;
  imageUrl: string;
}

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const Admin = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "list" | "bookings">(
    "create"
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
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
      slots: [{ startTime: "", endTime: "" }],
      slotsPerTimeSlot: 10,
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

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    []
  );

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await experienceService.getAll();
      setExperiences(data);
    } catch (error) {
      showNotification("Failed to fetch experiences", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      showNotification("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setLoading(true);

      const experienceData = {
        ...data,
        dates: data.dates
          .map((d) => new Date(d.value))
          .filter((date) => !isNaN(date.getTime())),
        slots: data.slots
          .filter((s) => s.startTime && s.endTime)
          .map((s) => `${formatTime(s.startTime)} - ${formatTime(s.endTime)}`),
      };

      await experienceService.create(experienceData);

      showNotification("Experience created successfully!", "success");
      reset();
      if (activeTab === "list") {
        fetchExperiences();
      }
    } catch (error) {
      showNotification("Failed to create experience", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      await experienceService.delete(id);
      showNotification("Experience deleted successfully!", "success");
      fetchExperiences();
    } catch (error) {
      showNotification("Failed to delete experience", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchExperiences();
    } else if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchExperiences, fetchBookings]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchExperiences(), fetchBookings()]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    loadInitialData();
  }, [fetchExperiences, fetchBookings]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Experience Management Dashboard
          </h1>
          <p className="text-gray-600">Create and manage your experiences</p>
        </div>

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
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bookings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bookings ({bookings.length})
            </button>
          </nav>
        </div>

        {activeTab === "create" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Create New Experience
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slots Per Time Slot *
                  </label>
                  <input
                    {...register("slotsPerTimeSlot", {
                      required: "Number of slots is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must have at least 1 slot" },
                    })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10"
                  />
                  {errors.slotsPerTimeSlot && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.slotsPerTimeSlot.message}
                    </p>
                  )}
                </div>

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
                  className="mt-2 px-4 py-2 text-sm font-medium text-black bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  Add Another Date
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slots *
                </label>
                {slotFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Start Time
                        </label>
                        <input
                          {...register(`slots.${index}.startTime`, {
                            required: "Start time is required",
                          })}
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          End Time
                        </label>
                        <input
                          {...register(`slots.${index}.endTime`, {
                            required: "End time is required",
                          })}
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
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
                  onClick={() => appendSlot({ startTime: "", endTime: "" })}
                  className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  Add Another Time Slot
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#FFD643] text-black font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        )}
        {activeTab === "list" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                All Experiences
              </h2>
              <button
                onClick={fetchExperiences}
                className="px-4 py-2 bg-[#FFD643] text-black font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                        {experience.location}
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

        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                All Bookings ({bookings.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg text-gray-600">Loading bookings...</div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No bookings found
                </div>
                <p className="text-gray-400">
                  Bookings will appear here once customers start booking
                  experiences.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        People
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerEmail}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(booking as any).experienceId?.title ||
                              "Experience"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.timeSlot}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.numberOfPeople}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{booking.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {booking.status === "confirmed" && (
                            <button
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Are you sure you want to cancel this booking?"
                                  )
                                ) {
                                  try {
                                    await bookingService.cancel(booking._id!);
                                    showNotification(
                                      "Booking cancelled successfully",
                                      "success"
                                    );
                                    fetchBookings();
                                  } catch (error) {
                                    showNotification(
                                      "Failed to cancel booking",
                                      "error"
                                    );
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
