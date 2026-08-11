import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ThreatDetection from "./pages/ThreatDetection";

/**
 * App
 * Top-level routing table for the whole platform.
 *
 *
 *  /                 -> redirects to /login (or /dashboard if already signed in)
 *  /login            -> public
 *  /dashboard/*      -> protected, wraps <Dashboard /> (which renders
 *                       <DashboardLayout> internally with Sidebar + Navbar)
 *  /threat-detection -> AI threat detection results will appear here.
 *  *                 -> 404
 *
 *
 * As teammates add more screens (Events, Threats, Incidents, Reports),
 * add a sibling <Route> under /dashboard following the same pattern
 * used in Dashboard.jsx (wrap the page content in <DashboardLayout>).
 */


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/threat-detection"
            element={
              <ProtectedRoute>
                <ThreatDetection />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
