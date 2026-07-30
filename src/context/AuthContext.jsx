import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "sentrynet_token";

/**
 * AuthProvider
 * Minimal auth state shared across the app: current user + token,
 * persisted in localStorage so a refresh doesn't kick the user back
 * to /login. `login()` currently calls a mocked request in
 * services/api.js — Member 7 should point that at the real
 * authentication endpoint once it exists.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const result = await loginRequest(email, password);
    setUser(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
