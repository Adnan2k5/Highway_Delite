import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { Navbar } from "../../Components/Navbar";
import {
  bookingService,
  promoService,
  type PromoValidationResponse,
} from "../../api";

interface CheckoutState {
  experienceId: string;
  experienceTitle: string;
  experiencePrice: number;
  selectedDate: string;
  selectedTime: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as CheckoutState;

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    promoCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [promoValidation, setPromoValidation] =
    useState<PromoValidationResponse | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleSearch = useCallback(() => {}, []);
  const validateBookingData = (data: CheckoutState | null): boolean => {
    if (!data) return false;

    const requiredFields = [
      "experienceId",
      "experienceTitle",
      "experiencePrice",
      "selectedDate",
      "selectedTime",
      "quantity",
      "subtotal",
      "taxes",
      "total",
    ];

    return requiredFields.every(
      (field) =>
        data[field as keyof CheckoutState] !== undefined &&
        data[field as keyof CheckoutState] !== null &&
        data[field as keyof CheckoutState] !== ""
    );
  };

  if (!bookingData || !validateBookingData(bookingData)) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Navbar onSearch={handleSearch} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invalid or missing booking data
            </h2>
            <p className="text-gray-600 mb-4">
              Please start your booking process from the beginning.
            </p>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)]{8,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, "")))
      return "Please enter a valid phone number";
    return null;
  };

  const validateName = (name: string): string | null => {
    if (!name) return "Name is required";
    if (name.trim().length < 2)
      return "Name must be at least 2 characters long";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name should only contain letters and spaces";
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const nameError = validateName(formData.customerName);
    if (nameError) errors.customerName = nameError;

    const emailError = validateEmail(formData.customerEmail);
    if (emailError) errors.customerEmail = emailError;

    const phoneError = validatePhone(formData.customerPhone);
    if (phoneError) errors.customerPhone = phoneError;
    const bookingDate = new Date(bookingData.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      setError(
        "The selected booking date has already passed. Please choose a future date."
      );
      return false;
    }
    if (bookingData.quantity <= 0) {
      setError(
        "Invalid quantity. Please ensure you have selected at least 1 person."
      );
      return false;
    }
    if (bookingData.total <= 0) {
      setError("Invalid booking amount. Please recalculate your booking.");
      return false;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePromoValidation = async () => {
    if (!formData.promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError(null);

      const response = await promoService.validatePromo({
        promoCode: formData.promoCode,
        totalAmount: bookingData.total,
      });

      if (response.success) {
        setPromoValidation(response);
        setPromoError(null);
      } else {
        setPromoError(response.message);
        setPromoValidation(null);
      }
    } catch (err: any) {
      setPromoError(err.message || "Failed to validate promo code");
      setPromoValidation(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoValidation(null);
    setPromoError(null);
    setFormData({ ...formData, promoCode: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
  };

  const getFinalTotal = () => {
    return promoValidation?.finalAmount ?? bookingData.total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please correct the errors below");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and safety policy");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.create({
        experienceId: bookingData.experienceId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingDate: bookingData.selectedDate,
        timeSlot: bookingData.selectedTime,
        numberOfPeople: bookingData.quantity,
      });

      navigate("/booking-confirmed", {
        state: {
          bookingId: response.booking._id,
          customerName: formData.customerName,
          experienceTitle: bookingData.experienceTitle,
          bookingDate: bookingData.selectedDate,
          timeSlot: bookingData.selectedTime,
          quantity: bookingData.quantity,
          total: getFinalTotal(),
          originalTotal: bookingData.total,
          promoApplied: promoValidation?.promo || null,
          discountAmount: promoValidation?.discountAmount || 0,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar onSearch={handleSearch} />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <section className="flex-1">
          <Link
            to={`/experience/${bookingData.experienceId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 mb-8"
          >
            <span className="text-lg">&lt;</span>
            Checkout
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Complete your booking
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      fieldErrors.customerName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Your name"
                  />
                  {fieldErrors.customerName && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) =>
                      handleInputChange("customerEmail", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      fieldErrors.customerEmail
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Your email"
                  />
                  {fieldErrors.customerEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleInputChange("customerPhone", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.customerPhone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Your phone number"
                />
                {fieldErrors.customerPhone && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.customerPhone}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => {
                      setFormData({ ...formData, promoCode: e.target.value });
                      if (promoValidation) {
                        setPromoValidation(null);
                      }
                      if (promoError) {
                        setPromoError(null);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Promo code (e.g., SAVE10, FLAT100)"
                    disabled={!!promoValidation}
                  />
                  {!promoValidation ? (
                    <button
                      type="button"
                      onClick={handlePromoValidation}
                      disabled={promoLoading || !formData.promoCode.trim()}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {promoLoading ? "Validating..." : "Apply"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={removePromo}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {promoError && (
                  <div className="text-sm text-red-600">{promoError}</div>
                )}

                {promoValidation && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                    ✓ {promoValidation.message}
                    <br />
                    <span className="font-medium">
                      Discount: ₹{promoValidation.discountAmount?.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#FFD643] text-gray-900 font-semibold rounded-md hover:bg-[#f5b400] focus:outline-none focus:ring-2 focus:ring-[#FFD643] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay and Confirm"}
              </button>
            </form>
          </div>
        </section>

        <aside className="w-full max-w-sm">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">Experience</p>
                <p className="text-gray-600">{bookingData.experienceTitle}</p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Date</p>
                <p className="text-gray-600">
                  {new Date(bookingData.selectedDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Time</p>
                <p className="text-gray-600">{bookingData.selectedTime}</p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Qty</p>
                <p className="text-gray-600">{bookingData.quantity}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{bookingData.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes</span>
                <span className="text-gray-900">₹{bookingData.taxes}</span>
              </div>
              {promoValidation && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({promoValidation.promo?.code})</span>
                  <span>-₹{promoValidation.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ₹{getFinalTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
