import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectdb.js";
import passport from "passport";
import userRoutes from "./routes/userRoutes.js";
import "./config/jwt-passport-strategy.js";

const app = express();
const PORT = process.env.PORT;
const frontendHost = process.env.FRONTEND_HOST;
const dbHost = process.env.DATABASE_URL;

const corsOptions = {
  origin: `${frontendHost}`,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
connectDB(dbHost);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
