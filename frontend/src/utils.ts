import axios from "axios";
import { z } from "zod";
import type { ShowNotification } from "./hooks/useNotifications";

export type NotificationFunction = (
  message: string,
) => string | ShowNotification;

// default error notification
let notifyError: NotificationFunction = (message) => (
  console.error(message), message
);

export const setErrorNotifier = (notifier: NotificationFunction) => {
  notifyError = notifier;
};

export const handleAPIError = (e: unknown, msg?: string) => {
  console.error(e);
  if (!msg) {
    if (axios.isAxiosError(e) && e.response?.data) {
      msg = e.response.data;
    } else if (e instanceof z.ZodError) {
      msg = "An internal error occurred. Received invalid Request type.";
    } else if (e instanceof Error) {
      msg = e.message;
    }
  }
  if (typeof msg !== "string") {
    msg = "An unknown error occurred.";
  }

  notifyError(msg);
};

export const hasContentTypeJSON = (headers: string) => {
  const headerArray = headers.split("\n");
  return headerArray.some((header) => {
    const [key, value] = header.split(/:\s+/);
    if (
      key.toLowerCase() === "content-type" &&
      value.toLowerCase() === "application/json"
    ) {
      return true;
    }
  });
};

export const addBasket = (basketName: string, token: string) => {
  window.localStorage.setItem(basketName, token);
  window.dispatchEvent(
    new StorageEvent("storage", { key: basketName, newValue: token }),
  );
};

export const removeBasket = (basketName: string) => {
  window.localStorage.removeItem(basketName);
  window.dispatchEvent(new StorageEvent("storage", { key: basketName }));
};

export const clearBaskets = () => {
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent("storage"));
};
