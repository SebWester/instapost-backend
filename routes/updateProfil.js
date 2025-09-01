import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { name, bio, profilePic } = req.body;

    let profileImageUrl;

    if (req.files?.profilePic) {
      const file = req.files.profilePic;
      const fileName = `${userId}_${Date.now()}_${file.name}`;
      const uploadPath = path.join(__dirname, "../uploads", fileName);

      await file.mv(uploadPath);
      profileImageUrl = `http://localhost:3000/uploads/${fileName}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("JWT/DB error:", err);
    res.status(401).json({ error: "Ogiltlig token eller fel i databasen" });
  }
});

export default router;
