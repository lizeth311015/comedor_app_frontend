// src/index.js
import './App.css';
import React from "react";
import ReactDOM from "react-dom/client"; // <-- esto es diferente
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")); // <-- nuevo método
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
