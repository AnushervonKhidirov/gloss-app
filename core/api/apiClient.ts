import axios from 'axios';

import { isHttpException } from '@helper/error-handler';
import { AuthService } from '@services/auth.service';

const apiClient = axios.create({
  baseURL: 'http://192.168.0.93:4000/',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});

apiClient.interceptors.request.use(async config => {
  const token = await AuthService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
  return config;
});

apiClient.interceptors.response.use(async response => {
  console.log('response (interceptors)', response.data);
  const authService = new AuthService();
  const originalRequest = response.config;

  if (isHttpException(response.data) && response.data.statusCode === 401) {
    const token = await AuthService.getToken();

    if (!token) return response;

    const [newToken, refreshErr] = await authService.refreshToken(token?.refreshToken);
    if (refreshErr) return response;

    AuthService.setToken(newToken);
    originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;

    return apiClient(originalRequest);
  }

  return response;
});

export default apiClient;
