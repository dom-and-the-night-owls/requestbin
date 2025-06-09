import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotificationsProvider } from "./hooks/useNotifications";
import App from "./App.tsx";

// import fonts for mui theme
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// We have to render App inside the NotificationsProvider
// in order to use useNotifications in App.tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </StrictMode>,
);
