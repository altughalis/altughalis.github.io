import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminPanelFull from "./pages/AdminPanelFull";
import AnaBayiPanel from "./pages/AnaBayiPanel";
import AltBayiPanel from "./pages/AltBayiPanel";
import ServisPanel from "./pages/ServisPanel";
import AnaBayiLogin from "./pages/AnaBayiLogin";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (user, token) => {
    setUser(user);
    setToken(token);
  };

  // Ana bayi login route
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route
            path="/anabayi-login"
            element={<AnaBayiLogin onLogin={handleLogin} />}
          />
          <Route path="/*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {user.role === "admin" ? (
          <Route
            path="/*"
            element={<AdminPanelFull user={user} token={token} />}
          />
        ) : user.role === "anabayi" ? (
          <Route
            path="/*"
            element={<AnaBayiPanel user={user} token={token} />}
          />
        ) : user.role === "altbayi" ? (
          <Route
            path="/*"
            element={<AltBayiPanel user={user} token={token} />}
          />
        ) : user.role === "servis" ? (
          <Route
            path="/*"
            element={<ServisPanel user={user} token={token} />}
          />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
