import { createContext } from "react";
import type {
  ShowNotification,
  CloseNotification,
  RemoveNotification,
} from "./useNotifications";

export interface NotificationsContextValue {
  show: ShowNotification;
  close: CloseNotification;
  remove: RemoveNotification;
}

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);
