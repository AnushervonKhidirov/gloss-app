import type { Category, CreateCategory, UpdateCategory } from '@type/category.type';
import type { ReturnWithErrPromise } from '@type/common.type';

import apiClient from '@api/apiClient';
import { errorHandler, HttpException, isHttpException } from '@helper/error-handler';

export class CategoryService {
  private readonly endpoint = '/category';

  async findOne(id: number): ReturnWithErrPromise<Category> {
    try {
      const response = await apiClient.get<Category>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async findMany(): ReturnWithErrPromise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(this.endpoint);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async create(data: CreateCategory): ReturnWithErrPromise<Category> {
    try {
      const response = await apiClient.post<Category>(this.endpoint, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async update(id: number, data: UpdateCategory): ReturnWithErrPromise<Category> {
    try {
      const response = await apiClient.patch<Category>(`${this.endpoint}/${id}`, data);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }

  async delete(id: number): ReturnWithErrPromise<Category> {
    try {
      const response = await apiClient.delete<Category>(`${this.endpoint}/${id}`);

      if (isHttpException(response.data)) throw new HttpException(response.data);
      return [response.data, null];
    } catch (err) {
      return errorHandler(err);
    }
  }
}
