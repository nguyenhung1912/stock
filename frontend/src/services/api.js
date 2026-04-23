const DEFAULT_API_BASE_URL = "https://stock-dpbf.onrender.com";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");
const WARMUP_STORAGE_KEY = "api-warmup-at";
const WARMUP_TTL_MS = 5 * 60 * 1000;

const getStoredToken = () => localStorage.getItem("token");
const canUseSessionStorage = () => typeof window !== "undefined" && window.sessionStorage;
const buildUrl = (endpoint) =>
  `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

const parseResponse = async (response) => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = options.auth === false ? null : getStoredToken();
  const url = buildUrl(endpoint);

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const { auth: _auth, ...fetchOptions } = options;
  const response = await fetch(url, { ...fetchOptions, headers });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || `API Error: ${response.status}`);
  }

  return data;
};

export const warmApi = async () => {
  if (!canUseSessionStorage()) {
    return;
  }

  const lastWarmupAt = Number(sessionStorage.getItem(WARMUP_STORAGE_KEY) || 0);

  if (Date.now() - lastWarmupAt < WARMUP_TTL_MS) {
    return;
  }

  sessionStorage.setItem(WARMUP_STORAGE_KEY, String(Date.now()));

  try {
    await fetch(buildUrl("/health"), { method: "GET", mode: "cors" });
  } catch {
    // Best-effort warmup only.
  }
};
