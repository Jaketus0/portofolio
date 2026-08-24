import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from './auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If the failing request was the refresh token request itself, stop
      if (originalRequest.url === '/auth/refresh') {
        removeTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        
        if (data.success && data.data) {
          setTokens(data.data.accessToken, data.data.refreshToken);
          processQueue(null, data.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        } else {
           throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
