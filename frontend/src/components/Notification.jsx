// src/components/Notification.jsx
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Notification({ notif, setNotif }) {
  const handleClose = () => setNotif({ ...notif, open: false });

  return (
    <Snackbar open={notif.open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert onClose={handleClose} severity={notif.severity || "info"} sx={{ width: "100%" }}>
        {notif.message}
      </Alert>
    </Snackbar>
  );
}

