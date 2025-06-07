import { createContext } from "react";
import type { showNotificationType } from "./NotificationsProvider";

export interface NotificationsContextType {
  showNotification: showNotificationType;
}

export const NotificationsContext =
  createContext<NotificationsContextType | null>(null);
