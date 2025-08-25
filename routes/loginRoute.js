import express from "express";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

const loginRouter = express.Router();

dotenv.config();
const token_key = process.env.JWT_SECRET_KEY;

loginRouter.post("/login", async (req, res) => {
  const { email, password, platform } = req.body;

  const user = await User.findOne({ email: email });
  console.log(user);
  if (user === null) {
    res.status(404).json({ error: "Wrong username" });
  }

  const passwordOk = await compare(password, user.password);
  if (!passwordOk) {
    res.status(401).json({ error: "Wrong password" });
  }

  const token = jwt.sign(
    {
      name: user.name,
    },
    token_key,
    { expiresIn: "1h" }
  );

  try {
    if (platform === "web") {
      // Change later
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      res.status(200).json({ token: token });
    } else {
      console.log("Welcome");
      res.status(200).json({ token: token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

loginRouter.post("/login/userdata", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (user === null) {
    res.status(404).json({ error: "Wrong username" });
  }

  res.status(200).json({ userData: user });
});

export default loginRouter;
