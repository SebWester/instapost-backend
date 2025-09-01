import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Posts.js";
import Follow from "../models/Follow.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Ingen token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ error: "Anv'ndaren hittades inte" });

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
    console.error(err);
    res.status(500).json({ error: "Fel vid hämtning av användare" });
  }
});

export default router;
