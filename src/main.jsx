import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import CreateRoutes from "./routes/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CreateRoutes>
      <App />
    </CreateRoutes>
  </React.StrictMode>
);
