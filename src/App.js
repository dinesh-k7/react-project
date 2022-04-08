import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="register" element={<Register />} />
          <Route exact path="dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
