import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const router = express.Router();

router.post("/update-profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Ingen token hittades" });
  }

  try {
    // Verifiera token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Hämta textfält säkert
    const name = req.body?.name || "";
    const bio = req.body?.bio || "";

    let profileImageUrl;

    // Hämta fil om en profilbild skickas
    if (req.files?.profilePic) {
      const file = req.files.profilePic;
      const fileName = `${userId}_${Date.now()}_${file.name}`;
      const uploadPath = path.join(__dirname, "../uploads", fileName);

      await file.mv(uploadPath);
      profileImageUrl = `http://localhost:3000/uploads/${fileName}`;
    }

    // Uppdatera användaren i databasen
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("JWT/DB error:", err);
    res.status(500).json({ error: "Ogiltlig token eller fel i databasen" });
  }
});

export default router;
