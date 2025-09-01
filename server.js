import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routers
import loginRouter from "./routes/loginRoute.js";
import signupRouter from "./routes/signupRoute.js";
import logoutRouter from "./routes/logoutRoute.js";
import postRouter from "./routes/postRoute.js";
import searchRouter from "./routes/searchRoute.js";
import authRouter from "./routes/authRoute.js";
import updateProfil from "./routes/updateProfil.js";

app.use("/api", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/posts", postRouter);
app.use("/search", searchRouter);
app.use("/gate", authRouter);
app.use("/api/users", updateProfil);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
