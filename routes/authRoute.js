import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const authRouter = express.Router();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Endpoint för att kolla token / användarinfo
authRouter.get("/token", (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ user: null });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ user: null });
  }
});

export default authRouter;
