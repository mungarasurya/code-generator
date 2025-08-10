// src/components/GitHubConnect.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function GitHubConnect({ setFiles, setSummaries, setNotif }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFilesAndSummaries = async () => {
    if (!owner || !repo || !token) {
      setNotif({ open: true, message: "Owner / Repo / Token required", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ Fetch files from backend
      const res = await axios.get("http://localhost:5000/api/github/files", {
        params: { owner, repo, token }
      });

      const raw = Array.isArray(res.data) ? res.data : [];
      const files = raw
        .filter(x => x.type === "file")
        .map(f => ({
          name: f.name,
          path: f.path,
          sha: f.sha,
          download_url: f.download_url,
          size: f.size
        }));

      setFiles(files);

      // 2️⃣ Send files to summaries endpoint
      const summaryRes = await axios.post("http://localhost:5000/api/ai/summaries", { files });

      setSummaries(summaryRes.data);

      setNotif({ open: true, message: `Fetched ${files.length} files & generated summaries`, severity: "success" });
    } catch (err) {
      console.error(err);
      setNotif({ open: true, message: err?.response?.data?.error || err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: "column" }}>
      <TextField
        label="Repo Owner"
        value={owner}
        onChange={e => setOwner(e.target.value)}
        fullWidth
        size="small"
      />
      <TextField
        label="Repo Name"
        value={repo}
        onChange={e => setRepo(e.target.value)}
        fullWidth
        size="small"
        sx={{ mt: 1 }}
      />
      <TextField
        label="Personal Access Token"
        value={token}
        onChange={e => setToken(e.target.value)}
        fullWidth
        size="small"
        sx={{ mt: 1 }}
        type="password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CloudDownloadIcon />
            </InputAdornment>
          )
        }}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={fetchFilesAndSummaries}
        sx={{ mt: 1 }}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Files & Summaries"}
      </Button>
    </Box>
  );
}
