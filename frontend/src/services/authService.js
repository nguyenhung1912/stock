import { fetchApi } from "@/services/api";

const normalizeAuthResponse = (data) => ({
  token: data?.accessToken ?? data?.token ?? null,
  refreshToken: data?.refreshToken ?? null,
  user: data?.user ?? null,
});

export const authService = {
  login: async (username, password) => {
    const data = await fetchApi("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    return normalizeAuthResponse(data);
  },

  register: async (user) => {
    const data = await fetchApi("/users", {
      method: "POST",
      body: JSON.stringify(user),
    });

    return normalizeAuthResponse(data);
  },

  logout: () =>
    fetchApi("/logout", {
      method: "POST",
    }),

  getMe: () => fetchApi("/me"),

  refreshToken: (refreshToken) =>
    fetchApi("/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
};
