import express from "express";

import multer from "multer";
import path from "path";
import Post from "../models/Posts.js"; // FIX: Kontrollera att det är litet 'p' här!

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

const upload = multer({ storage });

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid hämtning av inlägg" });
  }
});

// Gilla ett inlägg
postRouter.post("/:id/like", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Inlägg hittades inte" });
    }
    
    // Incrementa likes och spara
    post.likes = (post.likes || 0) + 1;
    await post.save();
    
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid gillning av inlägg" });
  }
});

// Skapa nytt inlägg med filuppladdning
postRouter.post("/new", upload.single("image"), (req, res) => {
  const { text, userId, username } = req.body;
  const image = req.file;
  console.log(req.body);
  try {
    res.json({
      message: "Post saved",
      data: { text, userId, username, image },
    });
  } catch (err) {
    console.error("I HAVE ESCAPED FROM THE POLICE!", err);
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
