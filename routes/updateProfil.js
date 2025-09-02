// routes/updateProfil.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import User from "../models/User.js";
import authenticateToken from "../middleware/authToken.js";

const router = express.Router();

// Skapa uploads-mapp om den inte finns
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Skapade uploads-mappen");
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    console.log("📄 Filnamn som sparas:", filename);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Refaktorerad route
router.post(
  "/update-profile",
  authenticateToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = req.user; // Från middleware
      const { name, bio } = req.body;

      let profileImageUrl = undefined;
      if (req.file) {
        profileImageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        console.log("🖼️ Profilbild-URL:", profileImageUrl);
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          ...(name !== undefined && { name }),
          ...(bio !== undefined && { bio }),
          ...(profileImageUrl && { profileImage: profileImageUrl }),
        },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ error: "Användare hittades inte" });
      }

      return res.json({ success: true, user: updatedUser });
    } catch (err) {
      console.error("🔥 Fel vid uppdatering av profil:", err);
      return res.status(500).json({ error: "Fel vid uppdatering av profil" });
    }
  }
);

export default router;
