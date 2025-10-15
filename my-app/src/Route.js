// src/Route.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Middle from "./Middle";
import Location from "./location/Location";
import RealTime from "./allpage/RealTime";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Middle />} />
      <Route path="/location" element={<Location />} />
      <Route path="/realtime" element={<RealTime />} />
    </Routes>
  );
};

export default AppRoutes;
