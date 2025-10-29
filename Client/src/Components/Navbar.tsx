import { useState } from "react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-[87px] py-4 px-4 sm:px-8 lg:px-[120px]">
        <div className="logoflex">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Booking
          </h1>
        </div>

        <div className="hidden md:flex search items-center justify-end gap-4 w-1/2">
          <input
            type="text"
            placeholder="Search experiences"
            className="bg-[#EDEDED] rounded-md px-3 py-2 w-64 lg:w-80"
          />
          <button className="bg-[#FFD643] text-black rounded-md px-4 py-2 hover:bg-[#FFD643]/90 transition-colors">
            Search
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col gap-3 pt-4">
            <input
              type="text"
              placeholder="Search experiences"
              className="bg-[#EDEDED] rounded-md px-3 py-2 w-full"
            />
            <button className="bg-[#FFD643] text-black rounded-md px-4 py-2 w-full hover:bg-[#FFD643]/90 transition-colors">
              Search
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
