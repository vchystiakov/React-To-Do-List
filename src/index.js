import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
//import modules for using routes in app
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
