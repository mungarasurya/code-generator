// src/components/FileTable.jsx
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

export default function FileTable({ files, selectedFiles, setSelectedFiles, setNotif }) {
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "name", headerName: "File", flex: 1 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "actions", headerName: "Actions", width: 160, renderCell: (params) => (
        <Button size="small" onClick={() => fetchContent(params.row)}>Load</Button>
      )
    }
  ];

  async function fetchContent(row) {
    if (!row.download_url) {
      setNotif({ open:true, message:"No download_url available for file", severity:"error" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(row.download_url);
      const fileWithContent = { ...row, content: res.data };
      setSelectedFiles(prev => {
        const exists = prev.find(p => p.path === row.path);
        if (exists) {
          // replace
          return prev.map(p => p.path === row.path ? fileWithContent : p);
        }
        return [...prev, fileWithContent];
      });
      setNotif({ open:true, message:`Loaded ${row.name}`, severity:"success" });
    } catch (err) {
      setNotif({ open:true, message: err.message, severity:"error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ height: 420 }}>
      <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={() => setSelectedFiles([])}>Clear Selection</Button>
        <Button variant="contained" size="small" onClick={async () => {
          // quick action: fetch content for all files (dangerous if many files)
          setLoading(true);
          try {
            const filesWithContent = await Promise.all(files.map(async f => {
              const r = await axios.get(f.download_url);
              return { ...f, content: r.data };
            }));
            setSelectedFiles(filesWithContent);
            setNotif({ open:true, message:`Loaded ${filesWithContent.length} files`, severity:"success" });
          } catch (err) { setNotif({ open:true, message: err.message, severity:"error" }); }
          setLoading(false);
        }}>Load All</Button>
        {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
      </Box>

      <DataGrid
        rows={files.map((f, i) => ({ id:i, ...f }))}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        disableSelectionOnClick
      />
    </Box>
  );
}
