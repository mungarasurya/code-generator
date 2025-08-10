// src/components/CodePanel.jsx
import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { saveAs } from "file-saver";

export default function CodePanel({ code, setNotif }) {
  const download = () => {
    const blob = new Blob([code || ""], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "generated_test_case.txt");
    if (setNotif) setNotif({ open:true, message:"Downloaded file", severity:"success" });
  };

  return (
    <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Generated Code</Typography>
      <Box sx={{ flex: 1, overflow: "auto", borderRadius: 1, bgcolor: "background.paper" }}>
        <SyntaxHighlighter language="javascript" showLineNumbers>
          {code || "// Generated code will appear here"}
        </SyntaxHighlighter>
      </Box>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button variant="contained" onClick={() => { navigator.clipboard.writeText(code || ""); if (setNotif) setNotif({ open:true, message:"Copied to clipboard", severity:"success" }); }}>
          Copy
        </Button>
        <Button variant="outlined" onClick={download}>Download</Button>
      </Box>
    </Paper>
  );
}
