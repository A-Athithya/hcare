import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./app/store";
import AppWrapper from "./AppFinal";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import "./styles/healthcare-theme.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </Provider>
);
  