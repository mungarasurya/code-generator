// routes/github.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Recursive fetch function
async function fetchFilesRecursive(owner, repo, token, path = "") {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "Node.js"
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  let allFiles = [];

  for (const item of data) {
    if (item.type === "file") {
      allFiles.push(item);
    } else if (item.type === "dir") {
      const nestedFiles = await fetchFilesRecursive(owner, repo, token, item.path);
      allFiles = allFiles.concat(nestedFiles);
    }
  }

  return allFiles;
}

// API endpoint
router.get("/files", async (req, res) => {
  const { owner, repo, token } = req.query;

  if (!owner || !repo || !token) {
    return res.status(400).json({ error: "Missing owner/repo/token" });
  }

  try {
    const files = await fetchFilesRecursive(owner, repo, token);
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ error: "Error fetching files" });
  }
});

export default router;
