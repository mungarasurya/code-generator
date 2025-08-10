import express from "express";
import axios from "axios";

const router = express.Router();

// Recursively fetch files from a repo
async function fetchAllFiles(owner, repo, token, path = "") {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = { Authorization: `token ${token}` };

  const res = await axios.get(url, { headers });

  let files = [];

  for (const item of res.data) {
    if (item.type === "file") {
      files.push({
        name: item.name,
        path: item.path,
        sha: item.sha,
        download_url: item.download_url,
        size: item.size
      });
    } else if (item.type === "dir") {
      // Recursively fetch the folder contents
      const subFiles = await fetchAllFiles(owner, repo, token, item.path);
      files = files.concat(subFiles);
    }
  }

  return files;
}

// GET /api/github/files?owner=xxx&repo=xxx&token=xxx
router.get("/files", async (req, res) => {
  try {
    const { owner, repo, token } = req.query;
    if (!owner || !repo || !token) {
      return res.status(400).json({ error: "Missing owner/repo/token" });
    }

    const files = await fetchAllFiles(owner, repo, token);
    res.json(files);
  } catch (err) {
    console.error("GitHub API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Error fetching files" });
  }
});

export default router;
