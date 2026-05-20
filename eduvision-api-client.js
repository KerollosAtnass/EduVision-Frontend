const API_HOST =
  typeof window !== "undefined" && window.location && window.location.hostname
    ? window.location.hostname
    : "localhost";
const API_BASE = `http://${API_HOST}:4000/api`;

async function eduvisionApi(path, options = {}) {
  const token = localStorage.getItem("eduvision-token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}

window.eduvisionApi = eduvisionApi;
