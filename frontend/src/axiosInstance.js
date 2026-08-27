import axios from "axios";
import { API_BASE } from "./Config";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

let refreshPromise = null;

// =====================================================
// CLEAR AUTH
// =====================================================

const clearAuthAndRedirect = () => {
  console.log("🔴 Clearing authentication");

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
  // Prevent multiple refresh requests
  if (refreshPromise) {
    console.log("⏳ Refresh already running...");
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem("refresh_token");

  console.log(
    "🔑 Refresh token exists:",
    !!refreshToken
  );

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
      console.log(
        "✅ Refresh response:",
        response.data
      );

      const newAccessToken = response.data?.access;

      if (!newAccessToken) {
        throw new Error(
          "Refresh endpoint did not return access token"
        );
      }

      // Save new access token
      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      // Keep adminToken synchronized
      localStorage.setItem(
        "adminToken",
        newAccessToken
      );

      // If backend rotates refresh token
      if (response.data?.refresh) {
        localStorage.setItem(
          "refresh_token",
          response.data.refresh
        );
      }

      console.log("🟢 New access token saved");

      return newAccessToken;
    })
    .catch((error) => {
      console.error(
        "❌ Refresh request failed:",
        error?.response?.data || error.message
      );

      throw error;
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
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    console.log(
      "⚠️ Axios error:",
      error.response?.status,
      error.response?.data
    );

    // No response
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry same request twice
    if (originalRequest._retry) {
      console.error(
        "❌ Request already retried"
      );

      return Promise.reject(error);
    }

    // Never intercept refresh request
    if (
      originalRequest.url?.includes(
        "/api/auth/token/refresh/"
      )
    ) {
      clearAuthAndRedirect();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.log(
        "🔄 Access token expired. Refreshing..."
      );

      const newAccessToken =
        await refreshAccessToken();

      // Update request header
      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      console.log(
        "🔁 Retrying:",
        originalRequest.url
      );

      // Retry original request
      return axiosInstance(originalRequest);

    } catch (refreshError) {
      console.error(
        "❌ Unable to refresh token:",
        refreshError?.response?.data ||
          refreshError.message
      );

      clearAuthAndRedirect();

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
