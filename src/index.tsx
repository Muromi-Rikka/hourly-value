import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const rootElement = document.querySelector("#root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
