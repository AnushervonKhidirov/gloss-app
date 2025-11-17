import type { Client, CreateClient } from '@type/client.type';
import type { ReturnWithErrPromise } from '@type/common.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

export class ClientService {
  private readonly endpoint = '/client';

  async findOne(phone: string): ReturnWithErrPromise<Client> {
    try {
      const response = await apiClient.get<Client[]>(`${this.endpoint}?phone=${phone}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      if (!response.data[0]) throw new HttpException({ statusCode: 404, message: 'Client not found' });
      return [response.data[0], null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(createClient: CreateClient): ReturnWithErrPromise<Client> {
    try {
      const response = await apiClient.post<Client>(this.endpoint, createClient);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}
