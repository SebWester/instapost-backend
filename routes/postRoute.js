import express from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import Post from "../models/Posts.js"; 
import fs from "fs";
import Like from "../models/Like.js";

const postRouter = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, randomName);
  },
});

const upload = multer({ storage }); */

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid hämtning av inlägg" });
  }
});

// Gilla eller ogilla ett inlägg
postRouter.post("/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const {userId} = req.body; 

    const like = await Like.findOne({ userId, postId}); 
    let isLiked = false; 
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Inlägg hittades inte" });
    }

    
    if (like) {
      await Like.findByIdAndDelete(Like._id); 
      post.likes -= 1; 
      isLiked = false; 
    } else {
      const newLike = new Like ({userId, postId}); 
      await newLike.save(); 
      post.likes += 1; 
      isLiked = true; 
    }

    await post.save();
    res.status(200).json({likes: post.likes, isLiked}); 
    


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid gillning av inlägg" });
  }
});

// Skapa nytt inlägg med filuppladdning
postRouter.post("/new", async (req, res) => {
  try {
    const { caption, userId, username } = req.body;
    let imageUrl = null;
    
    // Kontrollera om en fil laddats upp
    if (req.files && req.files.image) {
        const image = req.files.image;
        const uploadPath = path.join(process.cwd(), "uploads", image.name);
        
        // Flytta filen till mappen uploads
        await image.mv(uploadPath);

        imageUrl = `http://192.168.1.140:3000/uploads/${image.name}`;
    }

    if (!caption || !userId || !username || !imageUrl) {
      return res.status(400).json({ error: "Alla fält (caption, userId, username, image) måste fyllas i" });
    }

    const newPost = new Post({
      caption,
      userId,
      username,
      imageUrl,

    });


    await newPost.save();
    res.status(201).json({ success: true, post: newPost });

  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Serverfel", details: err.message });
  }
});

postRouter.post("/:id/comment", async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment, userId, username } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Inlägg hittades inte" });
    }

    post.comments.push({ text: comment, userId, username });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid spara av kommentar" });
  }
});

export default postRouter;
