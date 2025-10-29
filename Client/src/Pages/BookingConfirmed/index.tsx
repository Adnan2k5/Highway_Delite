import { useLocation, Link } from "react-router-dom";
import { Navbar } from "../../Components/Navbar";

interface ConfirmationState {
  bookingId: string;
  customerName: string;
  experienceTitle: string;
  bookingDate: string;
  timeSlot: string;
  quantity: number;
  total: number;
}

export const BookingConfirmed = () => {
  const location = useLocation();
  const confirmationData = location.state as ConfirmationState;

  const generateRefId = (bookingId: string) => {
    return bookingId ? bookingId.slice(-6).toUpperCase() : "HUF56&SO";
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No booking data found
            </h2>
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

  const refId = generateRefId(confirmationData.bookingId);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Booking Confirmed
          </h1>

          <p className="text-gray-600 mb-8">
            Ref ID: <span className="font-medium">{refId}</span>
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="text-gray-900 font-medium">
                  {confirmationData.customerName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="text-gray-900 font-medium">
                  {confirmationData.experienceTitle}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(confirmationData.bookingDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="text-gray-900 font-medium">
                  {confirmationData.timeSlot}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="text-gray-900 font-medium">
                  {confirmationData.quantity}{" "}
                  {confirmationData.quantity === 1 ? "person" : "people"}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <span className="text-gray-900 font-semibold">Total Paid:</span>
                <span className="text-gray-900 font-semibold">
                  ₹{confirmationData.total}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};
