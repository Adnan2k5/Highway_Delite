import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/exprecience.routes";
import { connectDB } from "./config/connectDB";
import { configDotenv } from "dotenv";
const app = express();
const PORT = process.env.PORT || 8000;

configDotenv();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
