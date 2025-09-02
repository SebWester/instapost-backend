import express from "express";
import { v4 as uuidv4 } from "uuid"; // för att generera unika ID:n

const postRouter = express.Router();

// Mockad databas för inlägg
let posts = [
  {
    id: "1",
    username: "varsa",
    profileImageUrl: "https://via.placeholder.com/150",
    imageUrl: "https://via.placeholder.com/300",
    caption: "Mitt första inlägg!",
    likes: 5,
  },
  {
    id: "2",
    username: "larsa",
    profileImageUrl: "https://via.placeholder.com/150",
    imageUrl: "https://via.placeholder.com/300",
    caption: "Hej världen 👋",
    likes: 12,
  },
];

// Hämta alla inlägg
postRouter.get("/", (req, res) => {
  try {
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid hämtning av inlägg" });
  }
});

// Gilla ett inlägg
postRouter.post("/:id/like", (req, res) => {
  try {
    const postId = req.params.id;
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).json({ error: "Inlägg hittades inte" });

    post.likes += 1;
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid gillning av inlägg" });
  }
});

// Skapa nytt inlägg
postRouter.post("/", (req, res) => {
  try {
    const { username, profileImageUrl, imageUrl, caption } = req.body;

    if (!username || !imageUrl || !caption) {
      return res.status(400).json({ error: "Fyll i alla fält" });
    }

    const newPost = {
      id: uuidv4(),
      username,
      profileImageUrl: profileImageUrl || "",
      imageUrl,
      caption,
      likes: 0,
    };

    posts.unshift(newPost); // lägg till i början
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fel vid skapande av inlägg" });
  }
});

export default postRouter;
