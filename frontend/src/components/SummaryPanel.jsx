// src/components/SummaryPanel.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import PullRequestIcon from "@mui/icons-material/IntegrationInstructions";

export default function SummaryPanel({ selectedFiles, summaries, setSummaries, setGeneratedCode, setNotif }) {
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchSummaries = async () => {
    if (!selectedFiles.length) {
      setNotif({ open:true, message:"No files selected", severity:"warning" });
      return;
    }
    setLoadingSummaries(true);
    try {
      // send minimal file info (name + content) to backend
      const res = await axios.post("http://localhost:5000/api/ai/summaries", { files: selectedFiles });
      const out = res.data.summaries || [];
      setSummaries(out);
      setNotif({ open:true, message:`Got ${out.length} summaries`, severity:"success" });
    } catch (err) {
      setNotif({ open:true, message: err.message, severity:"error" });
    } finally {
      setLoadingSummaries(false);
    }
  };

  const generateCode = async (summary) => {
    setGenerating(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/code", { summary });
      setGeneratedCode(res.data.code || res.data);
      setNotif({ open:true, message:"Code generated", severity:"success" });
    } catch (err) {
      setNotif({ open:true, message: err.message, severity:"error" });
    } finally {
      setGenerating(false);
    }
  };

  // Optional: create PR (calls backend /api/github/pr)
  const createPR = async () => {
    setNotif({ open:true, message:"PR creation not wired yet (backend needed)", severity:"info" });
    // Implement backend route to create branch/commit/create PR using Octokit
  };

  return (
    <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={fetchSummaries} disabled={loadingSummaries}>
          {loadingSummaries ? "Generating..." : "Get Test Summaries"}
        </Button>
        <LoadingButton variant="outlined" onClick={() => generateCode(summaries[0])} loading={generating} disabled={!summaries.length}>
          Quick Generate
        </LoadingButton>
        <Button startIcon={<PullRequestIcon />} onClick={createPR}>Create PR (bonus)</Button>
      </Box>

      <Typography variant="subtitle1">Selected files ({selectedFiles.length})</Typography>
      <List dense sx={{ maxHeight: 160, overflow: "auto", bgcolor: "background.paper" }}>
        {selectedFiles.map((f, i) => (
          <ListItem key={i}>{f.path || f.name}</ListItem>
        ))}
      </List>

      <Typography variant="subtitle1">Test Case Summaries</Typography>
      <Box sx={{ overflow: "auto" }}>
        {(!summaries || !summaries.length) && <Typography color="text.secondary">No summaries yet</Typography>}
        {summaries.map((s, idx) => (
          <Accordion key={idx} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>{typeof s === "string" ? s : s.title || `Test ${idx+1}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 1 }}>{typeof s === "string" ? "" : s.description}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" onClick={() => generateCode(typeof s === "string" ? s : s.title)}>
                  Generate Code
                </Button>
                <Button size="small" onClick={() => navigator.clipboard?.writeText(JSON.stringify(s))}>Copy JSON</Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
}
