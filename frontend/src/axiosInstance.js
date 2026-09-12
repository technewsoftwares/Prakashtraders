import axios from "axios";
import { API_BASE } from "./Config";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  refreshPromise = axios
    .post(`${API_BASE}/api/auth/token/refresh/`, {
      refresh: refreshToken,
    })
    .then((response) => {
      const newAccessToken = response.data?.access;

      if (!newAccessToken) {
        throw new Error("No access token returned");
      }

      // Save new access token
      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      // If refresh rotation is enabled later
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

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

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
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Never retry the same request twice
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Never intercept refresh request itself
    if (
      originalRequest.url?.includes(
        "/api/auth/token/refresh/"
      )
    ) {
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

      return axiosInstance(originalRequest);

    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError?.response?.data ||
          refreshError.message
      );

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");

      window.location.replace("/login");

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
