import express from "express";

const postRouter = express.Router();

// Tillfällig mockad data
const mockPosts = [
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


postRouter.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "No posts to show" });
  } catch (err) {
    console.log("ERROR!", err);
  }
});

export default postRouter;
