import { useContext } from "react";
import { NotificationsContext } from "./NotificationsContext";

export interface ShowNotificationOptions {
  key?: string;
  severity?: "info" | "warning" | "error" | "success";
  autoHideDuration?: number;
  actionText?: React.ReactNode;
  onAction?: () => void;
}
export type ShowNotification = (
  message: string,
  options: ShowNotificationOptions,
) => string;

export type CloseNotification = (id: string) => void;

export type RemoveNotification = (id: string) => void;

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }

  return context;
};
