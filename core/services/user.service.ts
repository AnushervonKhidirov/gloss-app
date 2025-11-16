import type { ReturnWithErrPromise } from '@type/common.type';
import type { User } from '@type/user.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

export class UserService {
  private readonly endpoint = '/users';

  async findMe(): ReturnWithErrPromise<User> {
    try {
      const response = await apiClient.get<User>(`${this.endpoint}/me`);
      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findOne(userId: number): ReturnWithErrPromise<User> {
    try {
      const response = await apiClient.get<User>(`${this.endpoint}/${userId}`);
      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(): ReturnWithErrPromise<User[]> {
    try {
      const response = await apiClient.get<User[]>(this.endpoint);
      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}
