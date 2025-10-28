import { Link } from "react-router-dom";
import { Navbar } from "../../Components/Navbar";

const dates = [
  { label: "Oct 22", highlighted: true },
  { label: "Oct 23" },
  { label: "Oct 24" },
  { label: "Oct 25" },
  { label: "Oct 26" },
];

const times = [
  { label: "07:00 am", status: "4 left", color: "text-orange-500" },
  { label: "9:00 am", status: "2 left", color: "text-red-500" },
  { label: "11:00 am", status: "5 left", color: "text-orange-500" },
  { label: "1:00 pm", status: "Sold out", soldOut: true },
];

export const Details = () => {
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
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
              alt="Kayaking"
              className="h-80 w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold text-gray-900">Kayaking</h1>
              <p className="text-lg leading-8 text-gray-700">
                Curated small-group experience. Certified guide. Safety first
                with gear included. Helmet and life jackets along with an expert
                will accompany in kayaking.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Choose date
              </span>
              <div className="flex flex-wrap gap-3">
                {dates.map((date) => (
                  <span
                    key={date.label}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                      date.highlighted
                        ? "border-[#FFD643] bg-[#FFD643] text-gray-900"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {date.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Choose time
              </span>
              <div className="flex flex-wrap gap-3">
                {times.map((time) => (
                  <div
                    key={time.label}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                      time.soldOut
                        ? "border-gray-200 bg-gray-100 text-gray-400"
                        : "border-gray-200 bg-white text-gray-800"
                    }`}
                  >
                    <span>{time.label}</span>
                    <span
                      className={`text-xs font-medium ${
                        time.soldOut ? "text-gray-400" : time.color
                      }`}
                    >
                      {time.status}
                    </span>
                  </div>
                ))}
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
                ₹999
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Quantity</span>
              <div className="flex items-center rounded-full border border-gray-200">
                <button
                  type="button"
                  className="px-3 py-1 text-lg font-semibold text-gray-500 hover:text-gray-900"
                >
                  -
                </button>
                <span className="px-4 text-base font-semibold text-gray-900">
                  1
                </span>
                <button
                  type="button"
                  className="px-3 py-1 text-lg font-semibold text-gray-500 hover:text-gray-900"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="text-base font-semibold text-gray-900">
                ₹999
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Taxes</span>
              <span className="text-base font-semibold text-gray-900">₹59</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-4 text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>₹958</span>
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-xl bg-gray-200 py-3 text-base font-semibold text-gray-500"
            disabled
          >
            Confirm
          </button>
        </aside>
      </main>
    </div>
  );
};
