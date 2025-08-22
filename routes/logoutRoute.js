import express from "express";

const logoutRouter = express.Router();

logoutRouter.post("/", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ error: "Error logging out" });
  }
});

export default logoutRouter;
