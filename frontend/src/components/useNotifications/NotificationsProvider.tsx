import { useState, useContext, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import { NotificationsContext } from "./NotificationsContext";

let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return id;
};

export interface ShowNotificationOptions {
  key?: string;
  severity?: "info" | "warning" | "error" | "success";
  autoHideDuration?: number;
  actionText?: React.ReactNode;
  onAction?: () => void;
}

export interface NotificationQueueItem {
  notificationKey: string;
  message: string;
  isOpen: boolean;
  options: ShowNotificationOptions;
}

interface NotificationProps extends NotificationQueueItem {
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

interface NotificationsProps {
  queue: Array<NotificationQueueItem>;
}

const Notifications = ({ queue }: NotificationsProps) => {
  const currentNotification = queue[0] ?? null;
  const badge = queue.length > 1 ? String(queue.length) : undefined;

  return currentNotification ? (
    <Notification {...currentNotification} badge={badge} />
  ) : null;
};

export type ShowNotification = (
  message: string,
  options: ShowNotificationOptions,
) => string;

export type CloseNotification = (id: string) => void;

export type RemoveNotification = (id: string) => void;

export interface NotificationsProviderProps {
  children?: ReactNode;
}

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [queue, setQueue] = useState<Array<NotificationQueueItem>>([]);

  const show = useCallback<ShowNotification>(
    (message: string, options: ShowNotificationOptions = {}) => {
      const notificationKey = options.key ?? String(generateId());
      setQueue((queue) => {
        if (queue.some((n) => n.notificationKey === notificationKey)) {
          return queue;
        }

        const notificationQueueItem: NotificationQueueItem = {
          notificationKey: notificationKey,
          message,
          isOpen: true,
          options,
        };
        return [...queue, notificationQueueItem];
      });

      return notificationKey;
    },
    [],
  );

  const close = useCallback<CloseNotification>((key: string) => {
    setQueue((queue) =>
      queue.map((n) =>
        n.notificationKey === key ? { ...n, isOpen: false } : n,
      ),
    );
  }, []);

  const remove = useCallback<RemoveNotification>((key: string) => {
    setQueue((queue) => queue.filter((n) => n.notificationKey !== key));
  }, []);

  const notificationsContext = useMemo(
    () => ({ show, close, remove }),
    [show, close, remove],
  );

  return (
    <NotificationsContext value={notificationsContext}>
      {children}
      <Notifications queue={queue} />
    </NotificationsContext>
  );
};

export { NotificationsProvider };
