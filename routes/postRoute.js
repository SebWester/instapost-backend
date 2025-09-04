import express from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import Post from "../models/Posts.js";
import fs from "fs";
import Like from "../models/Like.js";
import User from "../models/User.js"

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid hämtning av inlägg" });
  }
});

// Gilla eller ogilla ett inlägg
postRouter.post("/:id/like", async (req, res) => {
  try {
    const postID = req.params.id;
    const { userID } = req.body;

   const existingLike = await Like.findOne({ userID, postID });

        if (existingLike) {
            return res.status(409).json({ error: "Inlägget är redan gillat" });
        }

        const newLike = new Like({ userID, postID });
        await newLike.save();

        const updatedPost = await Post.findByIdAndUpdate(
            postID,
            { $inc: { likes: 1 } },
            { new: true }
        );

        res.status(200).json({ 
            likes: updatedPost.likes, 
            isLiked: true, 
            message: "Inlägget gillades" 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fel vid gillning av inlägg" });
    }
});

// OGILLA ett inlägg
postRouter.post("/:id/toggle-like", async (req, res) => {
    try {
        const postID = req.params.id;
        const { userID } = req.body;

        const like = await Like.findOne({ userID, postID });
        let updatedPost;
        let message;

        if (like) {
            // Ogilla
            await Like.findByIdAndDelete(like._id);
            updatedPost = await Post.findByIdAndUpdate(postID, { $inc: { likes: -1 } }, { new: true });
            message = "Inlägget ogillades";
        } else {
            // Gilla
            const newLike = new Like({ userID, postID });
            await newLike.save();
            updatedPost = await Post.findByIdAndUpdate(postID, { $inc: { likes: 1 } }, { new: true });
            message = "Inlägget gillades";
        }

        res.status(200).json({ likes: updatedPost.likes, message: message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fel vid hantering av gillning" });
    }
});

// Hämta alla inlägg som en specifik användare har gillat
postRouter.get("/likes/:userId", async (req, res) => {
  try {
    const { userID } = req.params;
    const likes = await Like.find({ userID });
    
    // Returnera bara postId för varje like
    const likedPostIds = likes.map(like => like.postID);
    
    res.status(200).json(likedPostIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid hämtning av gillade inlägg" });
  }
});

// Skapa nytt inlägg med filuppladdning
postRouter.post("/new", async (req, res) => {
  try {
    //const { caption, userId, username } = req.body;
    // let imageUrl = null;

    // // Kontrollera om en fil laddats upp
    // if (req.files && req.files.image) {
    //   const image = req.files.image;
    //   const uploadPath = path.join(process.cwd(), "uploads", image.name);

    //   // Flytta filen till mappen uploads
    //   await image.mv(uploadPath);

    //   imageUrl = `http://192.168.1.140:3000/uploads/${image.name}`;
    // }

    const { caption, userId, username, imageBase64, profileImageUrl } = req.body;
    let imageUrl = null;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Användare hittades inte"});
    }


    if (imageBase64) {
      // Generera unikt filnamn
      const fileName = `${uuidv4()}.png`;
      const uploadPath = path.join(process.cwd(), "uploads", fileName);

      // Ta bort "data:image/png;base64,"-delen
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Spara filen på servern
      fs.writeFileSync(uploadPath, buffer);

      imageUrl = `http://localhost:3000/uploads/${fileName}`;
      // imageUrl = `http://192.168.1.140:3000/uploads/${fileName}`;

    }

    const newPost = new Post({
      caption,
      userId,
      username: user.name,
      profileImageUrl: user.profileImage,
      imageUrl,
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Serverfel", details: err.message });
  }
});

export default postRouter;
