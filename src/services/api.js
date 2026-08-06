const API_BASE_URL = "http://127.0.0.1:5000/api";

// ---------- AUTH ----------

export async function loginRequest(email, password) {
  return {
    id: 1,
    name: "Analyst",
    email,
    token: "dummy-token",
  };
}

export async function registerRequest() {
  return {
    success: true,
  };
}

// ---------- Helper ----------

async function fetchData(endpoint, fallback = []) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}/`);

    if (!res.ok) {
      return fallback;
    }

    const json = await res.json();

    // If backend returns { data: [...] }, return only the array
    if (json.data !== undefined) {
      return json.data;
    }

    return json;
  } catch (err) {
    console.error(`${endpoint} API unavailable`, err);
    return fallback;
  }
}

// ---------- API Calls ----------

export const getStats = () => fetchData("dashboard", {});
export const getEvents = () => fetchData("events", []);
export const getAssets = () => fetchData("assets", []);
export const getThreats = () => fetchData("threats", []);
export const getIncidents = () => fetchData("incidents", []);
export const getVulnerabilities = () => fetchData("vulnerabilities", []);
export const getAnalytics = () => fetchData("analytics", {});