import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

const root = createRoot(document.getElementById("remote-b") as HTMLElement);
root.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);
