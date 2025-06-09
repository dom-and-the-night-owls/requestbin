import { useContext, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import { NotificationsContext } from "./NotificationsContext";
import type { ShowNotificationOptions } from "./useNotifications";

interface NotificationProps {
  notificationKey: string;
  message: string;
  isOpen: boolean;
  options: ShowNotificationOptions;
  badge?: string;
}

const Notification = ({
  notificationKey,
  message,
  isOpen,
  options,
  badge,
}: NotificationProps) => {
  const { close, remove } = useContext(NotificationsContext)!;
  const handleClose = useCallback(
    (_event: unknown, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      close(notificationKey);
    },
    [notificationKey, close],
  );

  const handleExited = useCallback(() => {
    remove(notificationKey);
  }, [notificationKey, remove]);

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="Close"
        title="Close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const slotProps = {
    transition: {
      onExited: handleExited,
    },
  };

  return (
    <Snackbar
      key={notificationKey}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      autoHideDuration={options.autoHideDuration}
      onClose={handleClose}
      slotProps={slotProps}
    >
      <Badge badgeContent={badge} color="primary" sx={{ width: "100%" }}>
        {options.severity ? (
          <Alert
            severity={options.severity}
            sx={{ width: "100%" }}
            action={action}
          >
            {message}
          </Alert>
        ) : (
          <SnackbarContent message={message} action={action} />
        )}
      </Badge>
    </Snackbar>
  );
};

export default Notification;
