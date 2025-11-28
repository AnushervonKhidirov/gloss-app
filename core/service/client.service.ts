import type { Client, CreateClient, QueryClient, UpdateClient } from '@type/client.type';
import type { ReturnWithErrPromise } from '@type/common.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

class ClientService {
  private readonly endpoint = '/client';

  async findOne(id: number): ReturnWithErrPromise<Client> {
    try {
      const response = await apiClient.get<Client>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(query: QueryClient = {}): ReturnWithErrPromise<Client[]> {
    try {
      const queryParams = new URLSearchParams(query);
      const response = await apiClient.get<Client[]>(`${this.endpoint}?${queryParams}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
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

  async update(id: number, updateClient: UpdateClient): ReturnWithErrPromise<Client> {
    try {
      const response = await apiClient.patch<Client>(`${this.endpoint}/${id}`, updateClient);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async delete(id: number): ReturnWithErrPromise<Client> {
    try {
      const response = await apiClient.delete<Client>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}

export default new ClientService();
