const DEFAULT_API_BASE_URL = import.meta.env.DEV ? "http://localhost:5204" : "";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const getStoredToken = () => localStorage.getItem("token");

const getApiUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is missing for this deployment.");
  }

  return `${API_BASE_URL}${normalizedEndpoint}`;
};

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
  const token = getStoredToken();
  const url = getApiUrl(endpoint);

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || `API Error: ${response.status}`);
  }

  return data;
};
