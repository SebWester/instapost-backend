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
