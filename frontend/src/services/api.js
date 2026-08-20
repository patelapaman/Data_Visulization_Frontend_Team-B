export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

console.log("API BASE URL:", API_BASE_URL);
// ---------------- LOGIN ----------------

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
      return fallback;
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (data.data) {
      return data.data;
    }

    return data;

  } catch {
    return fallback;
  }
}

// ---------------- APIs ----------------

export const getStats = () => fetchData("dashboard", {});
export const getEvents = () => fetchData("events", []);
export const getAssets = () => fetchData("assets", []);
export const getThreats = () => fetchData("threats", []);
export const getIncidents = () => fetchData("incidents", []);
export const getVulnerabilities = () => fetchData("vulnerabilities", []);
export const getAnalytics = () => fetchData("analytics", {});
export const getProfile = () => fetchData("profile", {});

/**
 * updateProfile
 * Saves profile edits (name, phone, department, designation) to the
 * backend if it's reachable. The Profile page always applies the
 * edit locally via AuthContext.updateUser() regardless of whether
 * this call succeeds, so editing still works during local/offline
 * development without a running backend.
 */
export async function updateProfile(payload) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Could not reach the server to save changes.");
  }

  return response.json();
}
export const getNotifications = () => fetchData("notifications", []);
export const getSectionAnalytics = () => fetchData("section-analytics", {});