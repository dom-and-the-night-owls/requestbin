import { useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import Notification from "./Notification";
import { NotificationsContext } from "./NotificationsContext";
import type {
  ShowNotificationOptions,
  ShowNotification,
  CloseNotification,
  RemoveNotification,
} from "./useNotifications";

const generateId = (() => {
  let nextId = 0;
  return () => nextId++;
})();

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

export interface NotificationQueueItem {
  notificationKey: string;
  message: string;
  isOpen: boolean;
  options: ShowNotificationOptions;
}

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
