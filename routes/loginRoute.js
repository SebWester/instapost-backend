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
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Wrong username" });

  const passwordOk = await compare(password, user.password);
  if (!passwordOk) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
    },
    token_key,
    { expiresIn: "1h" }
  );

  const responsePayload = { token, userData: user };

  try {
    if (platform === "web") {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // 🔒 säkrare i prod
        sameSite: "lax",
      });
    } else {
      console.log("Welcome");
    }

    return res.status(200).json(responsePayload);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

export default loginRouter;
