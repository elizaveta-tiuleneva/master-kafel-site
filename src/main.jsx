import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import App from "./App.jsx";
import { ROUTER_BASENAME } from "./lib/siteUrl.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
