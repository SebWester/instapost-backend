import express from "express";
import path from "path";
import fs from "fs";
import Post from "../models/Posts.js";

const postRouter = express.Router();

postRouter.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "No posts to show" });
  } catch (err) {
    console.log("ERROR!", err);
  }
});

// New post
postRouter.post("/new", async (req, res) => {
  try {
    const { caption, userId, username, imageBase64 } = req.body;
    let imageUrl;

    if (imageBase64) {
      // imageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid base64 string");

      const mimeType = matches[1];
      const ext = mimeType.split("/")[1] || "jpg";
      const data = Buffer.from(matches[2], "base64");

      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `post-${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, data);
      imageUrl = `http://localhost:3000/uploads/${fileName}`;
    }

    const newPost = new Post({
      caption,
      userId,
      username,
      imageUrl,
      createdAt: new Date(),
    });

    await newPost.save();
    res.json({ success: true, post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Serverfel", details: err.message });
  }
});

export default postRouter;
