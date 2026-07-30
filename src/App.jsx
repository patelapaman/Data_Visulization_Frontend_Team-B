import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

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

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
