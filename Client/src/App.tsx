import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Details } from "./Pages/Details";
import { Home } from "./Pages/Home";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
