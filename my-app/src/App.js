// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Headerr from "./Headerr";
import AppRoutes from "./Route";

function App() {
  return (
    <Router>
      <Headerr />
      <AppRoutes />
    </Router>
  );
}

export default App;
