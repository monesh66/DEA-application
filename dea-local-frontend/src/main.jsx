import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PopupProvider } from "./context/PopupContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PopupProvider>
      <App />
    </PopupProvider>
  </BrowserRouter>
);