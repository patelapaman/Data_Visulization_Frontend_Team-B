// ============================================================
// api.js — shared API service
// ------------------------------------------------------------
// This is a starter stub so the Login page and routing have
// something real to call. Member 7 (API Integration & Services)
// owns turning this into the full shared client for every
// endpoint (GET /events, GET /stats, GET /threats, etc.) with
// proper loading/error handling.
// ============================================================

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * loginRequest
 * TEMPORARY mock implementation so the login flow is testable
 * before the backend auth endpoint exists. Replace the body with
 * a real fetch/axios call, e.g.:
 *
 *   const res = await fetch(`${BASE_URL}/login`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ email, password }),
 *   });
 *   if (!res.ok) throw new Error("Invalid credentials");
 *   return res.json(); // { token, name, email, role }
 */
export async function loginRequest(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 600)); // simulate latency

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  if (password.length < 4) {
    throw new Error("Invalid email or password.");
  }

  return {
    token: "demo-token-" + Date.now(),
    name: email.split("@")[0] || "Analyst",
    email,
    role: "Security Analyst",
  };
}


export async function registerRequest(name, email, password) {
  // Temporary mock

  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  return {
    success: true,
    message: "Account created successfully!"
  };

  // Later replace with:
  /*
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
  */
}



// Fetch Security Events
export async function getEvents() {
  const response = await fetch(`${BASE_URL}/events`);

  if (!response.ok) {
    throw new Error("Unable to fetch events");
  }

  return response.json();
}

export async function getStats() {
  const response = await fetch(`${BASE_URL}/stats`);

  if (!response.ok) {
    throw new Error("Unable to fetch stats");
  }

  return response.json();
}