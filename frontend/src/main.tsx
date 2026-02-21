import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config"; // Initialize i18n
import { registerServiceWorkerUpdate } from "./utils/pwa";

// Register service worker update listener
registerServiceWorkerUpdate();

// Render ứng dụng
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
