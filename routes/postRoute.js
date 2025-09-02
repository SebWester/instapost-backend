import express from "express";
import multer from "multer";
import path from "path";

const postRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // spara här
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, randomName);
  },
});

const upload = multer({ storage });

postRouter.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "No posts to show" });
  } catch (err) {
    console.log("ERROR!", err);
  }
});

// New post
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

export default postRouter;
