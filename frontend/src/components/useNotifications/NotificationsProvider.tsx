import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { NotificationsContext } from "./NotificationsContext";

export type Severity = "error" | "info" | "success" | "warning";

export type showNotificationType = (
  message: string,
  severity?: Severity,
) => void;

export interface NotificationsProviderProps {
  children?: React.ReactNode;
}

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity | undefined>();
  const [open, setOpen] = useState(false);

  const showNotification: showNotificationType = (message, severity) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={message}
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        {severity ? (
          <Alert severity={severity} sx={{ width: "100%" }}>
            {message}
          </Alert>
        ) : (
          ""
        )}
      </Snackbar>
    </NotificationsContext.Provider>
  );
};

export { NotificationsProvider };
