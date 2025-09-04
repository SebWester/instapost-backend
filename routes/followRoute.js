import express from "express";
import Follow from "../models/Follow.js";
import User from "../models/User.js";
import authenticateToken from "../middleware/authToken.js";

const router = express.Router();

router.post("/:targetUserId", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const { targetUserId } = req.params;

    if (!targetUserId) {
      return res.status(400).json({ error: "Target user ID saknas" });
    }

    if (currentUser._id.toString() === targetUserId) {
      return res.status(400).json({ error: "Du kan inte följa dig själv" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "Användaren hittades inte" });
    }

    const existingFollow = await Follow.findOne({
      followerId: currentUser._id,
      targetUserId,
    });

    if (existingFollow) {
      await existingFollow.deleteOne();
      return res.json({ success: true, action: "unfollow" });
    } else {
      const newFollow = new Follow({
        followerId: currentUser._id,
        targetUserId,
      });
      await newFollow.save();
      return res.json({ success: true, action: "follow" });
    }
  } catch (err) {
    console.error("Fel vid follow/unfollow:", err);
    res.status(500).json({ error: "Serverfel vid follow/unfollow" });
  }
});

export default router;
