import type { RefreshToken, SignIn, Token } from '@type/auth.type';
import type { ReturnWithErrPromise } from '@type/common.type';
import type { CreateUser } from '@type/user.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

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
}

export default new AuthService();
