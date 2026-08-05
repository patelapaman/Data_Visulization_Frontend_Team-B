const API_BASE_URL = "http://127.0.0.1:5000/api";

// ---------------- AUTH ----------------

export async function loginRequest(email, password) {
  return {
    id: 1,
    name: "Analyst",
    email,
    token: "dummy-token",
  };
}

export async function registerRequest(userData) {
  return {
    success: true,
    message: "Registration Successful",
  };
}

// ---------------- DASHBOARD ----------------

export async function getStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard`);

  if (!res.ok) throw new Error("Failed to fetch dashboard");

  return await res.json();
}

// ---------------- EVENTS ----------------

export async function getEvents() {
  const res = await fetch(`${API_BASE_URL}/events`);

  if (!res.ok) throw new Error("Failed to fetch events");

  return await res.json();
}

// ---------------- ASSETS ----------------

export async function getAssets() {
  const res = await fetch(`${API_BASE_URL}/assets`);

  if (!res.ok) throw new Error("Failed to fetch assets");

  return await res.json();
}

// ---------------- INCIDENTS ----------------

export async function getIncidents() {
  const res = await fetch(`${API_BASE_URL}/incidents`);

  if (!res.ok) throw new Error("Failed to fetch incidents");

  return await res.json();
}

// ---------------- VULNERABILITIES ----------------

export async function getVulnerabilities() {
  const res = await fetch(`${API_BASE_URL}/vulnerabilities`);

  if (!res.ok) throw new Error("Failed to fetch vulnerabilities");

  return await res.json();
}

// ---------------- ANALYTICS ----------------

export async function getAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`);

  if (!res.ok) throw new Error("Failed to fetch analytics");

  return await res.json();
}

// ---------------- THREATS ----------------

export async function getThreats() {
  const res = await fetch(`${API_BASE_URL}/threats`);

  if (!res.ok) throw new Error("Failed to fetch threats");

  return await res.json();
}