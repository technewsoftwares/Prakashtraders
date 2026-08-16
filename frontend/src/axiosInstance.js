import axios from "axios";
import { API_BASE } from "./Config";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// ================= REQUEST INTERCEPTOR =================

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access_token") ||
      localStorage.getItem("adminToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Only handle expired/invalid access token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // ================= REFRESH ALREADY RUNNING =================

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization =
              `Bearer ${newToken}`;

            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refresh_token");

      // ================= NO REFRESH TOKEN =================

      if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("adminToken");

        window.location.href = "/login";

        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        // ================= GET NEW ACCESS TOKEN =================

        const response = await axios.post(
          `${API_BASE}/api/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        // Save new access token
        localStorage.setItem(
          "access_token",
          newAccessToken
        );

        // Update current request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Tell waiting requests about new token
        processQueue(null, newAccessToken);

        // ================= RETRY ORIGINAL REQUEST =================

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh token itself expired/invalid
        processQueue(refreshError, null);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("role");

        window.location.href = "/login";

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
