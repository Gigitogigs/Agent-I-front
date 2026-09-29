import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "./token-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== 'undefined') {
  const storedToken = tokenStore.get();
  if (storedToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
}

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("[apiClient] Interceptor caught error:", error.message, error.response?.status);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.log("[apiClient] 401 detected, isRefreshing:", isRefreshing);
      if (isRefreshing) {
        console.log("[apiClient] Queuing request for url:", originalRequest.url);
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            console.log("[apiClient] Retrying queued request for url:", originalRequest.url);
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            console.log("[apiClient] Queued request rejected:", err.message);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log("[apiClient] Starting refresh process");

      try {
        const { data } = await axios.post<{access_token: string, expires_in: number}>(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        console.log("[apiClient] Refresh success");
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        tokenStore.set(data.access_token, data.expires_in);
        isRefreshing = false;
        processQueue(null, data.access_token);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("[apiClient] Refresh failed:", refreshError);
        isRefreshing = false;
        processQueue(refreshError as Error);
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    console.log("[apiClient] Rejecting with error:", error.message);
    return Promise.reject(error);
  }
);

// Wrapper for simple use-cases (maintaining previous signature)
export const apiClient = {
  get: <T>(path: string) => axiosInstance.get<T>(path).then((res) => res.data),
  post: <T>(path: string, body?: unknown) => axiosInstance.post<T>(path, body).then((res) => res.data),
  put: <T>(path: string, body?: unknown) => axiosInstance.put<T>(path, body).then((res) => res.data),
  patch: <T>(path: string, body?: unknown) => axiosInstance.patch<T>(path, body).then((res) => res.data),
  delete: <T>(path: string, body?: unknown) => axiosInstance.delete<T>(path, { data: body }).then((res) => res.data),
};
