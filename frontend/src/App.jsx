import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Config from "./pages/Config";
import ProjectSetup from "./pages/ProjectSetup";
import Editor from "./pages/Editor";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-project"
                element={
                  <PrivateRoute>
                    <Config />
                  </PrivateRoute>
                }
              />
              <Route
                path="/project/:id/configure"
                element={
                  <PrivateRoute>
                    <ProjectSetup />
                  </PrivateRoute>
                }
              />
              <Route
                path="/project/:id/editor"
                element={
                  <PrivateRoute>
                    <Editor />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
