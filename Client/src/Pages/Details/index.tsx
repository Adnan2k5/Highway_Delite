import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Navbar";
import { useState, useEffect } from "react";
import { experienceService, bookingService } from "../../api";
import type { Experience } from "../../api/types";

const formatDate = (date: string | Date) => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return dateObj.toLocaleDateString("en-US", options);
};

export const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slotAvailability, setSlotAvailability] = useState<any>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) {
        setError("No experience ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await experienceService.getById(id);
        setExperience(data);
        if (data.dates.length > 0) {
          setSelectedDate(data.dates[0].toString());
        }
      } catch (err) {
        setError("Failed to load experience details");
        console.error("Error fetching experience:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!id || !selectedDate) return;

      try {
        const availability = await bookingService.getAvailability(
          id,
          selectedDate
        );
        setSlotAvailability(availability);
        setSelectedTime("");
        setQuantity(1);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    fetchAvailability();
  }, [id, selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      setQuantity(1);
    }
  }, [selectedTime]);

  const handleProceedToCheckout = () => {
    if (!id || !selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    const selectedSlot = slotAvailability?.timeSlots?.find(
      (slot: any) => slot.slot === selectedTime
    );
    if (selectedSlot && quantity > selectedSlot.availableSlots) {
      alert(
        `Only ${selectedSlot.availableSlots} slots available for this time slot`
      );
      return;
    }

    const subtotal = experience!.price * quantity;
    const taxes = Math.round(subtotal * 0.059);
    const total = subtotal + taxes;

    navigate("/checkout", {
      state: {
        experienceId: id,
        experienceTitle: experience!.title,
        experiencePrice: experience!.price,
        selectedDate,
        selectedTime,
        quantity,
        subtotal,
        taxes,
        total,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg text-red-600">
            {error || "Experience not found"}
          </div>
        </div>
      </div>
    );
  }

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.059);
  const total = subtotal + taxes;
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <section className="flex-1 space-y-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
          >
            <span className="text-lg">&lt;</span>
            Details
          </Link>

          <div className="overflow-hidden rounded-3xl bg-white shadow">
            <img
              src={experience.imageUrl}
              alt={experience.title}
              className="h-80 w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold text-gray-900">
                {experience.title}
              </h1>
              <p className="text-lg leading-8 text-gray-700">
                {experience.description}
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Choose date
              </span>
              <div className="flex flex-wrap gap-3">
                {experience.dates.map((date) => {
                  const formattedDate = formatDate(date);
                  return (
                    <button
                      key={date.toString()}
                      onClick={() => setSelectedDate(date.toString())}
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedDate === date.toString()
                          ? "border-[#FFD643] bg-[#FFD643] text-gray-900"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {formattedDate}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Choose time
              </span>
              <div className="flex flex-wrap gap-3">
                {slotAvailability?.timeSlots?.map((timeSlot: any) => {
                  const availableSlots = timeSlot.availableSlots;
                  const soldOut = availableSlots === 0;
                  const status = soldOut
                    ? "Sold out"
                    : availableSlots <= 2
                    ? `${availableSlots} left`
                    : `${availableSlots} available`;
                  const color = soldOut
                    ? "text-gray-400"
                    : availableSlots <= 2
                    ? "text-red-500"
                    : availableSlots <= 5
                    ? "text-orange-500"
                    : "text-green-500";

                  return (
                    <button
                      key={timeSlot.slot}
                      onClick={() => !soldOut && setSelectedTime(timeSlot.slot)}
                      disabled={soldOut}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        soldOut
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selectedTime === timeSlot.slot
                          ? "border-[#FFD643] bg-[#FFD643] text-gray-900"
                          : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                      }`}
                    >
                      <span>{timeSlot.slot}</span>
                      <span
                        className={`text-xs font-medium ${
                          soldOut ? "text-gray-400" : color
                        }`}
                      >
                        {status}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                About
              </span>
              <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
                Scenic routes, trained guides, and safety briefing. Minimum age
                10.
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg">
          <div className="space-y-4 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Starts at</span>
              <span className="text-base font-semibold text-gray-900">
                ₹{experience.price}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex flex-col">
                <span>Quantity</span>
                {selectedTime && slotAvailability && (
                  <span className="text-xs text-gray-500">
                    {(() => {
                      const selectedSlot = slotAvailability.timeSlots.find(
                        (slot: any) => slot.slot === selectedTime
                      );
                      return selectedSlot
                        ? `${selectedSlot.availableSlots} available`
                        : "";
                    })()}
                  </span>
                )}
              </div>
              <div className="flex items-center rounded-full border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-lg font-semibold text-gray-500 hover:text-gray-900"
                >
                  -
                </button>
                <span className="px-4 text-base font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const selectedSlot = slotAvailability?.timeSlots?.find(
                      (slot: any) => slot.slot === selectedTime
                    );
                    const maxAvailable = selectedSlot
                      ? selectedSlot.availableSlots
                      : 999;
                    setQuantity(Math.min(maxAvailable, quantity + 1));
                  }}
                  className="px-3 py-1 text-lg font-semibold text-gray-500 hover:text-gray-900"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="text-base font-semibold text-gray-900">
                ₹{subtotal}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Taxes</span>
              <span className="text-base font-semibold text-gray-900">
                ₹{taxes}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-4 text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            type="button"
            onClick={handleProceedToCheckout}
            className={`mt-2 w-full rounded-xl py-3 text-base font-semibold transition-colors ${
              selectedDate && selectedTime
                ? "bg-[#FFD643] text-gray-900 hover:bg-[#f5b400]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedDate || !selectedTime}
          >
            Confirm
          </button>
        </aside>
      </main>
    </div>
  );
};
