import express from "express";
import User from "../models/User.js";

const searchRouter = express.Router();

searchRouter.post("/user", async (req, res) => {
  try {
    const { username } = req.body;

    // Return all users that match the search query (case-insensitive)
    // but exclude the password field from the results
    const foundUsers = await User.find(
      {
        name: new RegExp(`^${username}`, "i"),
      },
      "-password"
    );

    if (!foundUsers.length) {
      return res.status(404).json({ result: "No users found!" });
    }

    res.status(200).json({ result: foundUsers });
  } catch (err) {
    console.error("Oops!", err);
    res.status(500).json({ error: err.message });
  }
});

export default searchRouter;
