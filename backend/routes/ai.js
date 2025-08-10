import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate test case summaries
router.post("/summaries", async (req, res) => {
  const { files } = req.body;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files provided" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate test case summaries for the following code files:\n\n${JSON.stringify(files)}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ summaries: text.split("\n").filter(s => s.trim()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating summaries" });
  }
});

// Generate code from summary
router.post("/code", async (req, res) => {
  const { summary } = req.body;
  if (!summary) {
    return res.status(400).json({ error: "No summary provided" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write JavaScript test code for the following summary:\n${summary}`;
    const result = await model.generateContent(prompt);
    const code = result.response.text();
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating code" });
  }
});

export default router;
