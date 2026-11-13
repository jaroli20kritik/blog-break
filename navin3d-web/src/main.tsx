import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { isArtifact } from "./lib/runtime";

if (isArtifact) {
  void import("./lib/artifactDownloads").then(({ setupArtifactDownloads }) => {
    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.className = "fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-lg transition-opacity duration-300 opacity-0 pointer-events-none";
    document.body.appendChild(el);
    let t: number | undefined;
    setupArtifactDownloads((msg) => {
      el.textContent = msg;
      el.style.opacity = "1";
      clearTimeout(t);
      t = window.setTimeout(() => (el.style.opacity = "0"), 2600);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
