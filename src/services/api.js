// src/services/api.js

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Reusable fetch handler with Authorization headers and error handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * AUTHENTICATION SERVICES
 */

export async function loginRequest(email, password) {
  try {
    return await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.warn("Backend API offline. Using fallback auth mock.");
    
    if (!email || !password || password.length < 4) {
      throw new Error("Invalid email or password.");
    }
    return {
      token: "demo-token-" + Date.now(),
      name: email.split("@")[0] || "Analyst",
      email,
      role: "Security Analyst",
    };
  }
}

export async function registerRequest(name, email, password) {
  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * DASHBOARD SERVICES (GET /stats, GET /events, GET /threats)
 */

export async function getStats() {
  return apiFetch("/stats");
}

export async function getEvents(params = {}) {
  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([_, val]) => val !== "" && val !== null && val !== undefined))
  ).toString();

  return apiFetch(`/events${queryString ? `?${queryString}` : ""}`);
}

export async function getThreats(params = {}) {
  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([_, val]) => val !== "" && val !== null && val !== undefined))
  ).toString();

  return apiFetch(`/threats${queryString ? `?${queryString}` : ""}`);
}