export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

<<<<<<< HEAD
// ---------------- LOGIN ----------------
=======
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
>>>>>>> 782dd70ab0d199645c146adda816cab205fcfece

export async function loginRequest(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login Failed");
  }

  return data.user;
}

// ---------------- REGISTER ----------------

export async function registerRequest(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration Failed");
  }

  return data;
}

// ---------------- COMMON FETCH ----------------

async function fetchData(endpoint, fallback) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);

    if (!response.ok) {
      console.log(endpoint, "failed");
      return fallback;
    }

    const data = await response.json();

    console.log(endpoint, data);

    if (Array.isArray(data)) {
      return data;
    }

    if (data.data) {
      return data.data;
    }

    return data;

  } catch (err) {
    console.log(err);
    return fallback;
  }
}

// ---------------- APIs ----------------

<<<<<<< HEAD
export const getStats = () => fetchData("dashboard", {});
export const getEvents = () => fetchData("events", []);
export const getAssets = () => fetchData("assets", []);
export const getThreats = () => fetchData("threats", []);
export const getIncidents = () => fetchData("incidents", []);
export const getVulnerabilities = () => fetchData("vulnerabilities", []);
export const getAnalytics = () => fetchData("analytics", {});
export const getProfile = () => fetchData("profile", {});
export const getNotifications = () => fetchData("notifications", []);
export const getSectionAnalytics = () => fetchData("section-analytics", {});
=======
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

export async function getThreatSummary() {
  return apiFetch("/threat-summary");
}
>>>>>>> 782dd70ab0d199645c146adda816cab205fcfece
