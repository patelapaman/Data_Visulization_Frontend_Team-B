import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SecurityEvents from "./pages/SecurityEvents";
import Threats from "./pages/Threats";
import Vulnerabilities from "./pages/Vulnerabilities";
import Incidents from "./pages/Incidents";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

/**
 * App
 * Top-level routing table for the whole platform.
 *
 *  /              -> redirects to /login (or /dashboard if already signed in)
 *  /login         -> public
 *  /dashboard/*   -> protected, wraps <Dashboard /> (which renders
 *                    <DashboardLayout> internally with Sidebar + Navbar)
 *  *              -> 404
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
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/events"
                  element={
                    <ProtectedRoute>
                      <SecurityEvents />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/threats"
                  element={
                    <ProtectedRoute>
                      <Threats />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/vulnerabilities"
                  element={
                    <ProtectedRoute>
                      <Vulnerabilities />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/incidents"
                  element={
                    <ProtectedRoute>
                      <Incidents />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
