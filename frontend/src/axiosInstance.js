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

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

const refreshAccessToken = async () => {
  // Prevent multiple refresh calls from the SAME browser.
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

      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      localStorage.setItem(
        "adminToken",
        newAccessToken
      );

      // IMPORTANT:
      // If backend ever returns a new refresh token,
      // save it too.
      if (response.data?.refresh) {
        localStorage.setItem(
          "refresh_token",
          response.data.refresh
        );
      }

      return newAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access_token");

    if (accessToken) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response / not 401
    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Don't retry twice
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Never refresh the refresh request itself
    if (
      originalRequest.url &&
      originalRequest.url.includes(
        "/api/auth/token/refresh/"
      )
    ) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry original request
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
