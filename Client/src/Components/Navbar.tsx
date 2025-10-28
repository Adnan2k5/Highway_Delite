export const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between h-[87px] py-4 px-[120px]  bg-white shadow-sm border-b border-gray-200">
      <div className="logoflex">
        <h1>Booking</h1>
      </div>
      <div className="search w-1/2 items-center flex justify-end gap-4">
        <input
          type="text"
          placeholder="Search experiences"
          className="bg-[#EDEDED] rounded-md px-3 py-2 w-80"
        />
        <button className="bg-[#FFD643] text-black rounded-md px-4 py-2 ml-2">
          Search
        </button>
      </div>
    </nav>
  );
};
