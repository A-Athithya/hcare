import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./app/store";
import App from "./App";  // ✔ correct import

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
/* import "./styles/healthcare-theme.css"; */

// Polyfill for process in browser environment
import process from "process";
if (typeof window !== "undefined" && !window.process) {
  window.process = process;
}

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />   {/* ✔ FIXED */}
    </BrowserRouter>
  </Provider>
);
