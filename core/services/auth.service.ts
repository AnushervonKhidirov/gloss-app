import type { RefreshToken, SignIn, Token } from '@type/auth.type';
import type { ReturnWithErrPromise } from '@type/common.type';
import type { CreateUser } from '@type/user.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';

class AuthService {
  private readonly endpoint = '/auth';

  async signUp(data: CreateUser): ReturnWithErrPromise<Token> {
    try {
      if (!data.lastName) delete data.lastName;

      const response = await apiClient.post<Token>(`${this.endpoint}/sign-up`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async signIn(data: SignIn): ReturnWithErrPromise<Token> {
    try {
      const response = await apiClient.post<Token>(`${this.endpoint}/sign-in`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async signOut(data: RefreshToken): ReturnWithErrPromise<null> {
    try {
      const response = await apiClient.post<Token>(`${this.endpoint}/sign-out`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [null, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async signOutEverywhere(data: RefreshToken): ReturnWithErrPromise<null> {
    try {
      const response = await apiClient.post<Token>(`${this.endpoint}/sign-out-everywhere`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [null, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async refreshToken(data: RefreshToken): ReturnWithErrPromise<Token> {
    try {
      const response = await apiClient.post<Token>(`${this.endpoint}/refresh-token`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async getToken(): Promise<Token | null> {
    const accessToken = await getItemAsync('access_token');
    const refreshToken = await getItemAsync('refresh_token');

    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  }

  async setToken({ accessToken, refreshToken }: Token) {
    await setItemAsync('access_token', accessToken);
    await setItemAsync('refresh_token', refreshToken);
  }

  async removeToken() {
    await deleteItemAsync('access_token');
    await deleteItemAsync('refresh_token');
  }
}

export default new AuthService();
