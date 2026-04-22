/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);
const emptyAuthState = { token: null, refreshToken: null, user: null };

function getStoredUser() {
  try {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function getStoredAuth() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  return {
    token,
    refreshToken,
    user: token ? getStoredUser() : null,
  };
}

function saveAuth(token, refreshToken, user) {
  localStorage.setItem("token", token);

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getStoredAuth);

  useEffect(() => {
    if (!authState.token || authState.user) {
      return undefined;
    }

    let ignore = false;

    async function syncCurrentUser() {
      try {
        const user = await authService.getMe();

        if (!ignore) {
          saveAuth(authState.token, authState.refreshToken, user);
          setAuthState((prev) => ({ ...prev, user }));
        }
      } catch (error) {
        console.error("Get current user API Error:", error);

        if (!ignore) {
          clearAuth();
          setAuthState(emptyAuthState);
        }
      }
    }

    syncCurrentUser();

    return () => {
      ignore = true;
    };
  }, [authState.refreshToken, authState.token, authState.user]);

  async function login(username, password) {
    try {
      const data = await authService.login(username, password);

      if (data?.token && data?.user) {
        saveAuth(data.token, data.refreshToken, data.user);
        setAuthState({
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
        });

        return { success: true, user: data.user };
      }

      clearAuth();
      setAuthState(emptyAuthState);
      return { success: false, message: "Invalid login response from server." };
    } catch (error) {
      console.error("Login API Error:", error);
      clearAuth();
      setAuthState(emptyAuthState);
      return {
        success: false,
        message: error.message || "Unable to login with the backend.",
      };
    }
  }

  async function logout() {
    try {
      if (authState.token) {
        await authService.logout();
      }
    } catch (error) {
      console.error("Logout API Error:", error);
    } finally {
      clearAuth();
      setAuthState(emptyAuthState);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        login,
        logout,
        isLoggedIn: Boolean(authState.user && authState.token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
