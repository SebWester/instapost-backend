import express from "express";
import { hash } from "bcrypt";
import User from "../models/User.js";

const signupRouter = express.Router();

signupRouter.post("/", async (req, res) => {
  const { email, username, password, repeatPassword } = req.body;
  let hashedPassword;

  if (password === repeatPassword) {
    hashedPassword = await hash(password, 5);
  }

  try {
    const newUser = new User({
      name: username,
      password: hashedPassword,
      email: email,
    });

    await newUser.save();
    res.status(201).json({ created: newUser });
  } catch (err) {
    console.error("Ooops!", err);
    res.status(400).json({ error: "Error signing up." });
  }
});

export default signupRouter;
