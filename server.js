import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rewriteRoutes from "./routes/rewriteRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "200kb" }));

// routes


app.get("/", (req, res) => res.send("hello ai keyboard"));



app.use("/api", rewriteRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
