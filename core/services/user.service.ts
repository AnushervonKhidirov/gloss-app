import type { ReturnWithErrPromise } from '@type/common.type';
import type { User } from '@type/user.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';
import dayjs from 'dayjs';

export class UserService {
  private readonly endpoint = '/users';

  async findMe(): ReturnWithErrPromise<User> {
    try {
      const response = await apiClient.get<User>(`${this.endpoint}/me`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findOne(userId: number): ReturnWithErrPromise<User> {
    try {
      const response = await apiClient.get<User>(`${this.endpoint}/${userId}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [this.convertData(response.data), null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(): ReturnWithErrPromise<User[]> {
    try {
      const response = await apiClient.get<User[]>(this.endpoint);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      const users = response.data.map(user => this.convertData(user));
      return [users, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  private convertData(user: User) {
    user.createdAt = dayjs(user.createdAt);
    user.updatedAt = dayjs(user.updatedAt);
    return user;
  }
}
