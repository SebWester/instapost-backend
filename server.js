import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:3000",
      "http://192.168.68.105:8081",
      "http://192.168.68.105:3000", // Lägg till din lokala IP för React Native
      "exp://192.168.68.105:8081",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
    abortOnLimit: false,
    responseOnLimit: "File size limit has been reached",
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    debug: process.env.NODE_ENV !== "production",
  })
);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

app.use("/uploads", express.static(uploadsDir));

// Routers
import loginRouter from "./routes/loginRoute.js";
import signupRouter from "./routes/signupRoute.js";
import logoutRouter from "./routes/logoutRoute.js";
import postRouter from "./routes/postRoute.js";
import searchRouter from "./routes/searchRoute.js";
import authRouter from "./routes/authRoute.js";
import updateProfil from "./routes/updateProfil.js";
import userRoute from "./routes/userRoute.js";

app.use("/api", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/posts", postRouter);
app.use("/search", searchRouter);
app.use("/gate", authRouter);
app.use("/api/users", updateProfil);
app.use("/api/users", userRoute);

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
