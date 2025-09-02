import express from "express";
import User from "../models/User.js";
import Post from "../models/Posts.js";
import Follow from "../models/Follow.js";
import authenticateToken from "../middleware/authToken.js";

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    const followers = await Follow.find({ targetUserId: user._id }).populate(
      "followerId"
    );
    const following = await Follow.find({ followerId: user._id }).populate(
      "targetUserId"
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        posts: posts.map((post) => ({
          _id: post._id,
          imageUrl: post.imageUrl,
          caption: post.caption,
          createdAt: post.createdAt,
        })),
        followers: followers.map((f) => f.followerId),
        following: following.map((f) => f.targetUserId),
      },
    });
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err);
    res.status(500).json({ error: "Fel vid hämtning av användare" });
  }
});

export default router;
