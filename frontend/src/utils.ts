import axios from "axios";
import type { ShowNotification } from "@toolpad/core";

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
