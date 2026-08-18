import axios from "axios";
import { API_BASE } from "./Config";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

let refreshPromise = null;

const clearAuthAndRedirect = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("role");

  if (
    window.location.pathname !== "/admin-login" &&
    window.location.pathname !== "/login"
  ) {
    window.location.replace("/admin-login");
  }
};

const refreshAccessToken = async () => {
  // If another request is already refreshing the token,
  // wait for that same refresh request.
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  refreshPromise = axios
    .post(
      `${API_BASE}/api/auth/token/refresh/`,
      {
        refresh: refreshToken,
      },
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const newAccessToken = response.data?.access;

      if (!newAccessToken) {
        throw new Error(
          "Refresh endpoint did not return an access token"
        );
      }

      localStorage.setItem("access_token", newAccessToken);

      // Keep old key temporarily for older components.
      localStorage.setItem("adminToken", newAccessToken);

      return newAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// ================= REQUEST INTERCEPTOR =================

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Not a 401 error
    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Don't retry the same request more than once.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Never try to refresh the refresh request itself.
    if (
      originalRequest.url &&
      originalRequest.url.includes("/api/auth/token/refresh/")
    ) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry original request with the new token.
      return axiosInstance(originalRequest);

    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError
      );

      clearAuthAndRedirect();

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
