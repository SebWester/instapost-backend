import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// app.use(
//   cors({
//     origin: ["exp://192.168.1.211:8081", "http://localhost:8081/"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type"],
//     // credentials: true,
//   })
// );
app.use(express.json());

// Routers
import loginRouter from "./routes/loginRoute.js";

app.use("/api", loginRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
