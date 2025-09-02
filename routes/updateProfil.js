import express from "express";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import authenticateToken from "../middleware/authToken.js";

const router = express.Router();

router.post("/update-profile", authenticateToken, (req, res) => {
  const user = req.user;

  const { name, bio } = req.body;

  let profileImageUrl;

  if (req.files && req.files.file) {
    const uploadedFile = req.files.file;
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const uploadPath = path.join(uploadDir, uploadedFile.name);

    uploadedFile.mv(uploadPath, (err) => {
      if (err) return res.status(500).json({ error: "Failed to save file" });

      profileImageUrl = `http://localhost:3000/uploads/${uploadedFile.name}`;

      User.findByIdAndUpdate(
        user._id,
        {
          ...(name && { name }),
          ...(bio && { bio }),
          profileImage: profileImageUrl,
        },
        { new: true }
      )
        .then((updatedUser) => res.json({ success: true, user: updatedUser }))
        .catch((err) =>
          res.status(500).json({ error: "Database error", details: err })
        );
    });
  } else {
    User.findByIdAndUpdate(
      user._id,
      {
        ...(name && { name }),
        ...(bio && { bio }),
      },
      { new: true }
    )
      .then((updatedUser) => res.json({ success: true, user: updatedUser }))
      .catch((err) =>
        res.status(500).json({ error: "Database error", details: err })
      );
  }
});

export default router;
