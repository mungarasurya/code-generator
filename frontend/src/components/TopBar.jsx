// src/components/TopBar.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function TopBar() {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <GitHubIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TestCase Generator — Workik AI Assignment
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          React • Node • MUI
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
