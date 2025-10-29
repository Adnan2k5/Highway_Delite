import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Details } from "./Pages/Details";
import { Home } from "./Pages/Home";
import { Checkout } from "./Pages/Checkout";
import { BookingConfirmed } from "./Pages/BookingConfirmed";
import "./App.css";
import { Admin } from "./Pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience/:id" element={<Details />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
