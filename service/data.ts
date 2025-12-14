/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";

const BaseURL = "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
  baseURL: BaseURL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        processQueue("No refresh token", null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      const res = await api.post("/auth/refresh/", {
        refresh: refreshToken,
      });

      const newToken = res.data.access;
      const newRefresh = res.data.refresh;

      Cookies.set("token", newToken);
      if (newRefresh) Cookies.set("refreshToken", newRefresh);

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      processQueue(null, newToken);

      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
