import express from "express";

const loginRouter = express.Router();

loginRouter.post("/login", (req, res) => {
  try {
    console.log(req.body);
    // If ok, add JWT token and redirect to home page/dashboard
    res.status(200).json({ msg: "Login Ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

export default loginRouter;
