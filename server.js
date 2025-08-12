import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors()); // SET UP
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Simple GET req");
  res.status(200).json({ msg: "Ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
