const DEFAULT_API_BASE_URL = "http://localhost:5204";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const getStoredToken = () => localStorage.getItem("token");

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
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

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
