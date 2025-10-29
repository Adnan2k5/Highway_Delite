import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
configDotenv();

import experienceRoutes from "./routes/exprecience.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import promoRoutes from "./routes/promo.routes.js";
import { connectDB } from "./config/connectDB.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", experienceRoutes);
app.use("/api", bookingRoutes);
app.use("/api/promo", promoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
