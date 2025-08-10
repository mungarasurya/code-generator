import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRoutes from "./routes/github.js";
import aiRoutes from "./routes/ai.js"; // <-- add this


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// GitHub API routes
app.use("/api/github", githubRoutes);

// AI Summaries API route
app.use("/api/ai", aiRoutes); // <-- add this

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
