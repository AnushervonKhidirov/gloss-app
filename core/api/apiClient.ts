import axios from 'axios';

import { HttpException, isHttpException } from '@helper/error-handler';
import authService from '@services/auth.service';

let isRefreshing = false;

const apiClient = axios.create({
  baseURL: 'http://192.168.0.93:4000/',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});

apiClient.interceptors.request.use(async config => {
  const token = await authService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
  return config;
});

apiClient.interceptors.response.use(async response => {
  const originalRequest = response.config;

  if (isHttpException(response.data) && response.data.statusCode === 401 && !isRefreshing) {
    isRefreshing = true;

    const token = await authService.getToken();

    if (!token) {
      throw new HttpException({ message: 'Token not found from Client', statusCode: 404 });
    }

    const [newToken, refreshErr] = await authService.refreshToken(token);

    if (refreshErr) {
      await authService.removeToken();
      throw refreshErr;
    }

    await authService.setToken(newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;

    return apiClient(originalRequest);
  }

  isRefreshing = false;
  return response;
});

export default apiClient;
