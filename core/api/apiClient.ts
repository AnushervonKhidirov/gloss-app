import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { AuthService } from '@services/auth.service';

type AxiosRequestConf = AxiosRequestConfig & { _retry: boolean };

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: 'http://192.168.0.93:4000/',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});

apiClient.interceptors.request.use(async config => {
  try {
    const token = await AuthService.getToken();

    if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
    return config;
  } catch (err) {
    return Promise.reject(err);
  }
});

apiClient.interceptors.response.use(
  response => response,
  async (err: AxiosError) => {
    const authService = new AuthService();
    const originalRequest = err.config as AxiosRequestConf;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<void>(function (resolve, reject) {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest) as any);
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      const token = await AuthService.getToken();
      if (token) {
        try {
          console.log('refreshing token');

          const [newToken, err] = await authService.refreshToken(token.refreshToken);
          if (err) throw new AxiosError(err.error);

          AuthService.setToken(newToken);
          isRefreshing = false;
          processQueue(null, newToken.accessToken);
          originalRequest.headers!.Authorization = `Bearer ${newToken.accessToken}`;
          return apiClient(originalRequest);
        } catch (err) {
          console.log(err);

          isRefreshing = false;
          processQueue(err as AxiosError, null);
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(err);
  },
);

export default apiClient;
