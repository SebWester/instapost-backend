import express from "express";

const postRouter = express.Router();

postRouter.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "No posts to show" });
  } catch (err) {
    console.log("ERROR!", err);
  }
});

export default postRouter;
