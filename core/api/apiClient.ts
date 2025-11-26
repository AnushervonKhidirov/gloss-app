import type { Token } from '@type/auth.type';

import TokenService from '@services/token.service';
import axios from 'axios';

import { HttpException, isHttpException } from '@helper/error-handler';

let isRefreshing = false;

const apiClient = axios.create({
  baseURL: 'http://192.168.0.93:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});

apiClient.interceptors.request.use(async config => {
  const token = await TokenService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
  return config;
});

apiClient.interceptors.response.use(async response => {
  const originalRequest = response.config;

  if (isHttpException(response.data) && response.data.statusCode === 401 && !isRefreshing) {
    isRefreshing = true;

    const token = await TokenService.getToken();

    if (!token) {
      throw new HttpException({ message: 'Token not found from Client', statusCode: 404 });
    }

    const response = await apiClient.post<Token>('/auth/refresh-token', token);

    if (isHttpException(response.data)) {
      await TokenService.removeToken();
      throw new HttpException(response.data);
    }

    await TokenService.setToken(response.data);
    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

    return apiClient(originalRequest);
  }

  isRefreshing = false;
  return response;
});

export default apiClient;
