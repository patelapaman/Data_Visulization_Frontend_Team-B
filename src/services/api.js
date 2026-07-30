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
