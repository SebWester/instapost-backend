import express from "express";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import authenticateToken from "../middleware/authToken.js";

const router = express.Router();

router.post("/update-profile", authenticateToken, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Request headers:", req.headers);

    const user = req.user;
    const { name, bio } = req.body;

    let profileImageUrl;

    if (req.files && req.files.file) {
      const uploadedFile = req.files.file;
      console.log("Uploaded file details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
      });

      const uploadDir = path.join(process.cwd(), "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const fileExtension = path.extname(uploadedFile.name) || ".jpg";
      const fileName = `profile-${timestamp}${fileExtension}`;
      const uploadPath = path.join(uploadDir, fileName);

      console.log("Upload path:", uploadPath);

      await new Promise((resolve, reject) => {
        uploadedFile.mv(uploadPath, (err) => {
          if (err) {
            console.error("File move error:", err);
            reject(err);
          } else {
            console.log("File moved successfully");
            resolve();
          }
        });
      });

      profileImageUrl = `http://localhost:3000/uploads/${fileName}`;
      console.log("Profile image URL:", profileImageUrl);
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (profileImageUrl) updateData.profileImage = profileImageUrl;

    console.log("Update data:", updateData);

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    console.log("User updated successfully:", updatedUser.profileImage);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Serverfel", details: err.message });
  }
});

export default router;
