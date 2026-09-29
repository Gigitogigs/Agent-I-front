import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const TOKEN_KEY = 'access_token';

let refreshTimeout: NodeJS.Timeout | null = null;

export const tokenStore = {
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  set: (token: string, expiresIn: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, token);
      scheduleRefresh(expiresIn);
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }
    }
  },
};

// Proactive refresh 60s before expiry
function scheduleRefresh(expiresIn: number) {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
  const delay = Math.max((expiresIn - 60) * 1000, 0);
  refreshTimeout = setTimeout(async () => {
    try {
      const { data } = await axios.post<{access_token: string; expires_in: number}>(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
      const { axiosInstance } = await import('./api-client');
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      tokenStore.set(data.access_token, data.expires_in);
    } catch { 
      // refresh failed; the 401 interceptor will handle it
    }
  }, delay);
}
