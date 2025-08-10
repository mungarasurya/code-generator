// src/App.jsx
import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import theme from "./theme";
import TopBar from "./components/TopBar";
import GitHubConnect from "./components/GitHubConnect";
import FileTable from "./components/FileTable";
import SummaryPanel from "./components/SummaryPanel";
import CodePanel from "./components/CodePanel";
import Notification from "./components/Notification";

export default function App() {
  const [files, setFiles] = useState([]);           // items from GitHub API (with name, path, content)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [summaries, setSummaries] = useState([]);   // array of strings or objects
  const [generatedCode, setGeneratedCode] = useState("");
  const [notif, setNotif] = useState({ open:false, message:"", severity:"info" });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Toolbar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "360px 1fr 520px", gap: 2 }}>
          <Box>
            <GitHubConnect setFiles={setFiles} setNotif={setNotif} />
            <Box sx={{ mt: 2 }}>
              <FileTable
                files={files}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setNotif={setNotif}
              />
            </Box>
          </Box>

          <Box>
            <SummaryPanel
              selectedFiles={selectedFiles}
              setSummaries={setSummaries}
              summaries={summaries}
              setGeneratedCode={setGeneratedCode}
              setNotif={setNotif}
            />
          </Box>

          <Box>
            <CodePanel code={generatedCode} setNotif={setNotif} />
          </Box>
        </Box>
      </Container>

      <Notification notif={notif} setNotif={setNotif} />
    </ThemeProvider>
  );
}
